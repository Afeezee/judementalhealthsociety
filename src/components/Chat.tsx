"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RenderMarkdown } from "@/lib/md";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "jmhs-assistant-chat";
const SUGGESTIONS = [
  "What are the warning signs of depression I should look for in a friend?",
  "How do I start a conversation with a family member I'm worried about?",
  "What is the 5-4-3-2-1 grounding technique and when does it help?",
  "How do I find a therapist in Nigeria I can actually afford?",
];

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Restore history on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist history and scroll on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function autosize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }

  async function send(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setError(null);
    setStreaming(true);

    // Add an empty assistant slot we'll stream into
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Something went wrong." }));
        setError(err.error || "Something went wrong.");
        // Drop the empty assistant slot
        setMessages((m) => m.slice(0, -1));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  }

  function reset() {
    if (streaming) return;
    if (messages.length > 0 && !confirm("Start a new conversation? Your current chat will be cleared from this device.")) {
      return;
    }
    setMessages([]);
    setError(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Message list */}
      <div
        ref={listRef}
        aria-live="polite"
        aria-label="Conversation"
        className="max-h-[65vh] min-h-[320px] overflow-y-auto rounded-2xl border border-hairline bg-bg-surface p-4 md:p-6 space-y-5"
      >
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="font-display text-xl md:text-2xl font-medium mb-2">
              Where would you like to start?
            </div>
            <p className="text-sm text-fg-muted mb-6 max-w-md mx-auto">
              Pick a suggestion below, or ask your own question.
            </p>
            <div className="grid gap-2 sm:grid-cols-2 max-w-2xl mx-auto text-left">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-xl border border-hairline bg-bg p-4 text-sm text-fg-muted hover:text-fg hover:border-brand transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-brand text-white"
                    : "bg-bg-elevated text-fg"
                }`}
              >
                {m.role === "assistant" ? (
                  m.content ? (
                    <div className="prose prose-neutral max-w-none [&_p]:my-2 [&_p]:leading-relaxed [&_p]:text-base">
                      <RenderMarkdown body={m.content} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-fg-muted py-1">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  )
                ) : (
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{m.content}</p>
                )}
              </div>
            </div>
          ))
        )}

        <style>{`
          @keyframes typing {
            0%, 60%, 100% { opacity: 0.2; }
            30% { opacity: 1; }
          }
          .typing-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
            animation: typing 1.2s infinite;
          }
          .typing-dot:nth-child(2) { animation-delay: 0.15s; }
          .typing-dot:nth-child(3) { animation-delay: 0.3s; }
          @media (prefers-reduced-motion: reduce) {
            .typing-dot { animation: none !important; opacity: 0.6; }
          }
        `}</style>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-signal-red/40 bg-signal-red/5 px-4 py-3 text-sm text-signal-red-strong">
          {error}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="rounded-2xl border border-hairline bg-bg-surface p-3 focus-within:border-brand transition-colors"
      >
        <label className="sr-only" htmlFor="chat-input">Message the JMHS Companion</label>
        <textarea
          ref={textareaRef}
          id="chat-input"
          rows={1}
          value={input}
          onChange={(e) => { setInput(e.target.value); autosize(); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={streaming}
          placeholder="Ask a question about mental health, or how to support someone…"
          className="w-full resize-none bg-transparent px-2 py-1.5 text-fg placeholder:text-fg-muted focus:outline-none disabled:opacity-60"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-[11px] text-fg-muted">
            Enter to send · Shift+Enter for a new line ·{" "}
            <Link href="/emergency" className="text-signal-red font-semibold hover:underline">
              in a crisis?
            </Link>
          </p>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                disabled={streaming}
                className="text-xs font-semibold text-fg-muted hover:text-fg disabled:opacity-60"
              >
                New chat
              </button>
            )}
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {streaming ? "Sending…" : "Send"}
              {!streaming && (
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M2.4 3.6a1 1 0 0 1 1.2-.4l14 6a1 1 0 0 1 0 1.8l-14 6a1 1 0 0 1-1.4-1.1L4 11H10a1 1 0 1 0 0-2H4L2.2 4.7a1 1 0 0 1 .2-1.1z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>

      <p className="text-xs text-fg-muted italic">
        This assistant is general information only. It does not diagnose, does
        not prescribe, and is not a substitute for a mental health professional.
      </p>
    </div>
  );
}
