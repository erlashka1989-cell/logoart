"use client";

import { useEffect, useState } from "react";

export default function SantaAnimation() {
  const [visible, setVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Первое появление через 1 секунду
    const firstTimer = setTimeout(() => {
      setVisible(true);
    }, 1000);

    // Затем периодически показываем/скрываем
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
      setShowMessage(false);
    }, 10000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <div
        className={`
          pointer-events-auto
          absolute
          bottom-5
          right-5
          cursor-pointer
          transition-all
          duration-1000
          ease-in-out
          ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-[120%] opacity-0"
          }
        `}
        onClick={() => setShowMessage(!showMessage)}
      >
        <div className="h-[250px] w-[250px] overflow-hidden rounded-full bg-white shadow-2xl sm:h-[450px] sm:w-[450px]">
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