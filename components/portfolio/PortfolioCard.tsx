"use client";

import { useEffect, useState } from "react";

type PortfolioCardProps = {
  title: string;
  description: string;
  image?: string;
  action?: "order" | "details";
  detailsImages?: string[];
  video?: string;
};

export function PortfolioCard({
  title,
  description,
  image,
  action = "order",
  detailsImages = [],
  video,
}: PortfolioCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
  if (!isOpen) {
    return;
  }

  const scrollY = window.scrollY;
  const body = document.body;

  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.overflow = "hidden";

  return () => {
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.overflow = "";

    window.scrollTo(0, scrollY);
  };
}, [isOpen]);

  const slides = [
    ...(image
      ? [{ type: "image" as const, src: image }]
      : []),
    ...detailsImages.map((src) => ({
      type: "image" as const,
      src,
    })),
    ...(video
      ? [{ type: "video" as const, src: video }]
      : []),
  ];

  const openGallery = () => {
    if (slides.length === 0) return;

    setCurrentIndex(0);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const nextSlide = (event: React.MouseEvent) => {
    event.stopPropagation();

    setCurrentIndex((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const previousSlide = (event: React.MouseEvent) => {
    event.stopPropagation();

    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const whatsappMessage = encodeURIComponent(
    `Здравствуйте! Хочу заказать: ${title}. Подскажите, пожалуйста, стоимость и условия.`
  );

  const whatsappUrl =
    `https://wa.me/77783572157?text=${whatsappMessage}`;

  const currentSlide = slides[currentIndex];

  return (
    <>
      <article className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">

        {/* ОСНОВНОЕ ФОТО */}
        <button
          type="button"
          onClick={openGallery}
          className="block h-64 w-full overflow-hidden rounded-2xl bg-neutral-200"
        >
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full cursor-zoom-in object-cover transition duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-900 text-white">
              LOGOART
            </div>
          )}
        </button>

        {/* НАЗВАНИЕ */}
        <h3 className="mt-5 text-2xl font-bold">
          {title}
        </h3>

        {/* ОПИСАНИЕ */}
        <p className="mt-3 leading-7 text-neutral-500">
          {description}
        </p>

        {/* КНОПКА ТОЛЬКО ДЛЯ ПОДАРОЧНЫХ НАБОРОВ */}
        {action === "order" && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block w-full rounded-xl bg-[#25D366] px-5 py-3.5 text-center font-semibold text-white transition hover:bg-[#1ebe5d]"
          >
            Заказать в WhatsApp →
          </a>
        )}
      </article>

      {/* =========================
          ГАЛЕРЕЯ
      ========================= */}
      {isOpen && currentSlide && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-5"
          onClick={closeGallery}
        >
          {/* РАЗМЫТЫЙ ФОН */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl" />

          {/* ЗАКРЫТЬ */}
          <button
            type="button"
            onClick={closeGallery}
            aria-label="Закрыть"
            className="absolute right-6 top-4 z-30 text-5xl font-light text-black transition hover:opacity-50"
          >
            ×
          </button>

          {/* СТРЕЛКА ВЛЕВО */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Предыдущий проект"
              className="absolute left-5 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/10 text-4xl text-black backdrop-blur transition hover:bg-black/20"
            >
              ‹
            </button>
          )}

          {/* КОНТЕНТ */}
          <div
            className="relative z-10 flex max-h-[85vh] max-w-[85vw] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {currentSlide.type === "image" ? (
              <img
                src={currentSlide.src}
                alt={title}
                className="max-h-[76vh] max-w-[82vw] -translate-y-10 rounded-2xl object-contain shadow-2xl"
              />
            ) : (
              <video
                src={currentSlide.src}
                controls
                autoPlay
                className="max-h-[80vh] max-w-[82vw] rounded-2xl bg-black object-contain shadow-2xl"
              />
            )}
          </div>

          {/* СТРЕЛКА ВПРАВО */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Следующий проект"
              className="absolute right-5 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/10 text-4xl text-black backdrop-blur transition hover:bg-black/20"
            >
              ›
            </button>
          )}

          {/* СЧЁТЧИК */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/10 px-4 py-2 text-sm font-medium text-black backdrop-blur">
              {currentIndex + 1} / {slides.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}