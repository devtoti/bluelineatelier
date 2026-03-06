"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

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

const MAX_THUMBS = 5;
const TOTAL_SLOTS = 6; // 5 thumbs + 1 "more" slot; always show 6 so layout doesn't shift
const SLOT_SIZE = 100;
const SLOT_GAP = 8;
const STRIP_WIDTH = TOTAL_SLOTS * SLOT_SIZE + (TOTAL_SLOTS - 1) * SLOT_GAP;
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

/**
 * ArchDaily-style image carousel: one main image (16:9) with a horizontal strip of
 * up to 6 thumbnails below. Last slot shows blurred "{n}+" when more images exist.
 * Chevrons and keyboard navigate. Accessible: ARIA, focus management.
 */
export function ImageCarousel({
  items,
  width = 1200,
  height = 800,
  className = "",
  thumbsClassName = "",
}: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbListRef = useRef<HTMLDivElement>(null);
  const regionId = useId();
  const thumbId = (i: number) => `${regionId}-thumb-${i}`;

  const selectedItem = items[selectedIndex] ?? null;
  const count = items.length;

  const goTo = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(index, count - 1));
      setSelectedIndex(next);
      const list = thumbListRef.current;
      if (list) {
        const btn = list.querySelector<HTMLButtonElement>(
          `[data-carousel-index="${next}"]`,
        );
        btn?.scrollIntoView({
          block: "nearest",
          inline: "center",
          behavior: "smooth",
        });
      }
    },
    [count],
  );

  const goNext = useCallback(() => {
    if (selectedIndex === count - 1) goTo(0);
    else goTo(selectedIndex + 1);
  }, [count, selectedIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(selectedIndex - 1);
  }, [selectedIndex, goTo]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (count <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(count - 1);
      }
    },
    [count, goPrev, goNext, goTo],
  );

  const windowSize = 5;
  const windowStart =
    count > windowSize
      ? Math.max(0, Math.min(selectedIndex - 2, count - windowSize))
      : 0;
  const hasManyImages = count > MAX_THUMBS;
  const remainingAfterWindow = count - (windowStart + windowSize);
  const moreCount = remainingAfterWindow;

  useEffect(() => {
    if (count <= 1 || selectedIndex < 0 || selectedIndex >= count) return;
    const list = thumbListRef.current;
    if (!list) return;
    const btn = list.querySelector<HTMLButtonElement>(
      `[data-carousel-index="${selectedIndex}"]`,
    );
    btn?.focus();
  }, [selectedIndex, count]);

  if (!items.length) return null;

  return (
    <section
      id={regionId}
      className={`overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Project image gallery"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Main image: 16:9 container, image fills as cover */}
      <div
        className="relative overflow-hidden rounded-lg border border-zinc-300 bg-zinc-200/80"
        style={{ aspectRatio: ASPECT_VIDEO }}
      >
        {selectedItem && (
          <Image
            src={selectedItem.url}
            alt={selectedItem.alt}
            width={width}
            height={height}
            className="absolute inset-0 h-full w-full object-cover"
            priority={selectedIndex === 0}
            sizes="(max-width: 768px) 100vw, 640px"
          />
        )}
        {selectedItem?.description && (
          <p
            className="absolute inset-x-0 bottom-0 bg-[#2B4673]/90 px-4 py-3 text-sm text-white"
            id={`${regionId}-caption`}
          >
            {selectedItem.description}
          </p>
        )}
      </div>

      {/* Thumbnail strip */}
      {count > 1 && (
        <div
          className={`mt-3 flex justify-between items-center gap-2 ${thumbsClassName}`}
        >
          <button
            type="button"
            onClick={() => goTo(selectedIndex - 1)}
            disabled={selectedIndex === 0}
            aria-label="Previous image"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            ref={thumbListRef}
            className="flex shrink-0 gap-2 overflow-hidden py-1"
            style={{
              width: STRIP_WIDTH,
              minWidth: STRIP_WIDTH,
              maxWidth: STRIP_WIDTH,
            }}
            role="tablist"
            aria-label="Image thumbnails"
            aria-describedby={
              selectedItem?.description ? `${regionId}-caption` : undefined
            }
          >
            {Array.from({ length: TOTAL_SLOTS }, (_, slotIndex) => {
              const slotStyle = {
                width: SLOT_SIZE,
                height: SLOT_SIZE,
                minWidth: SLOT_SIZE,
                minHeight: SLOT_SIZE,
              };
              if (hasManyImages) {
                if (slotIndex < MAX_THUMBS) {
                  const i = windowStart + slotIndex;
                  const item = items[i];
                  if (!item) return <div key={slotIndex} style={{ ...slotStyle, flexShrink: 0 }} aria-hidden />;
                  const isSelected = i === selectedIndex;
                  const thumbSrc = item.thumbUrl ?? item.url;
                  return (
                    <button
                      key={`${i}-${item.url}`}
                      type="button"
                      id={thumbId(i)}
                      data-carousel-index={i}
                      role="tab"
                      aria-selected={isSelected}
                      aria-label={`View image ${i + 1} of ${count}: ${item.alt}`}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => goTo(i)}
                      className="relative shrink-0 overflow-hidden rounded border-2 bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 motion-reduce:transition-none"
                      style={{
                        ...slotStyle,
                        borderColor: isSelected ? "#2B4673" : "transparent",
                      }}
                    >
                      <Image
                        src={thumbSrc}
                        alt=""
                        width={SLOT_SIZE}
                        height={SLOT_SIZE}
                        className="h-full w-full object-cover"
                        sizes={`${SLOT_SIZE}px`}
                        aria-hidden
                      />
                    </button>
                  );
                }
                return (
                  <div
                    key="more"
                    className="relative flex shrink-0 items-center justify-center overflow-hidden rounded border-2 border-transparent bg-zinc-400"
                    style={slotStyle}
                    aria-hidden
                  >
                    {items[windowStart + MAX_THUMBS] && (
                      <Image
                        src={
                          items[windowStart + MAX_THUMBS].thumbUrl ??
                          items[windowStart + MAX_THUMBS].url
                        }
                        alt=""
                        width={SLOT_SIZE}
                        height={SLOT_SIZE}
                        className="h-full w-full object-cover blur-md scale-110"
                        sizes={`${SLOT_SIZE}px`}
                      />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-lg font-semibold text-white">
                      {moreCount}+
                    </span>
                  </div>
                );
              }
              if (slotIndex < count) {
                const i = slotIndex;
                const item = items[i];
                if (!item) return <div key={slotIndex} style={{ ...slotStyle, flexShrink: 0 }} aria-hidden />;
                const isSelected = i === selectedIndex;
                const thumbSrc = item.thumbUrl ?? item.url;
                return (
                  <button
                    key={`${i}-${item.url}`}
                    type="button"
                    id={thumbId(i)}
                    data-carousel-index={i}
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`View image ${i + 1} of ${count}: ${item.alt}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => goTo(i)}
                    className="relative shrink-0 overflow-hidden rounded border-2 bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 motion-reduce:transition-none"
                    style={{
                      ...slotStyle,
                      borderColor: isSelected ? "#2B4673" : "transparent",
                    }}
                  >
                    <Image
                      src={thumbSrc}
                      alt=""
                      width={SLOT_SIZE}
                      height={SLOT_SIZE}
                      className="h-full w-full object-cover"
                      sizes={`${SLOT_SIZE}px`}
                      aria-hidden
                    />
                  </button>
                );
              }
              return <div key={`empty-${slotIndex}`} style={{ ...slotStyle, flexShrink: 0 }} aria-hidden />;
            })}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label={
              selectedIndex === count - 1
                ? "Next image (back to first)"
                : "Next image"
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Photo count: current / total, updates as user navigates */}
      {count > 1 && (
        <p
          className="mt-2 text-center text-xs text-zinc-500 tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {selectedIndex + 1} / {count}
        </p>
      )}

      {/* Live region: announce slide change for screen readers */}
      {count > 1 && (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Image {selectedIndex + 1} of {count}. {selectedItem?.alt}
        </p>
      )}
    </section>
  );
}
