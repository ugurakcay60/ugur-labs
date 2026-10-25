import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://ugur-labs.com"),
  title: "Ugur Labs — AI-Powered Web & Mobile Development",
  description:
    "AI-powered web & mobile app development, software architecture, and personal growth.",
  openGraph: {
    title: "Ugur Labs",
    description: "AI-powered web & mobile app development, software architecture, and personal growth.",
    url: "https://ugur-labs.com",
    siteName: "Ugur Labs",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
