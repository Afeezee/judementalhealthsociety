import { ImageResponse } from "next/og";

/**
 * Default Open Graph card for social shares (WhatsApp, X, LinkedIn,
 * Facebook, Slack). Next.js 16 auto-generates the appropriate
 * <meta property="og:image"> and Twitter card tags from this file
 * and its exported `size`/`contentType` metadata.
 *
 * 1200x630 is the accepted portrait/landscape ratio across every major
 * social service. Kept purely typographic + system fonts so this route
 * has no network dependencies and stays fast at request time.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Jude Mental Health Society — Every voice matters.";

const BRAND = "#1E3A8A";
const BRAND_LIGHT = "#3B5FCC";
const PAPER = "#F6F7FB";

export default function OpenGraphImage() {
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
        {/* Kicker */}
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Jude Mental Health Society
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: 40,
            fontSize: 92,
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: -1.5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Every word can</span>
          <span>make a difference.</span>
          <span style={{ color: PAPER, opacity: 0.85 }}>
            Every voice matters.
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 20,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.85)",
              maxWidth: 640,
            }}
          >
            <span>
              An independent Nigerian mental health advocacy initiative
            </span>
            <span>founded in memory of Jude Anuoluwa.</span>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            judementalhealthsociety.org
          </div>
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
