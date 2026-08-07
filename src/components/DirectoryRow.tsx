"use client";

import { useTransition } from "react";
import { setDirectoryStatus, deleteDirectoryListing } from "@/app/admin/directory/actions";

type Row = {
  id: string;
  name: string;
  credentials: string;
  affiliation: string;
  location: string | null;
  costTier: string;
  status: string;
  createdAt: Date;
};

export function DirectoryRow({ row }: { row: Row }) {
  const [pending, startTransition] = useTransition();

  return (
    <li className="p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold">
            <span className={row.status === "verified" ? "text-brand" : row.status === "rejected" ? "text-signal-red" : "text-fg-muted"}>
              {row.status}
            </span>
            <span className="text-fg-muted">· {row.costTier}</span>
          </div>
          <div className="mt-1 font-display text-lg font-medium">{row.name}</div>
          <div className="text-sm text-fg">{row.credentials}</div>
          <div className="mt-1 text-sm text-fg-muted">
            {row.affiliation}{row.location ? ` · ${row.location}` : ""}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {row.status !== "verified" && (
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(async () => { await setDirectoryStatus(row.id, "verified"); })}
              className="rounded-full bg-brand text-white px-3 py-1.5 text-xs font-semibold hover:bg-brand-hover disabled:opacity-60"
            >
              Approve
            </button>
          )}
          {row.status !== "rejected" && (
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(async () => { await setDirectoryStatus(row.id, "rejected"); })}
              className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold text-fg-muted hover:border-signal-red hover:text-signal-red disabled:opacity-60"
            >
              Reject
            </button>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm(`Delete ${row.name}?`)) return;
              startTransition(async () => { await deleteDirectoryListing(row.id); });
            }}
            className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold text-signal-red hover:bg-signal-red hover:text-white disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
