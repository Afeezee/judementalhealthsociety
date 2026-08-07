import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnnouncementsStrip } from "@/components/AnnouncementsStrip";
import { ChatBubble } from "@/components/ChatBubble";
import { getStripAnnouncements } from "@/lib/public-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: {
    default: "Jude Mental Health Society — Every voice matters",
    template: "%s · Jude Mental Health Society",
  },
  description:
    "An independent Nigerian mental health advocacy initiative founded in memory of Jude Anuoluwa. Education, lectures, resources, community, and the JMHS National Writing Competition.",
  metadataBase: new URL("https://judementalhealthsociety.org"),
  openGraph: {
    title: "Jude Mental Health Society",
    description:
      "Transforming loss into purpose — promoting mental health conversations, reducing stigma, and advocating for suicide prevention.",
    type: "website",
    images: [{ url: "/jmhs-logo.png", width: 1500, height: 1000, alt: "Jude Mental Health Society" }],
  },
  icons: {
    icon: "/jmhs-logo.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F7FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E14" },
  ],
};

/**
 * Applied to <html> before hydration to prevent flash-of-wrong-theme
 * and to restore the user's text-size preference (spec §1.6).
 */
const THEME_INIT = `
(function(){
  try {
    var t = localStorage.getItem('jmhs-theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    var s = parseFloat(localStorage.getItem('jmhs-type-scale') || '1');
    if (!isNaN(s) && s >= 0.75 && s <= 1.5) {
      document.documentElement.style.setProperty('--type-scale', String(s));
    }
  } catch(e) {}
})();
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const strip = await getStripAnnouncements();
  return (
    <ClerkProvider>
      {/*
        suppressHydrationWarning: the theme-init Script below writes
        data-theme and --type-scale on <html> before hydration, so the
        server-rendered <html> attributes intentionally don't match
        what the client sees post-init. React's warning would be noise.
      */}
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      >
        <head>
          <Script
            id="jmhs-theme-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: THEME_INIT }}
          />
        </head>
        <body className="min-h-full flex flex-col bg-bg text-fg">
          {/* Skip link — accessibility floor (spec §1.6) */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-brand focus:text-white focus:px-3 focus:py-2"
          >
            Skip to main content
          </a>

          <AnnouncementsStrip items={strip} />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          {/* Floating AI Companion — decides per-route whether to render */}
          <ChatBubble />
        </body>
      </html>
    </ClerkProvider>
  );
}
