import { Analytics } from "@vercel/analytics/react";
import { PortfolioShell } from "@/app/portfolio/PortfolioShell";
import { getStrapiProjects } from "@/lib/__strapiProjects";
import { buildProjectNavItems } from "@/lib/__portfolioNav";

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItemsPromise = getStrapiProjects().then((res) =>
    buildProjectNavItems(res.data),
  );

  return (
    <div className="min-w-0 w-full bg-[#0C1222] max-w-full overflow-x-hidden">
      <div className="portfolio-grain-sm pointer-events-none" aria-hidden />
      <div
        className="portfolio-grid-overlay opacity-80 pointer-events-none"
        aria-hidden
      />
      <PortfolioShell navItemsPromise={navItemsPromise}>
        {children}
      </PortfolioShell>
      <Analytics />
    </div>
  );
}
