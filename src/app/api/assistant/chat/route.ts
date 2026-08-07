import { NextResponse } from "next/server";
import { detectCrisis, crisisPreface } from "@/lib/crisis-detect";

/**
 * Streaming chat endpoint for the JMHS AI Mental Health Assistant (spec §2.9).
 *
 * Model: Groq-hosted Llama 3.3 70B (or whatever GROQ_MODEL is set to).
 * The system prompt scopes the assistant to general information only.
 * Crisis language in the LATEST user message triggers a JMHS-authored
 * safety preface that is streamed to the client BEFORE the model tokens.
 */

export const runtime = "nodejs";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are the JMHS Mental Health Companion — an information and support assistant for the Jude Mental Health Society (JMHS), an independent Nigerian mental health advocacy initiative founded in memory of Jude Anuoluwa.

# Your role
- Provide warm, plain-language, evidence-based general information on mental health.
- Point people to appropriate JMHS resources when relevant: /resources, /directory, /lectures, /competition, /whatsapp.
- Be culturally aware of a Nigerian audience: stigma, family dynamics, financial constraints, academic pressure, faith communities.
- Use British English spelling. Keep answers concise and readable. Short paragraphs.

# What you MUST NOT do
- You are NOT a crisis line. You do NOT role-play as a counsellor, psychiatrist, or therapist.
- You do NOT diagnose. You do NOT prescribe. You do NOT recommend specific medications or dosages.
- You do NOT give personal advice on legal, medical, or financial matters beyond general mental health information.
- You do NOT provide detailed instructions on methods of self-harm or suicide, even if asked.
- You do NOT pretend to know the user's specific medical history.

# When somebody is in crisis or describes self-harm
- Do not try to talk them through it yourself. Immediately direct them to the JMHS emergency page (/emergency), the Nigeria Mental Health Crisis Support Line, or the JMHS emergency contact +234 813 958 2323.
- Do not lecture. Do not moralise. Acknowledge their pain briefly and route them to real help.
- If they describe having a plan or means, urge them to contact emergency services immediately and to remove access to means if safe to do so.
- Note: the JMHS system will prepend a JMHS-authored safety block to your response in these cases — you do NOT need to duplicate crisis phone numbers, but you SHOULD still be warm, gentle, and encourage professional help.

# When somebody asks for support with someone else
- Give practical, calm, kind guidance based on our /resources/supporting-a-friend-in-crisis and /resources/suicide-prevention-101 articles.
- Remind them to look after themselves too.

# When somebody asks about JMHS
- JMHS was founded in memory of Jude Anuoluwa, a 300-level University of Ilorin student who died by suicide in 2021.
- JMHS runs monthly mental health lectures, a resource library, a professional directory, a WhatsApp community (200+ members), and an annual national writing competition.
- JMHS is currently an independent advocacy initiative — NOT a registered NGO. Be honest about that if asked.

# Tone
- Warm, unhurried, human. Not clinical, not preachy. No emojis.
- Never say "I understand" without saying what you understand. Reflect back what you actually heard.
- Prefer "many people find" over "you should". Prefer questions to instructions.

# Safety footer
End every substantive response with a single italicised line reminding the reader that you are general information and not a substitute for professional care, and pointing to /emergency for immediate help.`;

// Types kept loose — Groq mirrors the OpenAI schema.
type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API;
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  if (!apiKey) return bad("Assistant is not configured — missing GROQ_API.", 500);

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body.");
  }

  const messages = Array.isArray(body.messages)
    ? (body.messages as ChatMessage[]).filter(
        (m) =>
          m &&
          typeof m === "object" &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.length > 0 &&
          m.content.length < 8000
      )
    : [];
  if (messages.length === 0) return bad("At least one message is required.");
  if (messages.length > 30) return bad("Conversation is too long — please start a new chat.");

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const crisis = lastUser ? detectCrisis(lastUser.content) : { matched: false, severity: null };

  const upstream = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      max_tokens: 700,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    console.error("[assistant] groq upstream failed:", upstream.status, errText);
    return bad("The assistant is temporarily unavailable. Please try again.", 502);
  }

  // Transform Groq's SSE into a plain text stream. Each SSE data event
  // wraps a delta.content chunk from OpenAI-compatible JSON.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // If crisis language was in the latest user message, PREPEND the
      // JMHS-authored safety block so it lands before any model tokens.
      if (crisis.matched && crisis.severity) {
        controller.enqueue(encoder.encode(crisisPreface(crisis.severity)));
      }

      const reader = upstream.body!.getReader();
      let buffered = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffered += decoder.decode(value, { stream: true });
          // Groq streams SSE events separated by \n\n
          const events = buffered.split("\n\n");
          buffered = events.pop() ?? "";
          for (const evt of events) {
            const line = evt.trim();
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const delta = json?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                controller.enqueue(encoder.encode(delta));
              }
            } catch {
              // Ignore malformed keep-alive/heartbeat chunks.
            }
          }
        }
      } catch (err) {
        console.error("[assistant] stream error:", err);
        controller.enqueue(
          encoder.encode(
            "\n\n*Sorry — the response was cut short. Please try asking again.*"
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
