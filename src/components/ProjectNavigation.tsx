"use client";

import Link from "next/link";
import { navItemIsActive, type PortfolioNavItem } from "@/lib/__portfolioNav";
import { activeNavIdFromPathname } from "@/lib/__portfolioFlowNav";
import { usePathname } from "next/navigation";

export type ProjectNavigationItem = PortfolioNavItem;

export type ProjectNavigationProps = {
  navigation: ProjectNavigationItem[];
  darkBg?: boolean;
  className?: string;
};

export function ProjectNavigation({
  navigation,
  darkBg = false,
  className = "",
}: ProjectNavigationProps) {
  const linkBase =
    "flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors";
  const linkActive = darkBg
    ? "bg-white/20 text-white"
    : "bg-[#2B4673] text-white";
  const linkInactive = darkBg
    ? "text-zinc-400 hover:bg-white/15 hover:text-white focus-visible:bg-white/15 focus-visible:text-white"
    : "text-[#2B4673]/70 hover:bg-[#2B4673]/10 hover:text-[#2B4673]";
  const tooltipClass = darkBg
    ? "pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md border border-zinc-500 bg-[#0C1222] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg shadow-black/30 invisible opacity-0 transition-opacity duration-150 delay-100 group-hover:visible group-hover:opacity-100 hidden md:inline-block"
    : "pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md border border-[#2B4673]/20 bg-[#EDE7E3] px-2.5 py-1.5 text-xs font-medium text-[#2B4673] shadow-md invisible opacity-0 transition-opacity duration-150 delay-100 group-hover:visible group-hover:opacity-100 hidden md:inline-block";
  const mobileLabelClass = darkBg
    ? "ml-2 text-xs font-medium text-zinc-200 md:hidden"
    : "ml-2 text-xs font-medium text-[#2B4673] md:hidden";

  const pathname = usePathname();
  const activeId = activeNavIdFromPathname(pathname, navigation);

  return (
    <nav
      aria-label="Project navigation"
      className={`project-navigation flex flex-col gap-1 pl-4 ${className}`}
    >
      <div className="rounded-md border border-white md:border-none md:rounded-none py-1 px-1">
        {navigation.map((item) => {
          const isActive = navItemIsActive(item, activeId);
          return (
            <div key={item.id} className="group relative flex items-center">
              <Link
                href={item.href}
                className={`${linkBase} ${isActive ? linkActive : linkInactive}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
              <span role="tooltip" className={tooltipClass}>
                {item.name}
              </span>
              <span className={mobileLabelClass}>{item.name}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
