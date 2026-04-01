import type { ReactNode } from "react";

export function EntryText({
  title,
  text,
  children,
  className = "",
}: {
  title: string | undefined;
  text: string | undefined;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <dl className={`entry text-[#2B4673] ${className}`}>
      <p className="text-[#2B4673] font-bold uppercase tracking-[0.15em]">
        {title}
      </p>
      <span className="text-sm font-normal flex items-center">
        {text}
        {children}
      </span>
    </dl>
  );
}
