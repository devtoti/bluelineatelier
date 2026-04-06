import "../../../../projects.css";
import { TocProjectsShell } from "./TocProjectsShell";

export default async function TableOfContentsZeroPage() {
  return (
    <div className="box-border flex h-[100svh] max-h-[100svh] min-h-0 w-full flex-col overflow-hidden">
      <TocProjectsShell />
    </div>
  );
}
