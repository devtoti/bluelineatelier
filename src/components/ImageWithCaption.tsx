"use client";

import Image, { ImageProps } from "next/image";
import type { CSSProperties } from "react";
import { useId, useState } from "react";

export type ImageWithCaptionProps = Omit<ImageProps, "alt"> & {
  /** Short description for the image (required for a11y). Used as alt and in banner. */
  alt: string;
  /** Longer description shown in the bottom banner on hover/focus. Falls back to alt if not provided. */
  description?: string;
  /** Optional class for the figure wrapper. */
  figureClassName?: string;
  /** Fallback image URL when the main image fails to load (e.g. /imgs/placeholder.jpg). */
  fallbackSrc?: string;
};

function CaptionImageBlock({
  aspectStyle,
  imageProps,
  imageSrc,
  alt,
  className,
  fallbackSrc,
  setCurrentSrc,
}: {
  aspectStyle: CSSProperties;
  imageProps: Omit<ImageProps, "alt" | "src">;
  imageSrc: ImageProps["src"];
  alt: string;
  className?: string;
  fallbackSrc?: string;
  setCurrentSrc: (s: string) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full" style={aspectStyle}>
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 z-0 animate-pulse rounded-sm bg-zinc-400/90"
        />
      )}
      <Image
        {...imageProps}
        src={imageSrc}
        alt={alt}
        className={`relative z-[1] h-auto w-full max-h-2xl object-fit mix-blend-multiply ${className ?? ""}`}
        onLoad={(e) => {
          setLoaded(true);
          imageProps.onLoad?.(e);
        }}
        onError={(e) => {
          if (fallbackSrc) setCurrentSrc(fallbackSrc);
          imageProps.onError?.(e);
        }}
      />
    </div>
  );
}

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
  fallbackSrc,
  src,
  ...imageProps
}: ImageWithCaptionProps) {
  const captionId = useId();
  const captionText = description ?? alt;
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    typeof src === "string" ? src : undefined,
  );
  const imageSrc =
    currentSrc ??
    (typeof src === "string" ? (fallbackSrc ?? src) : src);

  const w = imageProps.width;
  const h = imageProps.height;
  const nw =
    typeof w === "number"
      ? w
      : typeof w === "string"
        ? Number.parseFloat(w)
        : NaN;
  const nh =
    typeof h === "number"
      ? h
      : typeof h === "string"
        ? Number.parseFloat(h)
        : NaN;
  const aspectStyle: CSSProperties =
    Number.isFinite(nw) && Number.isFinite(nh) && nh > 0
      ? { aspectRatio: `${nw} / ${nh}` }
      : { minHeight: "12rem" };

  return (
    <figure
      className={`img-figure group relative overflow-hidden  outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 ${figureClassName}`}
      tabIndex={0}
      role="group"
      aria-describedby={captionId}
    >
      <CaptionImageBlock
        key={String(imageSrc)}
        aspectStyle={aspectStyle}
        imageProps={imageProps}
        imageSrc={imageSrc}
        alt={alt}
        className={className}
        fallbackSrc={fallbackSrc}
        setCurrentSrc={setCurrentSrc}
      />
      {captionText !== "" && (
        <figcaption
          id={captionId}
          className="absolute inset-x-0 bottom-0 translate-y-full bg-black/40 rounded-t-sm px-4 py-3 text-sm text-white transition-transform duration-200 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none motion-reduce:translate-y-0"
        >
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}
