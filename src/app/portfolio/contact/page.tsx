import "../../../projects.css";
import { getProjects } from "@/lib/strapiProjects";
import { buildProjectNavItems } from "@/lib/portfolioNav";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import { ContactInfo } from "@/components/ContactInfo";

export default async function ContactPage() {
  let data: Awaited<ReturnType<typeof getProjects>>["data"] = [];
  try {
    const res = await getProjects();
    data = res.data ?? [];
  } catch (err) {
    console.error("Strapi fetch failed:", err);
  }

  const projectNavItems = buildProjectNavItems(Array.isArray(data) ? data : []);

  return (
    <div className="back-cover relative min-h-[100svh] w-full font-sans overflow-hidden">
      <div className="fixed bottom-10 left-2 z-20 hidden lg:block">
        <ProjectNavigation items={projectNavItems} activeId="07" darkBg />
      </div>
      <div className="relative z-10 px-8 py-12 flex flex-col items-center justify-center min-h-svh">
        <ContactInfo
          name="Antonio Ruiz"
          description="Architect, designer, developer. I bring together architecture and software engineering to create innovative and sustainable solutions."
          email="toti.webdev@gmail.com"
          phone="+52 56 2009 2044"
          portfolio="https://devtoti.com"
          resume="/docs/antonio-ruiz-architect-cv.pdf"
        />
      </div>
    </div>
  );
}
