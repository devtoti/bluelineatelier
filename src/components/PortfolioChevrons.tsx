"use client";
import type { PortfolioNavItem } from "../lib/__portfolioNav";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RiArrowLeftWideLine } from "react-icons/ri";
import { RiArrowRightWideLine } from "react-icons/ri";
import { flowNeighborsFromPathname } from "@/lib/__portfolioFlowNav";

const chevronLinkClass =
  "flex h-16 w-16 items-center justify-center text-[#2B4673]/50 transition-colors hover:border-[#2B4673]/70 hover:bg-black/5 hover:text-[#2B4673] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4673]/60 z-10";

export function PortfolioChevronLeft({
  navigation,
  projects = false,
}: {
  navigation: PortfolioNavItem[];
  projects?: boolean;
}) {
  const pathname = usePathname();
  if (navigation == null) return <span className="h-10 w-10" aria-hidden />;
  const { prev: prevHref } = flowNeighborsFromPathname(pathname, navigation);

  if (!prevHref) {
    return <span className="h-10 w-10" aria-hidden />;
  }

  return (
    <Link
      href={prevHref as string}
      className={`chevron-left ${chevronLinkClass} group`}
      aria-label="Previous project"
    >
      <RiArrowLeftWideLine
        className="h-10 w-10"
        aria-hidden
        style={{ color: projects ? "#2B4673" : "#FFFFFF" }}
      />
    </Link>
  );
}

export function PortfolioChevronRight({
  navigation,
  projects = false,
}: {
  navigation: PortfolioNavItem[];
  projects?: boolean;
}) {
  const pathname = usePathname();
  if (navigation == null) return <span className="h-10 w-10" aria-hidden />;
  const { next: nextHref } = flowNeighborsFromPathname(pathname, navigation);
  if (!nextHref) {
    return <span className="h-10 w-10" aria-hidden />;
  }

  return (
    <Link
      href={nextHref as string}
      className={`chevron-right ${chevronLinkClass} group`}
      aria-label="Next project"
    >
      <RiArrowRightWideLine
        className="h-10 w-10"
        aria-hidden
        style={{ color: projects ? "#2B4673" : "#FFFFFF" }}
      />
    </Link>
  );
}
