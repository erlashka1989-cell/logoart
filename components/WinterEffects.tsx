"use client";

import { useEffect, useRef, useState } from "react";

const flakes = Array.from({ length: 35 }, (_, index) => ({
  id: index,
  left: (index * 29) % 100,
  delay: (index * 0.73) % 8,
  duration: 8 + ((index * 1.37) % 7),
  size: 8 + ((index * 3) % 10),
  opacity: 0.45 + ((index * 0.13) % 0.5),
}));

export function WinterEffects() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.25;

    const startMusic = async () => {
      try {
        await audio.play();
        setIsPlaying(true);

        document.removeEventListener("click", startMusic);
        document.removeEventListener("touchstart", startMusic);
      } catch {
        // Браузер заблокировал запуск — ждём следующего взаимодействия
      }
    };

    document.addEventListener("click", startMusic);
    document.addEventListener("touchstart", startMusic);

    return () => {
      document.removeEventListener("click", startMusic);
      document.removeEventListener("touchstart", startMusic);
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* SNOW */}
      <div className="snow-container" aria-hidden="true">
        {flakes.map((flake) => (
          <span
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
              fontSize: `${flake.size}px`,
              opacity: flake.opacity,
            }}
          >
            ❄
          </span>
        ))}
      </div>

      {/* MUSIC */}
      <audio ref={audioRef} src="/music/background.mp3" loop preload="auto" />

      <button
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Выключить музыку" : "Включить музыку"}
        className="music-toggle"
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>
    </>
  );
}