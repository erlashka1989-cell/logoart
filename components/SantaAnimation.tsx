"use client";

import { useEffect, useState } from "react";

export default function SantaAnimation() {
  const [showMessage, setShowMessage] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let waveTimer: NodeJS.Timeout;
    let restartTimer: NodeJS.Timeout;

    const startAnimation = () => {
      setIsVisible(true);
      setShowMessage(false);
      setIsMoving(true);

      // Через 7 секунд останавливаем Деда Мороза
      waveTimer = setTimeout(() => {
        setIsMoving(false);

        // Через 2.5 секунды снова начинает движение
        restartTimer = setTimeout(() => {
          setIsMoving(true);
        }, 2500);
      }, 7000);
    };

    startAnimation();

    // Повторяем появление каждые 15 секунд
    const interval = setInterval(() => {
      startAnimation();
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(waveTimer);
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

        @keyframes santaBounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-6px);
          }
        }

        .santa-ride {
          animation: santaRide 15s linear infinite;
        }

        .santa-bounce {
          animation: santaBounce 0.7s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .santa-ride {
            animation-duration: 12s;
          }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
        aria-hidden="true"
      >
        {isVisible && (
          <div
            className={`absolute bottom-0 ${
              isMoving ? "santa-ride" : "santa-bounce"
            }`}
            style={{
              right: isMoving ? "-550px" : "42%",
              transition: isMoving
                ? "none"
                : "right 0.8s ease-in-out",
            }}
          >
            <div
              className="pointer-events-auto relative cursor-pointer"
              onClick={() => setShowMessage(!showMessage)}
            >
              {/* Дед Мороз — твоя MP4 анимация */}
              <video
                src="/santa.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-[450px] sm:w-[550px] drop-shadow-2xl"
              />

              {/* Сообщение при клике */}
              {showMessage && (
                <div
                  className="absolute bottom-full right-10 mb-4 w-64 rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-1 text-3xl">🎁</div>

                  <div className="text-lg font-bold text-gray-900">
                    Хо-хо-хо!
                  </div>

                  <div className="mt-1 text-sm text-gray-500">
                    Подарки уже близко 🎄
                  </div>

                  <button
                    onClick={() => setShowMessage(false)}
                    className="mt-3 rounded-full bg-black px-4 py-1.5 text-xs text-white transition hover:bg-gray-800"
                  >
                    Закрыть
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}