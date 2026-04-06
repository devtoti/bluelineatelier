import { Analytics } from "@vercel/analytics/react";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Analytics />
      <div className="min-w-0 w-full bg-[#0C1222] max-w-full overflow-x-hidden">
        <div className="portfolio-grain-sm pointer-events-none" aria-hidden />
        <div
          className="portfolio-grid-overlay opacity-80 pointer-events-none"
          aria-hidden
        />
        {children}
      </div>
    </>
  );
}
