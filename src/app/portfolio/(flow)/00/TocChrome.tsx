"use client";

import { useState } from "react";
import { PortfolioMobileMenu } from "@/components/PortfolioMobileMenu";
import type { PortfolioNavItem } from "@/lib/__portfolioNav";

export function TocChrome({
  children,
  navigation,
}: {
  children: React.ReactNode;
  navigation: PortfolioNavItem[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <PortfolioMobileMenu
        items={navigation}
        activeId="00"
        darkTopBar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpen={() => setIsMobileMenuOpen(true)}
      />
      {children}
    </>
  );
}
