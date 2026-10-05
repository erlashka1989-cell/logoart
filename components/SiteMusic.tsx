"use client";

import { useEffect, useRef } from "react";

export default function SiteMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.45;

    const startMusic = async () => {
      try {
        await audio.play();
        audio.muted = false;
      } catch {
        // Browser blocked autoplay with sound. Start muted if possible.
        try {
          audio.muted = true;
          await audio.play();
        } catch {
          return;
        }
      }
    };

    void startMusic();

    const unlockAudio = () => {
      audio.muted = false;
      void audio.play().catch(() => {});
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/music.mp3"
      loop
      preload="auto"
      aria-hidden="true"
      className="hidden"
    />
  );
}
