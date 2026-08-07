"use client";

import Link from "next/link";
import { useTransition } from "react";
import { saveResource, deleteResource } from "@/app/admin/resources/actions";

type Row = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  readingMinutes: number;
  tags: unknown;
  publishedAt: Date;
} | null;

export function ResourceForm({ row }: { row: Row }) {
  const [pending, startTransition] = useTransition();
  const defaults = row ?? {
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    category: "learning-and-prevention",
    readingMinutes: 5,
    tags: [] as string[],
    publishedAt: new Date(),
  };
  const tagsStr = Array.isArray(defaults.tags) ? (defaults.tags as string[]).join(", ") : "";

  return (
    <form action={saveResource} className="space-y-5">
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
        <span className="text-sm font-semibold">Excerpt (one or two sentences)</span>
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={defaults.excerpt}
          className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Body</span>
        <span className="text-xs text-fg-muted ml-2">
          Plain paragraphs. **bold** for section headings, [text](href) for links.
        </span>
        <textarea
          name="body"
          required
          rows={16}
          defaultValue={defaults.body}
          className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 font-mono text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-semibold">Category</span>
          <select
            name="category"
            defaultValue={defaults.category}
            className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="struggling-right-now">Struggling right now</option>
            <option value="supporting-someone-else">Supporting someone else</option>
            <option value="learning-and-prevention">Learning & prevention</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Reading minutes</span>
          <input
            type="number"
            name="readingMinutes"
            min={1}
            max={60}
            defaultValue={defaults.readingMinutes}
            className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Published at</span>
          <input
            type="datetime-local"
            name="publishedAt"
            required
            defaultValue={new Date(defaults.publishedAt).toISOString().slice(0, 16)}
            className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">Tags (comma-separated)</span>
        <input
          type="text"
          name="tags"
          defaultValue={tagsStr}
          placeholder="depression, stigma, help-seeking"
          className="mt-1.5 w-full rounded-lg border border-hairline bg-bg-surface px-3 py-2.5"
        />
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : row ? "Save changes" : "Create article"}
        </button>
        <Link href="/admin/resources" className="text-sm text-fg-muted hover:text-fg">Cancel</Link>
        {row && (
          <button
            type="button"
            onClick={() => {
              if (!confirm("Delete this article? This cannot be undone.")) return;
              startTransition(async () => { await deleteResource(row.id); });
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
