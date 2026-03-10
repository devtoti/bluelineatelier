import { PortfolioLayoutClient } from "@/app/portfolio/PortfolioLayoutClient";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortfolioLayoutClient>{children}</PortfolioLayoutClient>;
}
