import { ImageResponse } from "next/og";
import { COMPETITION } from "@/lib/site-settings";

/**
 * Competition-specific OG card. Overrides the root
 * src/app/opengraph-image.tsx for any share of a URL under /competition.
 *
 * satori (the renderer behind next/og) requires every <div> with more
 * than one child to declare `display` explicitly — every div here does.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "JMHS National Writing Competition — Submit your entry";

const BRAND = "#1E3A8A";
const BRAND_LIGHT = "#3B5FCC";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CompetitionOG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)`,
          color: "#ffffff",
          fontFamily: "Georgia, serif",
          padding: "72px 88px",
          position: "relative",
        }}
      >
        {/* Kicker (single text child, display flex to satisfy satori) */}
        <div
          style={{
            display: "flex",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          JMHS National Writing Competition {COMPETITION.themeYear}
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: 36,
            fontSize: 74,
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: -1,
            display: "flex",
            flexDirection: "column",
            maxWidth: 1000,
          }}
        >
          <span>Using the power of words</span>
          <span>to promote mental health</span>
          <span>and prevent suicide.</span>
        </div>

        {/* Spacer */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 56,
            fontFamily: "Helvetica, Arial, sans-serif",
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 14, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
              Deadline
            </span>
            <span style={{ fontSize: 26, fontWeight: 600, marginTop: 6 }}>
              {formatDate(COMPETITION.deadline)}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 14, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
              Categories
            </span>
            <span style={{ fontSize: 26, fontWeight: 600, marginTop: 6 }}>
              9 formats · Open to everyone
            </span>
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span>judementalhealthsociety.org/competition</span>
          <span>Submit before 23:59 WAT</span>
        </div>

        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 8,
            background: "#DC2626",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
