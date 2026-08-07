"use client";

import { useState } from "react";
import type { ImportResult } from "@/lib/submissions-import";

export function ImportForm() {
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "uploading"; filename: string }
    | { status: "done"; result: ImportResult }
    | { status: "error"; message: string }
  >({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file") as File | null;
    if (!file || file.size === 0) {
      setState({ status: "error", message: "Please choose a file." });
      return;
    }

    setState({ status: "uploading", filename: file.name });
    try {
      const res = await fetch("/api/admin/submissions/import", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ status: "error", message: data.error ?? "Import failed" });
        return;
      }
      setState({ status: "done", result: data.result });
      form.reset();
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Import failed" });
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-hairline bg-bg-surface p-6 space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Sculptform export (CSV / XLSX)</span>
            <input
              type="file"
              name="file"
              accept=".csv,.xlsx,.xls"
              required
              className="mt-1.5 block w-full text-sm text-fg-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand file:text-white file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-brand-hover"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Theme year</span>
            <input
              type="number"
              name="themeYear"
              min={2020}
              max={2100}
              required
              defaultValue={new Date().getFullYear()}
              className="mt-1.5 w-full rounded-lg border border-hairline bg-bg px-3 py-2.5"
            />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-semibold">Notes (optional)</span>
          <input
            type="text"
            name="notes"
            placeholder="e.g. Batch 2 — pre-deadline pull"
            className="mt-1.5 w-full rounded-lg border border-hairline bg-bg px-3 py-2.5"
          />
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={state.status === "uploading"}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
          >
            {state.status === "uploading" ? "Importing…" : "Import submissions"}
          </button>
          <p className="text-xs text-fg-muted">
            Identities are stripped from manuscripts at ingest.
          </p>
        </div>
      </form>

      {state.status === "error" && (
        <div className="mt-4 rounded-lg border border-signal-red/40 bg-signal-red/5 p-4 text-sm text-signal-red-strong">
          {state.message}
        </div>
      )}

      {state.status === "done" && <ResultView result={state.result} />}
    </>
  );
}

function ResultView({ result }: { result: ImportResult }) {
  return (
    <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/5 p-6">
      <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
        Import complete
      </div>
      <h2 className="mt-2 font-display text-2xl font-medium">
        {result.createdCount} created · {result.flaggedCount} flagged · {result.duplicateCount} duplicate · {result.errorCount} error
      </h2>
      <p className="mt-2 text-sm text-fg-muted">
        Processed {result.rowCount} rows in total. Every created row has been split into manuscript + identity tables.
      </p>

      <div className="mt-5 max-h-96 overflow-auto rounded-lg border border-hairline bg-bg">
        <table className="w-full text-sm">
          <thead className="bg-bg-elevated sticky top-0">
            <tr className="text-left">
              <th className="p-3 font-semibold">Row</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r, i) => (
              <tr key={i} className="border-t border-hairline">
                <td className="p-3 text-fg-muted">{r.rowIndex}</td>
                <td className={`p-3 font-semibold ${
                  r.status === "created" ? "text-brand"
                  : r.status === "flagged" ? "text-yellow-600 dark:text-yellow-400"
                  : r.status === "duplicate" ? "text-fg-muted"
                  : "text-signal-red"
                }`}>{r.status}</td>
                <td className="p-3">{r.title ?? "—"}</td>
                <td className="p-3 text-fg-muted">{r.category ?? "—"}</td>
                <td className="p-3 text-fg-muted">{r.reason ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
