import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crisphomeco.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Crisp Home Co. — Premium Residential Cleaning in Salt Lake City",
    template: "%s — Crisp Home Co.",
  },
  description:
    "Flat-rate residential cleaning with instant transparent pricing. No callbacks, no surprises. Book in under two minutes.",
  keywords: [
    "house cleaning Salt Lake City",
    "residential cleaning SLC",
    "maid service Salt Lake City",
    "flat-rate cleaning",
    "home cleaning Utah",
    "Crisp Home Co.",
  ],
  authors: [{ name: "Crisp Home Co.", url: SITE_URL }],
  creator: "Crisp Home Co.",
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         SITE_URL,
    siteName:    "Crisp Home Co.",
    title:       "Crisp Home Co. — Premium Residential Cleaning in Salt Lake City",
    description: "Flat-rate residential cleaning with instant transparent pricing. Book in minutes — no callbacks, no quotes, no surprises.",
    images: [
      {
        url:    "/opengraph-image",
        width:  1200,
        height: 630,
        alt:    "Crisp Home Co. — Come home to crisp.",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Crisp Home Co. — Premium Residential Cleaning in Salt Lake City",
    description: "Flat-rate residential cleaning with instant transparent pricing. Book in minutes.",
    images:      ["/opengraph-image"],
  },
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
  icons: {
    icon:    "/favicon.ico",
    apple:   "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
