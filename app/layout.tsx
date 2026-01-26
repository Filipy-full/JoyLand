import type { Metadata } from "next";
import { Libre_Baskerville, Inter } from "next/font/google";
import "./globals.css";
import "./animations.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

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
  title: "Joyland - Adopta un árbol en el norte de España",
  description: "Un pequeño olivar y almendral regenerativo en el norte de España. Adopta un árbol y sigue su historia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${sans.variable} ${serif.variable} antialiased font-sans`}
      >
        <Header />
        <FloatingCTA />
        <main className="min-h-screen pt-32">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
