import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GWA Calculator — General Weighted Average, instantly",
    template: "%s · GWA Calculator",
  },
  description:
    "Calculate your General Weighted Average (GWA) for free. Built for Philippine college grading systems, works as a guest, no sign-up required. Save your results if you want a record of them.",
  keywords: [
    "GWA calculator",
    "General Weighted Average calculator",
    "college GWA calculator",
    "Philippines GWA calculator",
    "GPA to GWA",
  ],
  openGraph: {
    title: "GWA Calculator — General Weighted Average, instantly",
    description:
      "A fast, free GWA calculator for Philippine college students. No account needed to calculate.",
    url: siteUrl,
    siteName: "GWA Calculator",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GWA Calculator",
    description: "Calculate your General Weighted Average in seconds. No account needed.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink-900 antialiased">
        {children}
      </body>
    </html>
  );
}
