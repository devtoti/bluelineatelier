import Link from "next/link";
import "../../../../projects.css";
import { getProjects } from "@/lib/strapiProjects";
import { buildProjectNavItems } from "@/lib/portfolioNav";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import { ContactInfo } from "@/components/ContactInfo";

export default async function ContactProjectPage() {
  let data: Awaited<ReturnType<typeof getProjects>>["data"] = [];
  try {
    const res = await getProjects();
    data = res.data ?? [];
  } catch (err) {
    console.error("Strapi fetch failed:", err);
  }

  const projectNavItems = buildProjectNavItems(Array.isArray(data) ? data : []);

  return (
    <div
      className="back-cover relative min-h-[100svh] w-full font-sans overflow-hidden"
      style={{ backgroundColor: "#0C1222" }}
    >
      <div className="portfolio-grain" aria-hidden />
      <div className="portfolio-grid" aria-hidden />
      <div className="fixed bottom-6 left-6 z-20 hidden lg:block">
        <ProjectNavigation items={projectNavItems} activeId="07" darkBg />
      </div>
      <div className="relative z-10 px-8 py-12 flex flex-col items-center justify-center min-h-svh">
        <div className="link flex justify-start w-full mr-auto mb-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            ← Back home
          </Link>
        </div>

        <ContactInfo
          name="Antonio Ruiz"
          description="Architect, designer, developer. I bring together architecture and software engineering to create innovative and sustainable solutions."
          email="toti.webdev@gmail.com"
          phone="+52 56 2009 2044"
          portfolio="https://devtoti.com"
          resume="/antonio-ruiz-architect-cv.pdf"
        />
      </div>
    </div>
  );
}
