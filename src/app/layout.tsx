import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎭 Chaos Puppet - A Game of Strategic Unpredictability",
  description: "Guide your mischievous puppet through chaos! But beware - it doesn't always listen... A unique browser game where unpredictability is the core mechanic.",
  keywords: ["game", "browser game", "puzzle", "chaos", "mobile game", "fun", "arcade"],
  authors: [{ name: "Chaos Puppet Games" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎭</text></svg>",
  },
  openGraph: {
    title: "🎭 Chaos Puppet",
    description: "A game where your puppet has a mind of its own!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🎭 Chaos Puppet",
    description: "A game where your puppet has a mind of its own!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
