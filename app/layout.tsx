import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Libre_Baskerville, Inter } from "next/font/google";
import "./globals.css";
import "./animations.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import AuthListener from "@/components/AuthListener";
import SitePassword from "@/components/SitePassword";
import { AdoptionCartProvider } from "@/contexts/AdoptionCart";

const serif = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Joyland - Adopt a Tree in Northern Spain",
  description: "A small regenerative olive and almond farm in northern Spain. Adopt a tree and follow its story.",
  openGraph: {
    title: 'Joyland',
    description: "A small regenerative olive and almond farm in northern Spain. Adopt a tree and follow its story.",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Joyland Logo',
      },
    ],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="theme-color" content="#4ADE80" />
        <meta name="google-site-verification" content="YzvN7iUXjU7n3kMM6b4a0uJIz1zmAgNoouCWFbdem1Q" />
      </head>
      <body className={`${sans.variable} ${serif.variable} antialiased font-sans`}>
        <SitePassword>
          <AdoptionCartProvider>
            <Header />
            <FloatingCTA />
            <AuthListener>
              <main className="min-h-screen pt-20">
                {children}
              </main>
            </AuthListener>
            <Footer />
          </AdoptionCartProvider>
        </SitePassword>
        <SpeedInsights />
      </body>
    </html>
  );
}
