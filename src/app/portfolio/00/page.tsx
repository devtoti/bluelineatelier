import "../../../projects.css";
import { Suspense } from "react";
import {
  TocProjectsShell,
  TocProjectsShellFallback,
} from "./TocProjectsShell";

export default function TableOfContentsZeroPage() {
  return (
    <div className="box-border flex h-[100svh] max-h-[100svh] min-h-0 w-full flex-col overflow-hidden">
      <Suspense fallback={<TocProjectsShellFallback />}>
        <TocProjectsShell />
      </Suspense>
    </div>
  );
}
