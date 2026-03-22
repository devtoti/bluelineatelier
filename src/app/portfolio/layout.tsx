import { PortfolioLayoutClient } from "@/app/portfolio/PortfolioLayoutClient";
import { Analytics } from "@vercel/analytics/next";
import { PortfolioTypewriterClient } from "@/app/portfolio/PortfolioTypewriterClient";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 w-full max-w-full overflow-x-hidden">
      <PortfolioLayoutClient>{children}</PortfolioLayoutClient>
      <PortfolioTypewriterClient />
      <Analytics />
    </div>
  );
}
