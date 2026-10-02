"use client";

import { useEffect, useState } from "react";

export default function SantaAnimation() {
  const [showMessage, setShowMessage] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const startAnimation = () => {
      setIsMoving(true);

      // Через 7 секунд Дед Мороз останавливается и машет
      setTimeout(() => {
        setIsMoving(false);
        setIsWaving(true);

        // Машет 2.5 секунды
        setTimeout(() => {
          setIsWaving(false);
          setIsMoving(true);
        }, 2500);
      }, 7000);
    };

    // Первый запуск
    startAnimation();

    // Повтор каждые 15 секунд
    const interval = setInterval(() => {
      startAnimation();
    }, 15000);

    return () => clearInterval(interval);
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
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }

        @keyframes santaWave {
          0%,
          100% {
            transform: rotate(0deg);
          }

          25% {
            transform: rotate(-8deg);
          }

          50% {
            transform: rotate(8deg);
          }

          75% {
            transform: rotate(-8deg);
          }
        }

        @keyframes snowFall {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          100% {
            transform: translateY(80px);
            opacity: 0;
          }
        }

        .santa-ride {
          animation: santaRide 15s linear infinite;
        }

        .santa-bounce {
          animation: santaBounce 0.7s ease-in-out infinite;
        }

        .santa-wave {
          animation: santaWave 0.5s ease-in-out infinite;
        }

        .snow {
          animation: snowFall 2s linear infinite;
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
        <div
          className={`absolute bottom-6 ${
            isMoving ? "santa-ride" : ""
          }`}
          style={{
            right: isMoving ? "-220px" : "42%",
            transition: isMoving
              ? "none"
              : "right 0.8s ease-in-out",
          }}
        >
          <div
            className={`relative pointer-events-auto cursor-pointer ${
              !isMoving ? "santa-bounce" : ""
            }`}
            onClick={() => setShowMessage(!showMessage)}
          >
            {/* Снег */}
            <div className="absolute -top-8 left-1/2 text-xl opacity-80">
              <span className="snow absolute left-0">❄️</span>
              <span
                className="snow absolute left-10"
                style={{ animationDelay: "0.5s" }}
              >
                ❄️
              </span>
              <span
                className="snow absolute left-20"
                style={{ animationDelay: "1s" }}
              >
                ❄️
              </span>
            </div>

            {/* Дед Мороз */}
            <div className="relative flex items-end gap-1">

              {/* Рука */}
              <div
                className={`text-4xl ${
                  isWaving ? "santa-wave origin-bottom" : ""
                }`}
              >
                👋
              </div>

              {/* Сам Дед Мороз */}
              <div className="relative text-[80px] leading-none drop-shadow-2xl sm:text-[100px]">
                🎅
              </div>

              {/* Подарок */}
              <div className="text-4xl drop-shadow-lg">
                🎁
              </div>
            </div>

            {/* Облачко сообщения */}
            {showMessage && (
              <div
                className="absolute bottom-full right-0 mb-4 w-64 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-2xl"
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
      </div>
    </>
  );
}