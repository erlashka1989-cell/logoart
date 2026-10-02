"use client";

import { useState } from "react";

export default function SantaAnimation() {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        className="pointer-events-auto absolute bottom-5 left-5 cursor-pointer"
        onClick={() => setShowMessage((prev) => !prev)}
      >
        <div className="h-[350px] w-[350px] overflow-hidden rounded-full bg-white shadow-2xl sm:h-[450px] sm:w-[450px]">
          <video
            src="/santa.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        </div>

        {showMessage && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-white px-5 py-3 text-lg font-bold shadow-xl">
            Хо-хо-хо! 🎅
          </div>
        )}
      </div>
    </div>
  );
}