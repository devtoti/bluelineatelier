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

export type ContactInfoProps = {
  name: string;
  description: string;
  email: string;
  phone: string;
  portfolio: string;
  className?: string;
  linkedin?: string;
  dribbble?: string;
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
  portfolio,
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
          {portfolio &&
            (portfolio.startsWith("/") ? (
              <Link
                href={portfolio}
                className="icon-style group relative w-10 h-10 aspect-square border border-zinc-400 border-[1px] flex items-center justify-center transition-colors duration-150 hover:border-[#53A4D7] hover:bg-[#15304a] hover:bg-white/10 focus:border-[#53A4D7] focus:bg-[#15304a] focus:outline-none focus:ring-2 focus:ring-[#53A4D7] focus:ring-offset-2"
                aria-label="Website"
              >
                <HiOutlineGlobeAlt className={iconClass} aria-hidden />
                <span role="tooltip" className={tooltipClass}>
                  Website
                </span>
              </Link>
            ) : (
              <a
                href={portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-style group relative w-10 h-10 aspect-square border border-zinc-400 border-[1px] flex items-center justify-center transition-colors duration-150 hover:border-[#53A4D7] hover:bg-[#15304a] hover:bg-white/10 focus:border-[#53A4D7] focus:bg-[#15304a] focus:outline-none focus:ring-2 focus:ring-[#53A4D7] focus:ring-offset-2"
                aria-label="Website"
              >
                <HiOutlineGlobeAlt className={iconClass} aria-hidden />
                <span role="tooltip" className={tooltipClass}>
                  Website
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
