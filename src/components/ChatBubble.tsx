"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RenderMarkdown } from "@/lib/md";

/**
 * Floating AI Companion (spec §2.9 delivery surface).
 *
 * A single fixed bubble in the bottom-right corner of every public page.
 * Clicking it opens a compact chat panel anchored to the same corner
 * on desktop, and a full-height sheet on mobile.
 *
 * Deliberately NOT shown on:
 *  - /assistant           — the full-page version already IS this
 *  - /emergency           — crisis page must be undistracted
 *  - /admin/**            — admin work surface
 *  - /sign-in, /sign-up   — auth flow
 */

const HIDDEN_PATTERNS: RegExp[] = [
  /^\/assistant/,
  /^\/emergency/,
  /^\/admin/,
  /^\/sign-in/,
  /^\/sign-up/,
];

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "jmhs-bubble-chat";
const OPEN_KEY = "jmhs-bubble-open";
const SUGGESTIONS = [
  "How do I recognise depression in a friend?",
  "What is the 5-4-3-2-1 grounding technique?",
  "How do I start a conversation about mental health with my family?",
];

export function ChatBubble() {
  const pathname = usePathname() ?? "/";
  const hidden = HIDDEN_PATTERNS.some((p) => p.test(pathname));

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Restore state after mount to avoid hydration mismatch.
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
      // Do NOT auto-open on load — respects user intent between visits.
      sessionStorage.getItem(OPEN_KEY) === "1" && setOpen(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try { sessionStorage.setItem(OPEN_KEY, open ? "1" : "0"); } catch {}
    // Escape closes
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mounted]);

  if (hidden || !mounted) return null;

  async function send(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || streaming) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setError(null);
    setStreaming(true);
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
    if (messages.length > 0 && !confirm("Start a new chat? Your current messages will be cleared from this device.")) return;
    setMessages([]);
    setError(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  return (
    <>
      {/* Backdrop on mobile only, so tap-outside closes the sheet */}
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Panel — sized to always fit within the viewport.
          Mobile: bottom sheet, capped at 85dvh so the top isn't
          jammed against the notch / URL bar and the trigger stays visible.
          Desktop: right-anchored panel sized to min(600px, viewport-160px),
          so on short windows it still fits with room for the bubble.
          overflow-hidden on the outer container forces the inner message
          list to actually scroll instead of the whole panel overflowing. */}
      {open && (
        <div
          role="dialog"
          aria-label="JMHS Mental Health Companion"
          aria-modal="true"
          className="fixed z-50 flex flex-col overflow-hidden shadow-2xl border border-hairline bg-bg-surface
                     inset-x-2 bottom-2 max-h-[85dvh] rounded-2xl
                     md:inset-auto md:right-6 md:bottom-24 md:top-auto md:left-auto
                     md:w-[400px] md:max-h-[min(640px,calc(100dvh-140px))]
                     md:h-auto md:rounded-2xl"
        >
          {/* Header — shrink-0 so it never gets squeezed by the messages */}
          <div className="shrink-0 flex items-center justify-between gap-2 border-b border-hairline px-4 py-3 bg-brand text-white">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] font-semibold opacity-80">
                JMHS
              </div>
              <div className="font-display text-base font-semibold">Mental Health Companion</div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/assistant"
                onClick={() => setOpen(false)}
                title="Open full page"
                className="rounded-md p-1.5 hover:bg-white/10 text-white/90"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M6 4a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2v6a1 1 0 1 1-2 0V6.4L6.7 13.7a1 1 0 0 1-1.4-1.4L12.6 5H7a1 1 0 0 1-1-1z" />
                  <path d="M3 8a2 2 0 0 1 2-2h1a1 1 0 1 1 0 2H5v7h7v-1a1 1 0 1 1 2 0v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-md p-1.5 hover:bg-white/10 text-white/90"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M6.3 5a1 1 0 0 0-.7 1.7L8.6 10l-3 3a1 1 0 1 0 1.4 1.4l3-3 3 3a1 1 0 1 0 1.4-1.4l-3-3 3-3a1 1 0 1 0-1.4-1.4l-3 3-3-3A1 1 0 0 0 6.3 5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Crisis notice */}
          <div className="shrink-0 border-b border-hairline bg-signal-red/5 px-4 py-2.5 text-xs flex items-center justify-between gap-2">
            <span className="text-fg">Not a crisis service.</span>
            <Link
              href="/emergency"
              onClick={() => setOpen(false)}
              className="rounded-full bg-signal-red text-white px-3 py-1 font-semibold hover:bg-signal-red-strong"
            >
              Get help now
            </Link>
          </div>

          {/* Messages — flex-1 + min-h-0 is the trick that lets this
              actually scroll inside the panel. Without min-h-0 the child
              would push the container past the max-height and the whole
              panel would overflow the viewport. */}
          <div
            ref={listRef}
            aria-live="polite"
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3 text-sm chat-scroll"
          >
            {messages.length === 0 ? (
              <div className="text-center py-4">
                <div className="font-display text-base font-medium mb-3">
                  What can I help you with?
                </div>
                <div className="grid gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-xl border border-hairline bg-bg p-3 text-left text-sm text-fg-muted hover:text-fg hover:border-brand transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[92%] rounded-2xl px-3 py-2 ${
                    m.role === "user" ? "bg-brand text-white" : "bg-bg-elevated text-fg"
                  }`}>
                    {m.role === "assistant" ? (
                      m.content ? (
                        <div className="prose prose-neutral max-w-none [&_p]:my-1.5 [&_p]:leading-relaxed [&_p]:text-sm">
                          <RenderMarkdown body={m.content} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-fg-muted py-1">
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </div>
                      )
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            <style>{`
              @keyframes typing { 0%,60%,100% { opacity: 0.2 } 30% { opacity: 1 } }
              .typing-dot {
                display: inline-block; width: 5px; height: 5px; border-radius: 50%;
                background: currentColor; animation: typing 1.2s infinite;
              }
              .typing-dot:nth-child(2) { animation-delay: 0.15s; }
              .typing-dot:nth-child(3) { animation-delay: 0.3s; }
              @media (prefers-reduced-motion: reduce) {
                .typing-dot { animation: none !important; opacity: 0.6; }
              }
            `}</style>
          </div>

          {error && (
            <div className="shrink-0 mx-3 mb-2 rounded-lg border border-signal-red/40 bg-signal-red/5 px-3 py-2 text-xs text-signal-red-strong">
              {error}
            </div>
          )}

          {/* Composer — shrink-0 keeps it visible even when the list is full */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="shrink-0 border-t border-hairline p-3 bg-bg-surface"
          >
            <div className="rounded-xl border border-hairline bg-bg focus-within:border-brand transition-colors">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                disabled={streaming}
                placeholder="Ask a question…"
                className="w-full resize-none bg-transparent px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none disabled:opacity-60"
              />
              <div className="flex items-center justify-between px-2 pb-2">
                <button
                  type="button"
                  onClick={reset}
                  disabled={streaming || messages.length === 0}
                  className="text-[11px] font-semibold text-fg-muted hover:text-fg disabled:opacity-40"
                >
                  New chat
                </button>
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  aria-label="Send"
                  className="inline-flex items-center gap-1 rounded-full bg-brand text-white px-3 py-1.5 text-xs font-semibold hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {streaming ? "…" : "Send"}
                </button>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-fg-muted italic text-center">
              General information only. Not a substitute for professional care.
            </p>
          </form>
        </div>
      )}

      {/* Floating trigger — bubble + preview tooltip.
          Positioned bottom-right on both mobile and desktop; a preview
          tooltip appears on desktop the first time to draw the eye. */}
      <FloatingTrigger open={open} onToggle={() => setOpen((v) => !v)} hasMessages={messages.length > 0} />
    </>
  );
}

/**
 * Trigger element: circular chat button that, on desktop and until the
 * user first opens the panel, is accompanied by a small speech-bubble
 * pill saying "Ask JMHS — mental health questions, anytime". Once the
 * user opens the panel once (session-persisted), the pill fades away
 * and only the round button remains — quiet but always in reach.
 */
function FloatingTrigger({
  open, onToggle, hasMessages,
}: { open: boolean; onToggle: () => void; hasMessages: boolean }) {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Show preview if user hasn't opened chat yet this session
    try {
      const opened = sessionStorage.getItem("jmhs-bubble-first-open") === "1";
      if (!opened && !hasMessages) {
        // Small delay so the preview arrives after the page settles.
        const t = setTimeout(() => setShowPreview(true), 900);
        return () => clearTimeout(t);
      }
    } catch {}
  }, [hasMessages]);

  useEffect(() => {
    if (open) {
      try { sessionStorage.setItem("jmhs-bubble-first-open", "1"); } catch {}
      setShowPreview(false);
    }
  }, [open]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-end gap-3 pointer-events-none">
      {/* Preview tooltip — desktop only, dismissible via X */}
      {showPreview && !open && (
        <div
          role="dialog"
          aria-label="Chat with the JMHS Mental Health Companion"
          className="hidden md:flex pointer-events-auto items-start gap-3 rounded-2xl bg-bg-surface border border-hairline shadow-lg pl-4 pr-3 py-3 max-w-xs animate-preview-in"
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
              JMHS Companion
            </div>
            <p className="mt-1 text-sm text-fg leading-snug">
              Have a question? Ask me anything about mental health — I'm here.
            </p>
            <button
              type="button"
              onClick={onToggle}
              className="mt-2 text-xs font-semibold text-brand hover:text-brand-hover"
            >
              Start chatting →
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            aria-label="Dismiss preview"
            className="ml-1 text-fg-muted hover:text-fg text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* The button itself */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="jmhs-chat-panel"
        aria-label={open ? "Close AI Companion" : "Open JMHS AI Companion"}
        title={open ? "Close chat" : "Ask the JMHS Mental Health Companion"}
        className={`pointer-events-auto relative flex items-center gap-2 rounded-full bg-brand text-white shadow-lg hover:shadow-xl hover:bg-brand-hover transition-all h-14 w-14 justify-center focus-visible:outline focus-visible:outline-4 focus-visible:outline-brand/30 ${
          showPreview && !open ? "animate-bubble-pulse" : ""
        }`}
      >
        {/* Attention ping — one-time, only if unread */}
        {showPreview && !open && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-brand/60 animate-ping-once"
          />
        )}

        {open ? (
          <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M7 5a1 1 0 0 0-.7 1.7L10.6 11l-4.3 4.3a1 1 0 1 0 1.4 1.4L12 12.4l4.3 4.3a1 1 0 1 0 1.4-1.4L13.4 11l4.3-4.3a1 1 0 1 0-1.4-1.4L12 9.6 7.7 5.3A1 1 0 0 0 7 5z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="currentColor" aria-hidden="true">
            <path d="M12 3C6.48 3 2 6.81 2 11.5c0 2.13.94 4.09 2.5 5.6L3 21l4.32-1.44A11.6 11.6 0 0 0 12 20c5.52 0 10-3.81 10-8.5S17.52 3 12 3zm-4 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
          </svg>
        )}
      </button>

      <style>{`
        @keyframes bubblePulse {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .animate-bubble-pulse { animation: bubblePulse 2.4s ease-in-out infinite; }

        @keyframes pingOnce {
          0%   { transform: scale(1);   opacity: 0.75; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-once { animation: pingOnce 1.8s cubic-bezier(0, 0, 0.2, 1) 2 forwards; }

        @keyframes previewIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .animate-preview-in { animation: previewIn 260ms ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .animate-bubble-pulse, .animate-ping-once, .animate-preview-in {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
