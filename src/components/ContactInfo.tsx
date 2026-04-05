import Link from "next/link";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { FaLinkedin, FaDribbble } from "react-icons/fa";

const iconClass =
  "text-zinc-400 w-6 h-6 stroke-[1px] transition-colors duration-150 group-hover:text-[#53A4D7] group-focus:text-[#53A4D7]";

const tooltipClass =
  "pointer-events-none absolute top-4 left-1/2 z-50 mt-4 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-500 bg-[#0C1222] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg shadow-black/30 invisible opacity-0 transition-opacity duration-150 delay-100 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100";

function GitHubMark() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export type ContactInfoProps = {
  name: string;
  description: string;
  email: string;
  phone: string;
  portfolio?: string;
  className?: string;
  linkedin?: string;
  dribbble?: string;
  github?: string;
  resume?: string; // url to PDF
};

/**
 * Contact card styled like TableOfContents: dark card, zinc typography.
 */
export function ContactInfo({
  name,
  description,
  email,
  phone,
  github,
  className = "",
  linkedin,
  dribbble,
  resume,
}: ContactInfoProps) {
  return (
    <div
      className={`blueprint-container relative w-full md:w-2/5 h-min max-w-96 text-center flex flex-col align-center justify-center bg-black/5 p-4 py-8 my-auto ${className}`.trim()}
    >
      {/* <span className="deco"></span>
      <span className="deco"></span>
      <span className="deco"></span>
      <span className="deco"></span> */}
      <span className="bracket top-0 left-0 absolute w-5 h-5 border-t-2 border-l-2 border-white opacity-50"></span>
      <span className="bracket top-0 right-0 absolute w-5 h-5 border-t-2 border-r-2 border-white opacity-50"></span>
      <span className="bracket bottom-0 left-0 absolute w-5 h-5 border-b-2 border-l-2 border-white opacity-50"></span>
      <span className="bracket bottom-0 right-0 absolute w-5 h-5 border-b-2 border-r-2 border-white opacity-50"></span>
      <h2 className="font-heading text-xl font-semibold text-zinc-200 mt-8">
        {name}
      </h2>
      <dl className="my-4 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <dt className="sr-only">Email</dt>
          <a
            href={`mailto:${email}`}
            className="icon-style group relative w-10 h-10 aspect-square border border-zinc-400 border-[1px] flex items-center justify-center transition-colors duration-150 hover:border-[#53A4D7] hover:bg-[#15304a] hover:bg-white/10 focus:border-[#53A4D7] focus:bg-[#15304a] focus:outline-none focus:ring-2 focus:ring-[#53A4D7] focus:ring-offset-2"
            aria-label="Email"
          >
            <HiOutlineMail className={iconClass} aria-hidden />
            <span role="tooltip" className={tooltipClass}>
              Email
            </span>
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="icon-style group relative w-10 h-10 aspect-square border border-zinc-400 border-[1px] flex items-center justify-center transition-colors duration-150 hover:border-[#53A4D7] hover:bg-[#15304a] hover:bg-white/10 focus:border-[#53A4D7] focus:bg-[#15304a] focus:outline-none focus:ring-2 focus:ring-[#53A4D7] focus:ring-offset-2"
            aria-label="Phone"
            tabIndex={0}
          >
            <HiOutlinePhone className={iconClass} aria-hidden />
            <span role="tooltip" className={tooltipClass}>
              Phone
            </span>
          </a>
          {github &&
            (github.startsWith("/") ? (
              <Link
                href={github}
                className="icon-style group relative w-10 h-10 aspect-square border border-zinc-400 border-[1px] flex items-center justify-center transition-colors duration-150 hover:border-[#53A4D7] hover:bg-[#15304a] hover:bg-white/10 focus:border-[#53A4D7] focus:bg-[#15304a] focus:outline-none focus:ring-2 focus:ring-[#53A4D7] focus:ring-offset-2"
                aria-label="GitHub"
              >
                <GitHubMark />
                <span role="tooltip" className={tooltipClass}>
                  GitHub
                </span>
              </Link>
            ) : (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-style group relative w-10 h-10 aspect-square border border-zinc-400 border-[1px] flex items-center justify-center transition-colors duration-150 hover:border-[#53A4D7] hover:bg-[#15304a] hover:bg-white/10 focus:border-[#53A4D7] focus:bg-[#15304a] focus:outline-none focus:ring-2 focus:ring-[#53A4D7] focus:ring-offset-2"
                aria-label="GitHub"
              >
                <GitHubMark />
                <span role="tooltip" className={tooltipClass}>
                  GitHub
                </span>
              </a>
            ))}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-style group relative w-10 h-10 aspect-square border border-zinc-400 border-[1px] flex items-center justify-center transition-colors duration-150 hover:border-[#53A4D7] hover:bg-[#15304a] hover:bg-white/10 focus:border-[#53A4D7] focus:bg-[#15304a] focus:outline-none focus:ring-2 focus:ring-[#53A4D7] focus:ring-offset-2"
              aria-label="LinkedIn"
            >
              <FaLinkedin className={iconClass} aria-hidden />
              <span role="tooltip" className={tooltipClass}>
                LinkedIn
              </span>
            </a>
          )}
          {dribbble && (
            <a
              href={dribbble}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-style group relative w-10 h-10 aspect-square border border-zinc-400 border-[1px] flex items-center justify-center transition-colors duration-150 hover:border-[#53A4D7] hover:bg-[#15304a] hover:bg-white/10 focus:border-[#53A4D7] focus:bg-[#15304a] focus:outline-none focus:ring-2 focus:ring-[#53A4D7] focus:ring-offset-2"
              aria-label="Dribbble"
            >
              <FaDribbble className={iconClass} aria-hidden />
              <span role="tooltip" className={tooltipClass}>
                Dribbble
              </span>
            </a>
          )}
          {resume && (
            <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-style group relative w-10 h-10 aspect-square border border-zinc-400 border-[1px] flex items-center justify-center transition-colors duration-150 hover:border-[#53A4D7] hover:bg-[#15304a] hover:bg-white/10 focus:border-[#53A4D7] focus:bg-[#15304a] focus:outline-none focus:ring-2 focus:ring-[#53A4D7] focus:ring-offset-2"
              aria-label="Resumé"
            >
              <HiOutlineDocumentText className={iconClass} aria-hidden />
              <span role="tooltip" className={tooltipClass}>
                Resumé
              </span>
            </a>
          )}
        </div>
      </dl>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-zinc-500 max-w-[30ch] mx-auto">
          {description}
        </p>
      ) : null}
    </div>
  );
}
