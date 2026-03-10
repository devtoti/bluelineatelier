"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
// @ts-expect-error package exports don't expose types to moduleResolution
import { Splide, SplideSlide } from "@splidejs/react-splide";
import type { Options, Splide as SplideInstance } from "@splidejs/splide";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import "@splidejs/splide/dist/css/splide.min.css";

/* Override react-photo-view fullscreen backdrop to beige */
const photoViewBeigeBackdrop = `.PhotoView-Slider__Backdrop { background: #e8e4dc !important; }`;

/* Thumbnail strip: no arrows; Splide focus "center" keeps active slide centered */
const thumbnailCarouselStyles = `
  [data-thumbnail-carousel] .splide__arrows { display: none !important; }
`;

export type CarouselItem = {
  /** Full-size image URL */
  url: string;
  /** Alt text (required for a11y) */
  alt: string;
  /** Optional caption/description */
  description?: string;
  /** Optional thumbnail URL (uses url if not set) */
  thumbUrl?: string;
};

const ASPECT_VIDEO = 16 / 9;

export type ImageCarouselProps = {
  /** List of images; first item is shown initially */
  items: CarouselItem[];
  /** Main image width (default 1200) */
  width?: number;
  /** Main image height (default 800) */
  height?: number;
  /** Optional class for the carousel wrapper */
  className?: string;
  /** Optional class for the thumbnail strip */
  thumbsClassName?: string;
};

const mainOptions: Options = {
  type: "fade",
  heightRatio: 0.5,
  pagination: false,
  arrows: false,
  cover: true,
};

const thumbnailOptions: Options = {
  rewind: true,
  fixedWidth: 104,
  fixedHeight: 58,
  isNavigation: true,
  gap: 10,
  focus: "center",
  pagination: false,
  arrows: false,
  cover: true,
  trimSpace: false,
  dragMinThreshold: {
    mouse: 4,
    touch: 10,
  },
  breakpoints: {
    640: {
      fixedWidth: 66,
      fixedHeight: 38,
    },
  },
};

/**
 * ArchDaily-style image carousel: one main image (16:9) with Splide thumbnail
 * navigation below. Main and thumbnails stay in sync. Accessible: ARIA, focus.
 */
export function ImageCarousel({
  items,
  width = 1200,
  height = 800,
  className = "",
  thumbsClassName = "",
}: ImageCarouselProps) {
  const regionId = useId();
  const mainId = `${regionId}-main-slider`;
  const thumbId = `${regionId}-thumbnail-slider`;
  const mainRef = useRef<{
    splide: import("@splidejs/splide").default;
    sync(s: import("@splidejs/splide").default): void;
  } | null>(null);
  const thumbsRef = useRef<{
    splide: import("@splidejs/splide").default;
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const main = mainRef.current;
    const thumbs = thumbsRef.current?.splide;
    if (main?.splide && thumbs) {
      main.sync(thumbs);
    }
  }, [items.length]);

  if (!items.length) return null;

  return (
    <PhotoProvider loop={items.length} maskClosable pullClosable>
      <style dangerouslySetInnerHTML={{ __html: photoViewBeigeBackdrop }} />
      <style dangerouslySetInnerHTML={{ __html: thumbnailCarouselStyles }} />
      <section
        id={regionId}
        data-carousel
        className={`overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${className}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Project image gallery"
      >
        {/* Main slider: fade, 16:9, no arrows/pagination; click opens react-photo-view */}
        <Splide
          id={mainId}
          ref={mainRef}
          options={mainOptions}
          onMoved={(splide: SplideInstance) => setCurrentIndex(splide.index)}
          aria-label="Main gallery"
        >
          {items.map((item, index) => (
            <SplideSlide key={`${item.url}-${index}`}>
              <PhotoView src={item.url}>
                <div
                  className="relative cursor-pointer overflow-hidden rounded-sm border border-zinc-300 bg-zinc-200/80 transition-opacity hover:opacity-95"
                  style={{ aspectRatio: ASPECT_VIDEO }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View full size: ${item.alt}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      (e.currentTarget as HTMLElement).click();
                    }
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                    <Image
                      src={item.url}
                      alt={item.alt}
                      width={width}
                      height={height}
                      className="max-h-full max-w-full object-contain"
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        display: "block",
                        mixBlendMode: "multiply",
                      }}
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 640px"
                    />
                  </div>
                </div>
              </PhotoView>
            </SplideSlide>
          ))}
        </Splide>

      {/* Thumbnail navigation (Splide sync); no arrows, active slide centered */}
      {items.length > 1 && (
        <div
          className={`mt-3 ${thumbsClassName}`}
          data-thumbnail-carousel
        >
          <Splide
            id={thumbId}
            ref={thumbsRef}
            options={thumbnailOptions}
            aria-label="Image thumbnails"
          >
            {items.map((item, index) => {
              const thumbSrc = item.thumbUrl ?? item.url;
              return (
                <SplideSlide key={`thumb-${item.url}-${index}`}>
                  <div className="splide__slide__container relative h-full w-full overflow-hidden rounded border-2 border-transparent bg-zinc-100">
                    <Image
                      src={thumbSrc}
                      alt=""
                      width={104}
                      height={58}
                      className="h-full w-full object-cover"
                      sizes="104px"
                    />
                  </div>
                </SplideSlide>
              );
            })}
          </Splide>
        </div>
      )}

      {/* Photo count: current / total */}
      {items.length > 1 && (
        <p
          className="mt-2 text-center text-xs text-zinc-500 tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {currentIndex + 1} / {items.length}
        </p>
      )}

      {/* Live region: announce slide change for screen readers */}
      {items.length > 1 && items[currentIndex] && (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Image {currentIndex + 1} of {items.length}. {items[currentIndex].alt}
        </p>
      )}
    </section>
    </PhotoProvider>
  );
}
