import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "SHIFT — Trade Tokenized Stocks, 24/7",
  description:
    "Experience permissionless access to Stocks & ETFs value across top DEXs & dApps. Trade leveraged real-world assets on-chain.",
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
