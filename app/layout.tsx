import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppProviders from "@/components/AppProviders";
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
  title: "MaternaAI Ethiopia",
  description: "No mother left behind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
      style={{ colorScheme: 'light' }}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-gray-50 text-gray-900"
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
