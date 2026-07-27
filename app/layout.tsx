import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Background from "@/components/Background";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vidibro — Talk to a Random Stranger, Instantly",
  description:
    "Anonymous, zero-login video chat. Get matched instantly, play quick games, and connect — no account, no history, just a real conversation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Runs before hydration so there's no flash of the wrong theme —
            reads the stored preference (or system setting) and applies it
            immediately, before React ever mounts. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem('vidibro-theme')||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}`}
        </Script>
        <Background />
        {children}
      </body>
    </html>
  );
}
