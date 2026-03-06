"use client";

import Image, { ImageProps } from "next/image";
import { useId } from "react";

export type ImageWithCaptionProps = Omit<ImageProps, "alt"> & {
  /** Short description for the image (required for a11y). Used as alt and in banner. */
  alt: string;
  /** Longer description shown in the bottom banner on hover/focus. Falls back to alt if not provided. */
  description?: string;
  /** Optional class for the figure wrapper. */
  figureClassName?: string;
};

/**
 * Renders a Next.js Image with an optional description banner that appears at the bottom
 * on hover and on keyboard focus. Accessible: caption is in the DOM for screen readers,
 * focusable so keyboard users can reveal the banner, and respects prefers-reduced-motion.
 */
export function ImageWithCaption({
  alt,
  description,
  figureClassName = "",
  className,
  ...imageProps
}: ImageWithCaptionProps) {
  const captionId = useId();
  const captionText = description ?? alt;

  return (
    <figure
      className={`group relative overflow-hidden  outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 ${figureClassName}`}
      tabIndex={0}
      role="group"
      aria-describedby={captionId}
    >
      <Image
        {...imageProps}
        alt={alt}
        className={`h-auto w-full object-fit mix-blend-multiply ${className ?? ""}`}
      />
      <figcaption
        id={captionId}
        className="absolute inset-x-0 bottom-0 translate-y-full bg-[#2B4673]/90 px-4 py-3 text-sm text-white transition-transform duration-200 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none motion-reduce:translate-y-0"
      >
        {captionText}
      </figcaption>
    </figure>
  );
}
