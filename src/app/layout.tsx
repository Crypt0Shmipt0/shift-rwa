import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/nav/top-nav";
import { Footer } from "@/components/nav/footer";
import { Providers } from "@/components/providers";
import { WelcomeModal } from "@/components/onboarding/welcome-modal";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://shift-rwa.vercel.app";
const SITE_NAME = "SHIFT Finance";
const TITLE = "SHIFT — 3× & 2× Bi-Directional Tokenized Stocks. No Liquidations.";
const DESCRIPTION =
  "SHIFT fixes Web3 stock adoption: boring low-vol stocks and dangerous leveraged liquidations. Trade 3×/2× bi-directional tokenized stocks, ETFs, and ETNs on-chain — long or short — with zero liquidation risk.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · SHIFT Finance",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  keywords: [
    "tokenized stocks",
    "3x leveraged tokens",
    "2x leveraged tokens",
    "bi-directional leverage",
    "no liquidation leveraged trading",
    "RWA",
    "real-world assets",
    "leveraged ETFs on-chain",
    "tokenized ETNs",
    "TSLL on-chain",
    "TSLS on-chain",
    "SOXL on-chain",
    "SOXS on-chain",
    "SPXL on-chain",
    "SPXS on-chain",
    "TSL2L",
    "TSL1S",
    "SOX3L",
    "SOX3S",
    "SPX3L",
    "SPX3S",
    "DeFi perpetuals alternative",
    "DEX",
    "SHIFT Finance",
  ],
  authors: [{ name: "SHIFT Finance", url: SITE_URL }],
  creator: "SHIFT Finance",
  publisher: "SHIFT Finance",
  category: "finance",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SHIFT Finance — trade tokenized stocks, 24/7",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: "@SHIFTfinance",
    creator: "@SHIFTfinance",
    images: ["/twitter-image"],
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SHIFT",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#021C24" },
    { media: "(prefers-color-scheme: light)", color: "#021C24" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${grotesk.variable} ${jbMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <TopNav />
          <main className="flex-1">{children}</main>
          <Footer />
          <WelcomeModal />
        </Providers>
      </body>
    </html>
  );
}
