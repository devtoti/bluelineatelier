"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

function CarouselMainSkeleton() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 animate-pulse bg-zinc-400/90"
    />
  );
}

function CarouselThumbSkeleton() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 animate-pulse bg-zinc-400/90"
    />
  );
}

const DEFAULT_FALLBACK = "/imgs/placeholder.jpg";
// @ts-expect-error package exports don't expose types to moduleResolution
import { Splide, SplideSlide } from "@splidejs/react-splide";
import type { Options, Splide as SplideInstance } from "@splidejs/splide";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import "@splidejs/splide/dist/css/splide.min.css";

/* Override react-photo-view fullscreen backdrop to beige */
const photoViewBeigeBackdrop = `.PhotoView-Slider__Backdrop { background: #e8e4dc !important; }`;

/* Thumbnail strip: no arrows; Splide focus "center" keeps active slide centered
   Main active image aspect ratio: 16:9 by default, 1:1 on mobile via .carousel-main-image */
const thumbnailCarouselStyles = `
  [data-thumbnail-carousel] .splide__arrows { display: none !important; }
`;

/* Main image: 16:9 aspect on desktop, 1:1 (square) on screens <= 640px */
const carouselMainImageStyles = `
  .carousel-main-image {
    aspect-ratio: 16 / 9;
  }
  @media (max-width: 640px) {
    .carousel-main-image {
      aspect-ratio: 1 / 1 !important;
    }
  }
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
  /** Fallback image URL when an item fails to load (default: /imgs/placeholder.jpg) */
  fallbackSrc?: string;
};

const mainOptions: Options = {
  type: "fade",
  heightRatio: 9 / 16, // 16:9 from sm (640px) up
  pagination: false,
  arrows: false,
  cover: true,
  breakpoints: {
    // Square aspect only on viewports <= 640px
    640: {
      heightRatio: 1,
    },
  },
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
 * ArchDaily-style image carousel: one main image (16:9 on desktop, 1:1 on mobile) with Splide thumbnail
 * navigation below. Main and thumbnails stay in sync. Accessible: ARIA, focus.
 */
function CarouselMainImageInner({
  item,
  width,
  height,
  effectiveSrc,
  priority,
  onErrorFallback,
}: {
  item: CarouselItem;
  width: number;
  height: number;
  effectiveSrc: string;
  priority?: boolean;
  onErrorFallback: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative h-full w-full">
      {!loaded && <CarouselMainSkeleton />}
      <Image
        src={effectiveSrc}
        alt={item.alt}
        width={width}
        height={height}
        className="relative z-[1] h-full w-full object-cover"
        style={{
          display: "block",
          mixBlendMode: "multiply",
        }}
        priority={priority}
        onLoad={() => setLoaded(true)}
        onError={onErrorFallback}
      />
    </div>
  );
}

function CarouselImage({
  item,
  width,
  height,
  fallbackSrc,
  priority,
}: {
  item: CarouselItem;
  width: number;
  height: number;
  fallbackSrc: string;
  priority?: boolean;
}) {
  const [src, setSrc] = useState(item.url);
  const effectiveSrc = src || fallbackSrc;

  return (
    <CarouselMainImageInner
      key={effectiveSrc}
      item={item}
      width={width}
      height={height}
      effectiveSrc={effectiveSrc}
      priority={priority}
      onErrorFallback={() => setSrc(fallbackSrc)}
    />
  );
}

function CarouselThumbImageInner({
  currentSrc,
  onErrorFallback,
}: {
  currentSrc: string;
  onErrorFallback: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative h-full w-full">
      {!loaded && <CarouselThumbSkeleton />}
      <Image
        src={currentSrc}
        alt=""
        width={104}
        height={58}
        className="relative z-[1] h-full w-full object-cover"
        sizes="104px"
        onLoad={() => setLoaded(true)}
        onError={onErrorFallback}
      />
    </div>
  );
}

function CarouselThumbImage({
  src,
  fallbackSrc,
}: {
  src: string;
  fallbackSrc: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    <CarouselThumbImageInner
      key={currentSrc}
      currentSrc={currentSrc}
      onErrorFallback={() => setCurrentSrc(fallbackSrc)}
    />
  );
}

export function ImageCarousel({
  items,
  width = 1200,
  height = 800,
  className = "",
  thumbsClassName = "",
  fallbackSrc = DEFAULT_FALLBACK,
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
      <style dangerouslySetInnerHTML={{ __html: carouselMainImageStyles }} />
      <section
        id={regionId}
        data-carousel
        className={`overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${className}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Project image gallery"
      >
        {/* Main slider: fade, 16:9 desktop / 1:1 mobile, no arrows/pagination; click opens react-photo-view */}
        <Splide
          id={mainId}
          ref={mainRef}
          options={mainOptions}
          onMoved={(splide: SplideInstance) => setCurrentIndex(splide.index)}
          aria-label="Main gallery"
        >
          {items.map((item, index) => (
            <SplideSlide key={`${item.url}-${index}`}>
              <PhotoView src={item.url || fallbackSrc}>
                <div
                  className="carousel-main-image relative cursor-pointer overflow-hidden rounded-sm border border-zinc-300 bg-zinc-200/80 transition-opacity hover:opacity-95"
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
                  <div className="absolute inset-0 bg-zinc-200">
                    <CarouselImage
                      item={item}
                      width={width}
                      height={height}
                      fallbackSrc={fallbackSrc}
                      priority={index === 0}
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
          className={`mt-3 w-full min-w-0 max-w-full ${thumbsClassName}`}
          data-thumbnail-carousel
        >
          <Splide
            id={thumbId}
            ref={thumbsRef}
            options={thumbnailOptions}
            aria-label="Image thumbnails"
          >
            {items.map((item, index) => {
              const thumbSrc = item.thumbUrl ?? item.url ?? fallbackSrc;
              return (
                <SplideSlide key={`thumb-${item.url}-${index}`}>
                  <div className="splide__slide__container relative h-full w-full overflow-hidden rounded border-2 border-transparent bg-zinc-100">
                    <CarouselThumbImage
                      src={thumbSrc}
                      fallbackSrc={fallbackSrc}
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
