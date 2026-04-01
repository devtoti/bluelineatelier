export function CaptionText({
  title,
  text,
  className = "",
  titleClassName = "",
  textClassName = "",
}: {
  title: string | undefined;
  text: string | undefined;
  className?: string;
  titleClassName?: string;
  textClassName?: string;
}) {
  return (
    <div className={`mt-3 whitespace-pre-line text-[#2B4673] ${className}`}>
      <p
        className={`pb-2 text-base font-bold uppercase tracking-[0.15em] ${titleClassName}`}
      >
        {title}
      </p>
      <p className={`text-base font-normal ${textClassName}`}>{text}</p>
    </div>
  );
}
