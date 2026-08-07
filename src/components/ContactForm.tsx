"use client";

import { useState } from "react";

const TOPICS = [
  "General enquiry",
  "Writing Competition",
  "Professional listing",
  "Volunteering",
  "Partnership / media",
  "Other",
] as const;

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; error: string };

export function ContactForm() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Honeypot — real users leave this untouched.
    if (fd.get("website")) {
      setState({ status: "success" });
      return;
    }
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Something went wrong." }));
        setState({ status: "error", error: error || "Something went wrong." });
        return;
      }
      form.reset();
      setState({ status: "success" });
    } catch {
      setState({ status: "error", error: "Network error. Please try again." });
    }
  }

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-brand bg-brand/5 p-8">
        <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
          Message sent
        </div>
        <h2 className="mt-3 font-display text-2xl font-medium">
          Thank you. We've got your message.
        </h2>
        <p className="mt-3 text-fg-muted">
          Someone from the team will reply within 3–5 working days.
          If your message is urgent, please use our emergency page.
        </p>
      </div>
    );
  }

  const disabled = state.status === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Your name</span>
          <input
            type="text"
            name="name"
            required
            disabled={disabled}
            className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 text-fg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Email</span>
          <input
            type="email"
            name="email"
            required
            disabled={disabled}
            className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 text-fg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">What's this about?</span>
        <select
          name="topic"
          required
          disabled={disabled}
          defaultValue=""
          className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 text-fg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="" disabled>Choose a topic…</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Message</span>
        <textarea
          name="message"
          rows={6}
          required
          minLength={20}
          disabled={disabled}
          className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 text-fg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder="Tell us what you'd like to talk about. Please don't include anything you wouldn't want another human to read."
        />
      </label>

      {state.status === "error" && (
        <div className="rounded-lg border border-signal-red/40 bg-signal-red/5 p-3 text-sm text-signal-red-strong">
          {state.error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {disabled ? "Sending…" : "Send message"}
        </button>
        <p className="text-xs text-fg-muted">
          We reply within 3–5 working days.
        </p>
      </div>
    </form>
  );
}
