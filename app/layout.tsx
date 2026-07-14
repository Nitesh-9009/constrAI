import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://constrai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ConstrAI — AI Material Control Tower for Construction",
    template: "%s · ConstrAI",
  },
  description:
    "ConstrAI fuses POs, submittals, drawings and job-site photos into one live, predictive material timeline — and acts to prevent construction delays before they cascade.",
  applicationName: "ConstrAI",
  keywords: [
    "construction",
    "supply chain",
    "material tracking",
    "AI",
    "control tower",
    "procurement",
    "ConTech",
  ],
  openGraph: {
    title: "ConstrAI — AI Material Control Tower for Construction",
    description:
      "Will the material be here when the crew needs it — and if not, what do we do right now?",
    url: siteUrl,
    siteName: "ConstrAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConstrAI — AI Material Control Tower for Construction",
    description:
      "Will the material be here when the crew needs it — and if not, what do we do right now?",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F9FC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-canvas font-sans text-slate-700 antialiased">
        {children}
      </body>
    </html>
  );
}
