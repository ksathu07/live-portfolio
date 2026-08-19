import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

import profile from "../content/profile.json";
const p = profile.profile;

export const metadata: Metadata = {
  title: `${p.name} — Portfolio`,
  description: p.tagline ?? `${p.name} · ${p.headline ?? ""}`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="noise">
        <SmoothScroll />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}