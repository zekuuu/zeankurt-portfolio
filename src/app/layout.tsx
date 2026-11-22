import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import ConditionalHeader from "@/components/layout/ConditionalHeader";
import { ScrollProgressBar } from "@/components/animation/ScrollProgressBar";
import { SavingIndicator } from "@/components/ui/SavingIndicator";
import { SavingProvider } from "@/lib/saving";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { Analytics } from "@vercel/analytics/next";
import { getPortfolioContent } from "@/lib/cms/queries";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GlobalScrollManager } from "@/components/layout/GlobalScrollManager";
import { DevStationBadge } from "@/components/ui/DevStationBadge";
import { IntroLoader, introScript } from "@/components/ui/IntroLoader";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { identity, SITE_URL } from "@/lib/identity";
import { JsonLdScript, siteGraph } from "@/lib/structured-data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const verification: Metadata["verification"] = {
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : {}),
  ...(process.env.BING_SITE_VERIFICATION
    ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
    : {}),
};

const defaultTitle = `${identity.name} | ${identity.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${identity.name}`,
  },
  description: identity.metaDescription,
  applicationName: identity.name,
  authors: [{ name: identity.name, url: SITE_URL }],
  creator: identity.name,
  publisher: identity.name,
  keywords: [
    identity.name,
    ...identity.alternateNames,
    ...identity.jobTitles,
    "Full-Stack Developer Philippines",
    "Web Developer Cavite",
    "Next.js Developer",
    "Web3 Developer",
    "Cavite State University",
    "WebX",
  ],
  openGraph: {
    type: "profile",
    firstName: identity.givenName,
    lastName: identity.familyName,
    username: "zekuuu",
    siteName: identity.name,
    locale: "en_PH",
    url: "/",
    title: defaultTitle,
    description: identity.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    creator: identity.twitterHandle,
    site: identity.twitterHandle,
    title: defaultTitle,
    description: identity.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { siteConfig } = await getPortfolioContent();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col bg-bg text-ink"
        suppressHydrationWarning
      >
        {/* Decides before any content paints whether the once-per-tab intro shows.
            Kept in <body>, not <head>: extensions inject scripts into <head>
            before hydration and would shift it out of place. */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} suppressHydrationWarning />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-primary"
        >
          Skip to content
        </a>
        <JsonLdScript data={siteGraph()} />
        <IntroLoader name={identity.name} />
        <ThemeProvider>
          <SavingProvider>
            <SmoothScroll />
            <GlobalScrollManager />
            <ScrollProgressBar />
            <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-1 flex-col sm:border-x sm:border-line">
              <ConditionalHeader siteConfig={siteConfig} />

              {children}

              <Footer siteConfig={siteConfig} />
            </div>
            <DevStationBadge />
            <ScrollToTopButton />
            <SavingIndicator />
          </SavingProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
