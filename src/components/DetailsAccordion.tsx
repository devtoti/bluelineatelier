"use client";

import { useState, type ReactNode } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type DetailsAccordionProps = {
  title?: string;
  titleSlot?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function DetailsAccordion({
  title,
  titleSlot,
  children,
  defaultOpen = false,
}: DetailsAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  const headerTitle =
    titleSlot ??
    (title != null ? (
      <span className="pb-0 font-bold uppercase tracking-[0.15em]">
        {title}
      </span>
    ) : null);

  return (
    <div className="details-content overview mt-2 rounded">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full py-2 px-2 flex-row items-center gap-0 ml-auto bg-black/5 justify-between flex-wrap text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4673] focus-visible:ring-offset-2 rounded text-[#2B4673]"
        aria-expanded={open}
        aria-controls="details-accordion-content"
        id="details-accordion-trigger"
        aria-label={open ? "Collapse details" : "Expand details"}
      >
        {headerTitle}
        <span className="shrink-0" aria-hidden>
          {open ? (
            <FiChevronUp className="w-5 h-5" />
          ) : (
            <FiChevronDown className="w-5 h-5" />
          )}
        </span>
      </button>
      <div
        id="details-accordion-content"
        role="region"
        aria-labelledby="details-accordion-trigger"
        className="grid gap-6 text-xs sm:grid-cols-3 w-full bg-black/5 py-6 px-4 overflow-hidden"
        style={{
          display: open ? "grid" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
