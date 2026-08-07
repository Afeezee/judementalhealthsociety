import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Tiny inline-markdown renderer for the seed content bodies.
 * Handles: paragraphs (blank line), **bold**, *italic*, and [text](href) links.
 * Not a general-purpose parser — scoped tightly to the seed article shape so
 * we don't pull in a full markdown dependency for six articles.
 */

const TOKEN = /(\[[^\]]+?\]\([^)]+?\))|(\*\*[^*]+?\*\*)|(\*[^*]+?\*)/g;

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));

    const token = m[0];
    if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+?)\]\(([^)]+?)\)$/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const external = /^https?:\/\//.test(href);
        nodes.push(
          external ? (
            <a
              key={`${keyBase}-${i++}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline underline-offset-2 hover:text-brand-hover"
            >
              {label}
            </a>
          ) : (
            <Link
              key={`${keyBase}-${i++}`}
              href={href}
              className="text-brand underline underline-offset-2 hover:text-brand-hover"
            >
              {label}
            </Link>
          )
        );
      }
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyBase}-${i++}`} className="font-semibold text-fg">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={`${keyBase}-${i++}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    last = TOKEN.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function RenderMarkdown({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        // Treat a paragraph that is only **Text** as a subheading —
        // matches how the seed bodies use bold-only lines as section titles.
        const isBoldOnly = /^\*\*[^*]+\*\*$/.test(trimmed);
        if (isBoldOnly) {
          return (
            <h3
              key={i}
              className="font-display text-xl md:text-2xl font-medium text-fg mt-10 mb-3"
            >
              {trimmed.slice(2, -2)}
            </h3>
          );
        }
        return (
          <p key={i} className="text-lg leading-relaxed text-fg mb-5">
            {renderInline(trimmed, `p${i}`)}
          </p>
        );
      })}
    </>
  );
}
