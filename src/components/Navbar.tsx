"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/portfolio/projects/")) {
    return <nav className="hidden"></nav>;
  }

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
        >
          Blueline Atelier
        </Link>

        <div className="flex items-center gap-4 px-6">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-zinc-700 p-2 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <span className="block h-[1px] w-4 bg-current" />
            <span className="mt-1 block h-[1px] w-4 bg-current" />
            <span className="mt-1 block h-[1px] w-4 bg-current" />
          </button>

          <div className="hidden items-center gap-6 text-sm font-medium text-zinc-300 md:flex">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <Link
              href="/#about"
              className="transition-colors hover:text-white"
            >
              About
            </Link>
            <Link
              href="/portfolio"
              className="transition-colors hover:text-white"
            >
              Portfolio
            </Link>
            <a
              href="mailto:toti.sketches@gmail.com"
              className="transition-colors hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="mt-4 space-y-2 rounded-lg border border-zinc-800 bg-black/40 px-6 py-4 text-sm font-medium text-zinc-200 md:hidden">
          <Link
            href="/"
            className="block rounded-md px-2 py-1 hover:bg-zinc-900"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/#about"
            className="block rounded-md px-2 py-1 hover:bg-zinc-900"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/portfolio"
            className="block rounded-md px-2 py-1 hover:bg-zinc-900"
            onClick={() => setMenuOpen(false)}
          >
            Portfolio
          </Link>
          <a
            href="mailto:toti.sketches@gmail.com"
            className="block rounded-md px-2 py-1 hover:bg-zinc-900"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>
        </div>
      )}
    </>
  );
}
