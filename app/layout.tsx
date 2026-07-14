import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kayakalp-nine.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kayakalp — Predictive Material Control Tower",
    template: "%s · Kayakalp",
  },
  description:
    "Kayakalp fuses POs, submittals, drawings and job-site photos into one live, predictive material timeline — and acts to prevent construction delays before they cascade.",
  applicationName: "Kayakalp",
  keywords: [
    "construction",
    "supply chain",
    "material tracking",
    "AI",
    "control tower",
    "procurement",
  ],
  openGraph: {
    title: "Kayakalp — Predictive Material Control Tower",
    description:
      "Will the material be here when the crew needs it — and if not, what do we do right now?",
    url: siteUrl,
    siteName: "Kayakalp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kayakalp — Predictive Material Control Tower",
    description:
      "Will the material be here when the crew needs it — and if not, what do we do right now?",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1120",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ink-950 text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
