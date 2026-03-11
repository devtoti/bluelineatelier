"use client";

import Link from "next/link";

export type ProjectNavigationItem = {
  id: string;
  name: string;
  href?: string;
};

export type ProjectNavigationProps = {
  items: ProjectNavigationItem[];
  activeId: string;
  darkBg?: boolean;
  className?: string;
};

export function ProjectNavigation({
  items,
  activeId,
  darkBg = false,
  className = "",
}: ProjectNavigationProps) {
  const normalizedActive = activeId.replace(/^0+/, "") || "0";
  const activePcode =
    normalizedActive.length === 1
      ? `0${normalizedActive}`
      : normalizedActive.padStart(2, "0");

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

  const renderItem = (
    id: string,
    label: string,
    tooltip: string,
    href: string,
    isActive: boolean,
  ) => (
    <div key={id} className="group relative flex items-center">
      <Link
        href={href}
        className={`${linkBase} ${isActive ? linkActive : linkInactive}`}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
      <span role="tooltip" className={tooltipClass}>
        {tooltip}
      </span>
      <span className={mobileLabelClass}>{tooltip}</span>
    </div>
  );

  return (
    <nav
      aria-label="Project navigation"
      className={`project-navigation flex flex-col gap-1 pl-4 ${className}`}
    >
      <div className="rounded-md border border-white md:border-none md:rounded-none py-1 px-1">
        {renderItem("cover", "CR", "Cover", "/portfolio", activeId === "cover")}
        {items.map(({ id, name, href }) => {
          const isActive = id === activePcode || activeId === id;

          // 00 is table of contents
          if (id === "00") {
            const linkHref = href ?? "/portfolio/00";
            return renderItem(
              "00",
              "00",
              name || "Table of contents",
              linkHref,
              isActive,
            );
          }

          const linkHref = href ?? `/portfolio/projects/${id}`;
          return renderItem(id, id, name, linkHref, isActive);
        })}
        {renderItem(
          "07",
          "CT",
          "Contact",
          "/portfolio/contact",
          activeId === "07",
        )}
      </div>
    </nav>
  );
}
