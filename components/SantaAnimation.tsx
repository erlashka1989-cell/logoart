"use client";

import { useEffect, useState } from "react";

export default function SantaAnimation() {
  const [visible, setVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setVisible(true);
    }, 1000);

    const interval = setInterval(() => {
      setVisible((prev) => !prev);
      setShowMessage(false);
    }, 15000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        className={`
          pointer-events-auto
          fixed
          bottom-3
          left-2
          cursor-pointer
          transition-all
          duration-1000
          ease-in-out

          sm:bottom-0
          sm:left-0

          ${
            visible
              ? "translate-x-0 translate-y-0 opacity-100"
              : "-translate-x-full translate-y-10 opacity-0"
          }
        `}
        onClick={() => setShowMessage((prev) => !prev)}
      >
        <div className="h-[180px] w-[180px] overflow-hidden rounded-full bg-white shadow-2xl sm:h-[400px] sm:w-[400px]">
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
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-2xl bg-white px-5 py-3 text-lg font-bold shadow-xl">
            Хо-хо-хо! 🎅
          </div>
        )}
      </div>
    </div>
  );
}