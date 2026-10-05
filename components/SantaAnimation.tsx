"use client";

import { useEffect, useState } from "react";

export default function SantaAnimation() {
  const [visible, setVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [typedText, setTypedText] = useState("");

  const message = "ХО-ХО-ХО! LogoArt дарит подарки! 🎅";

  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setVisible(true);
    }, 1000);

    const interval = setInterval(() => {
      setVisible((prev) => !prev);
      setShowMessage(false);
      setTypedText("");
    }, 15000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!showMessage) {
      setTypedText("");
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setTypedText(message.slice(0, index));

      if (index >= message.length) {
        clearInterval(timer);
      }
    }, 55);

    return () => clearInterval(timer);
  }, [showMessage]);

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
          ${visible
            ? "translate-x-0 translate-y-0 opacity-100"
            : "-translate-x-full translate-y-10 opacity-0"}
        `}
        onClick={() => setShowMessage((prev) => !prev)}
      >
        <div className="h-[180px] w-[180px] overflow-hidden rounded-full bg-white shadow-2xl sm:h-[250px] sm:w-[250px]">
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
          <div
            className="absolute left-[92px] top-[54px] z-10 w-[190px] text-left text-sm font-bold leading-5 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] sm:left-[128px] sm:top-[78px] sm:w-[245px] sm:text-base"
            aria-live="polite"
          >
            <span>{typedText}</span>
            <span className="ml-0.5 animate-pulse">|</span>
          </div>
        )}
      </div>
    </div>
  );
}
