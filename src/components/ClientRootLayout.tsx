"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

type ClientRootLayoutProps = {
  children: React.ReactNode;
  fontClassNames: string;
};

export function ClientRootLayout({ children, fontClassNames }: ClientRootLayoutProps) {
  const pathname = usePathname();

  if (pathname === "/portfolio" || pathname.startsWith("/portfolio/")) {
    return <>{children}</>;
  }

  return (
    <div
      className={`${fontClassNames} flex min-h-screen flex-col antialiased`}
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
    </div>
  );
}
