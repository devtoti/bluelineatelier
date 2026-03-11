import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

function toTwoDigitCode(value: string): string {
  const trimmed = value.replace(/^0+/, "") || "0";
  const num = parseInt(trimmed, 10);
  if (Number.isNaN(num) || num < 0 || num > 99) return "00";
  return num <= 9 ? `0${num}` : String(num);
}

const SEQUENCE: { href: string; label: string }[] = [
  { href: "/portfolio/00", label: "00" },
  { href: "/portfolio/projects/01", label: "01" },
  { href: "/portfolio/projects/02", label: "02" },
  { href: "/portfolio/projects/03", label: "03" },
  { href: "/portfolio/projects/04", label: "04" },
  { href: "/portfolio/projects/05", label: "05" },
  { href: "/portfolio/projects/06", label: "06" },
  { href: "/portfolio/contact", label: "Contact" },
];

type ProjectMobileNavProps = {
  /** Current project code, e.g. "01" or "02". Normalized to two digits. */
  currentProjectCode: string;
};

export function ProjectMobileNav({ currentProjectCode }: ProjectMobileNavProps) {
  const normalized = toTwoDigitCode(currentProjectCode);
  const currentHref = `/portfolio/projects/${normalized}`;
  const currentIndex = SEQUENCE.findIndex((s) => s.href === currentHref);
  const prevItem = currentIndex > 0 ? SEQUENCE[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < SEQUENCE.length - 1
      ? SEQUENCE[currentIndex + 1]
      : null;

  const linkClass =
    "inline-flex items-center gap-2 text-sm font-medium text-[#2B4673] hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#2B4673] rounded";

  return (
    <section className="mobile-navigation md:hidden mt-8 pt-6 border-t border-zinc-300">
      <div className="flex flex-row items-center justify-between gap-4">
        {prevItem ? (
          <Link href={prevItem.href} className={linkClass}>
            <FiArrowLeft className="h-8 w-8 shrink-0" aria-hidden />
            <span>PREV - {prevItem.label}</span>
          </Link>
        ) : (
          <span aria-hidden />
        )}
        {nextItem ? (
          <Link href={nextItem.href} className={`${linkClass} ml-auto`}>
            <span>{nextItem.label} - NEXT</span>
            <FiArrowRight className="h-8 w-8 shrink-0" aria-hidden />
          </Link>
        ) : (
          <span aria-hidden />
        )}
      </div>
    </section>
  );
}
