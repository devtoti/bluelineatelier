import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Navbar from "@/components/Navbar";
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
  title: "Blueline Atelier",
  description: "Software engineering applied to architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <div
          className="flex flex-1 flex-col font-sans"
          style={{ backgroundColor: "#0C1222" }}
        >
          <Navbar />
          {children}
        </div>
        <footer
          className="border-t border-zinc-800 bg-[#0C1222] px-6 py-4 text-center text-sm text-zinc-500"
          role="contentinfo"
        >
          <p>
            © {new Date().getFullYear()}{" "}
            <Link
              href="/"
              className="text-zinc-400 transition-colors hover:text-white"
            >
              Blueline Atelier
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
