"use client";

import { useTransition } from "react";
import { saveLecture, deleteLecture } from "@/app/admin/lectures/actions";

type Row = {
  id: string;
  date: Date;
  topic: string | null;
  speaker: string | null;
  joinLink: string | null;
  recordingUrl: string | null;
  summary: string | null;
  isNext: boolean;
} | null;

function isoLocal(d: Date | undefined): string {
  if (!d) return "";
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}

export function LectureForm({ row }: { row: Row }) {
  const [pending, startTransition] = useTransition();
  const isNew = row === null;

  return (
    <form
      action={saveLecture}
      className={`rounded-2xl border p-5 ${isNew ? "border-brand bg-brand/5" : "border-hairline bg-bg-surface"}`}
    >
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Date & time</span>
          <input
            type="datetime-local"
            name="date"
            required
            defaultValue={isoLocal(row?.date)}
            className="mt-1 w-full rounded-lg border border-hairline bg-bg px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Topic</span>
          <input
            type="text"
            name="topic"
            defaultValue={row?.topic ?? ""}
            placeholder="(leave blank for TBD state)"
            className="mt-1 w-full rounded-lg border border-hairline bg-bg px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Speaker</span>
          <input
            type="text"
            name="speaker"
            defaultValue={row?.speaker ?? ""}
            className="mt-1 w-full rounded-lg border border-hairline bg-bg px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Join link</span>
          <input
            type="url"
            name="joinLink"
            defaultValue={row?.joinLink ?? ""}
            className="mt-1 w-full rounded-lg border border-hairline bg-bg px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Recording URL</span>
          <input
            type="url"
            name="recordingUrl"
            defaultValue={row?.recordingUrl ?? ""}
            className="mt-1 w-full rounded-lg border border-hairline bg-bg px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="flex items-center gap-2 sm:mt-6">
          <input
            type="checkbox"
            name="isNext"
            defaultChecked={row?.isNext ?? false}
            className="h-4 w-4 rounded border-hairline text-brand"
          />
          <span className="text-sm font-semibold">Is next (show on homepage)</span>
        </label>
      </div>
      <label className="block mt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Summary / notes</span>
        <textarea
          name="summary"
          rows={2}
          defaultValue={row?.summary ?? ""}
          className="mt-1 w-full rounded-lg border border-hairline bg-bg px-3 py-2"
        />
      </label>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : isNew ? "Add lecture" : "Save"}
        </button>
        {row && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm("Delete this lecture?")) return;
              startTransition(async () => { await deleteLecture(row.id); });
            }}
            className="ml-auto text-xs font-semibold text-signal-red hover:text-signal-red-strong"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
