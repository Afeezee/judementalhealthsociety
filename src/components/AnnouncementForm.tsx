"use client";

import Link from "next/link";
import { useTransition } from "react";
import { saveAnnouncement, deleteAnnouncement } from "@/app/admin/announcements/actions";

type Row = {
  id: string;
  title: string;
  body: string;
  category: string;
  publishAt: Date;
  strip: boolean;
  href: string | null;
} | null;

export function AnnouncementForm({ row }: { row: Row }) {
  const [pending, startTransition] = useTransition();
  const defaults = row ?? {
    id: "",
    title: "",
    body: "",
    category: "General",
    publishAt: new Date(),
    strip: false,
    href: "",
  };

  return (
    <form
      action={saveAnnouncement}
      className="space-y-5 max-w-2xl"
    >
      {row && <input type="hidden" name="id" value={row.id} />}

      <label className="block">
        <span className="text-sm font-semibold">Title</span>
        <input
          type="text"
          name="title"
          required
          defaultValue={defaults.title}
          className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Body</span>
        <textarea
          name="body"
          required
          rows={5}
          defaultValue={defaults.body}
          className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Category</span>
          <select
            name="category"
            defaultValue={defaults.category}
            className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            {["Competition", "Lectures", "General", "Community"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Publish at</span>
          <input
            type="datetime-local"
            name="publishAt"
            required
            defaultValue={new Date(defaults.publishAt).toISOString().slice(0, 16)}
            className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">Link (optional)</span>
        <input
          type="text"
          name="href"
          placeholder="/competition"
          defaultValue={defaults.href ?? ""}
          className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="strip"
          defaultChecked={defaults.strip}
          className="h-4 w-4 rounded border-hairline text-brand focus:ring-brand"
        />
        <span className="text-sm">
          Pin to the sitewide announcements strip
        </span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : row ? "Save changes" : "Create announcement"}
        </button>
        <Link
          href="/admin/announcements"
          className="text-sm text-fg-muted hover:text-fg"
        >
          Cancel
        </Link>
        {row && (
          <button
            type="button"
            onClick={() => {
              if (!confirm("Delete this announcement? This cannot be undone.")) return;
              startTransition(async () => {
                await deleteAnnouncement(row.id);
              });
            }}
            className="ml-auto text-sm font-semibold text-signal-red hover:text-signal-red-strong"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
