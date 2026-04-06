import { getStrapiProjects } from "@/lib/__strapiProjects";
import { buildProjectNavigation } from "@/lib/__portfolioNav";

import {
  PortfolioChevronLeft as LeftNav,
  PortfolioChevronRight as RightNav,
} from "@/components/PortfolioChevrons";
import { ProjectNavigation } from "@/components/ProjectNavigation";

function ProjectNavFallback() {
  return (
    <div
      className="pb-10 pl-2 hidden lg:block relative z-10 mt-auto"
      aria-hidden
    >
      <div className="flex flex-col gap-2">
        <div className="h-8 w-8 animate-pulse rounded bg-white/10" />
        <div className="h-8 w-8 animate-pulse rounded bg-white/10" />
        <div className="h-8 w-8 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
export default async function PortfolioFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await getStrapiProjects();
  const navigation = buildProjectNavigation(data);
  return (
    <>
      {/* <PortfolioMobileMenu
      items={navigation}
      activeId={activeId}
      darkTopBar={darkTopBar}
      isOpen={isMobileMenuOpen}
      onClose={() => setIsMobileMenuOpen(false)}
      onOpen={() => setIsMobileMenuOpen(true)}
    /> */}

      <div className="grid grid-cols-[1fr] md:grid-cols-[4rem_1fr_4rem] grid-rows-[1fr_4rem_1fr] min-h-svh min-w-0 w-full max-w-full overflow-hidden">
        <div className="hidden md:flex row-start-1 row-end-4 min-w-0 flex-col relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <LeftNav navigation={navigation} />
          </div>
          {/* <Suspense fallback={<ProjectNavFallback />}>
        </Suspense> */}
          <div
            className="pb-10 pl-2 hidden lg:block relative z-10 mt-auto"
            aria-label="Project index"
          >
            <ProjectNavigation navigation={navigation} darkBg />
          </div>
        </div>
        <div className="center-col relative min-h-0 min-w-0 overflow-x-hidden col-start-1 col-end-2 md:col-start-2 md:col-end-3 row-start-1 row-end-4">
          {children}
        </div>
        <div className="hidden md:flex row-start-2 row-end-3 justify-center">
          <RightNav navigation={navigation} />
        </div>
      </div>
    </>
  );
}
