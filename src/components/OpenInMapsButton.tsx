"use client";

import { MdLocationPin } from "react-icons/md";
import { useState } from "react";

type OpenInMapsButtonProps = {
  latitude: number;
  longitude: number;
};

export function OpenInMapsButton({
  latitude,
  longitude,
}: OpenInMapsButtonProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      className="ml-2 inline-flex items-center text-blue-700 hover:text-blue-900 focus:outline-none"
      title="Open location in Google Maps"
      style={{ cursor: hovered ? "pointer" : "default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }}
    >
      <MdLocationPin
        className="w-4 h-4 mr-1 inline transition-colors"
        style={{
          color: hovered ? "#20416b" : "#2B4673",
        }}
      />
      <span className="sr-only">Show in Google Maps</span>
    </button>
  );
}
