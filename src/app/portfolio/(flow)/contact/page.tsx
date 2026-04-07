import "../../../../projects.css";
import { getStrapiProjects } from "@/lib/__strapiProjects";
import { buildProjectNavigation } from "@/lib/__portfolioNav";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import { ContactInfo } from "@/components/ContactInfo";

export default async function ContactPage() {
  const { data } = await getStrapiProjects();
  const navigation = buildProjectNavigation(data);

  return (
    <div className="back-cover relative min-h-[100svh] w-full font-sans overflow-hidden">
      <div className="fixed bottom-10 left-2 z-20 hidden lg:block">
        <ProjectNavigation navigation={navigation} darkBg />
      </div>
      <div className="relative z-10 px-8 py-12 flex flex-col items-center justify-center min-h-svh">
        <ContactInfo
          name="Antonio Ruiz"
          description="Architect, designer, developer. I bring together architecture and software engineering to create innovative and sustainable design solutions."
          email="toti.webdev@gmail.com"
          phone="+52 56 2009 2044"
          github="https://github.com/devtoti"
          resume="/docs/antonio-ruiz-architect-cv.pdf"
        />
        <span className="text-zinc-600 text-xs text-balance text-center italic flex items-center flex-col justify-center gap-2">
          <p>{"/* Built with Next.js, Tailwind, Strapi, and Neon */"}</p>
          <p>{"/* Last updated: 04/05/2026 */"}</p>
        </span>
      </div>
    </div>
  );
}
