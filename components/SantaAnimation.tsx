"use client";

import { useEffect, useState } from "react";

export default function SantaAnimation() {
  const [showMessage, setShowMessage] = useState(false);
  const [isMoving, setIsMoving] = useState(true);

  useEffect(() => {
    let stopTimer: ReturnType<typeof setTimeout>;
    let restartTimer: ReturnType<typeof setTimeout>;

    const startSanta = () => {
      setIsMoving(true);

      stopTimer = setTimeout(() => {
        setIsMoving(false);

        restartTimer = setTimeout(() => {
          startSanta();
        }, 2500);
      }, 7000);
    };

    startSanta();

    return () => {
      clearTimeout(stopTimer);
      clearTimeout(restartTimer);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes santaRide {
          0% {
            transform: translateX(120vw);
          }

          100% {
            transform: translateX(-130vw);
          }
        }

        .santa-ride {
          animation: santaRide 15s linear;
        }

        @media (max-width: 640px) {
          .santa-ride {
            animation-duration: 12s;
          }
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
        <div
          className={`absolute bottom-4 ${
            isMoving ? "santa-ride" : ""
          }`}
          style={{
            right: isMoving ? "-450px" : "42%",
            transition: isMoving
              ? "none"
              : "right 0.8s ease-in-out",
          }}
        >
          <div
            className="pointer-events-auto relative cursor-pointer"
            onClick={() => setShowMessage((prev) => !prev)}
          >
            {/* КРУГЛАЯ ОБЛАСТЬ — всё лишнее режется */}
            <div
              className="
                h-[350px] w-[350px]
                overflow-hidden
                rounded-full
                bg-white
                shadow-2xl
                sm:h-[450px] sm:w-[450px]
              "
            >
              <video
                src="/santa.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            </div>

            {showMessage && (
              <div
                className="
                  absolute
                  -top-16
                  left-1/2
                  -translate-x-1/2
                  whitespace-nowrap
                  rounded-2xl
                  bg-white
                  px-5
                  py-3
                  text-lg
                  font-bold
                  shadow-xl
                "
              >
                🎅 Хо-хо-хо!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}