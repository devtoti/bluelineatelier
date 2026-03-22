"use client";

import { useEffect, useState } from "react";

function getTimeLeft(endDate: Date) {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(ZERO);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(targetDate));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export default function CountdownTimer() {
  const launchDay = new Date("2026-03-08T00:00:00-06:00");
  const { days, hours, minutes, seconds } = useCountdown(launchDay);

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
      <div className="flex flex-col items-center">
        <span className="font-heading text-3xl font-bold tabular-nums text-gray-200 sm:text-4xl">
          {String(days).padStart(2, "0")}
        </span>
        <span className="mt-1 text-xs text-zinc-400">days</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-heading text-3xl font-bold tabular-nums text-gray-200 sm:text-4xl">
          {String(hours).padStart(2, "0")}
        </span>
        <span className="mt-1 text-xs text-zinc-400">hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-heading text-3xl font-bold tabular-nums text-gray-200 sm:text-4xl">
          {String(minutes).padStart(2, "0")}
        </span>
        <span className="mt-1 text-xs text-zinc-400">minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-heading text-3xl font-bold tabular-nums text-gray-200 sm:text-4xl">
          {String(seconds).padStart(2, "0")}
        </span>
        <span className="mt-1 text-xs text-zinc-400">seconds</span>
      </div>
    </div>
  );
}

