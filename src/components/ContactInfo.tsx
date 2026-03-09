export type ContactInfoProps = {
  name: string;
  description: string;
  email: string;
  phone: string;
  className?: string;
};

/**
 * Contact card styled like TableOfContents: dark card, zinc typography.
 */
export function ContactInfo({
  name,
  description,
  email,
  phone,
  className = "",
}: ContactInfoProps) {
  return (
    <section
      aria-label="Contact information"
      className={`overflow-hidden rounded-lg border border-gray-600 bg-black/30 shadow-sm transition-shadow hover:shadow-md hover:border-zinc-100/50 border-solid focus-within:ring-2 focus-within:ring-[#2B4673] focus-within:ring-offset-2 focus-within:ring-offset-[#0C1222] ${className}`}
    >
      <div className="flex flex-col p-6">
        <h2 className="font-heading text-2xl font-semibold text-zinc-200">
          {name}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            {description}
          </p>
        ) : null}
        <dl className="mt-6 space-y-3">
          <div>
            <dt className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-zinc-500 opacity-90">
              Email
            </dt>
            <dd className="mt-1">
              <a
                href={`mailto:${email}`}
                className="text-sm font-medium text-zinc-200 underline decoration-zinc-500 underline-offset-2 transition-colors hover:text-[#53A4D7] hover:decoration-[#53A4D7]"
              >
                {email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-zinc-500 opacity-90">
              Phone
            </dt>
            <dd className="mt-1">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="text-sm font-medium text-zinc-200 underline decoration-zinc-500 underline-offset-2 transition-colors hover:text-[#53A4D7] hover:decoration-[#53A4D7]"
              >
                {phone}
              </a>
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-xs font-medium uppercase tracking-widest text-zinc-500 opacity-80">
          Get in touch →
        </p>
      </div>
    </section>
  );
}
