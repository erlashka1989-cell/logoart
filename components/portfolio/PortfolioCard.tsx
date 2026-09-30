"use client";

import { useState } from "react";

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
  const [openImage, setOpenImage] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Здравствуйте! Хочу заказать: ${title}. Подскажите, пожалуйста, стоимость и условия.`
  );

  const whatsappUrl =
    `https://wa.me/77783572157?text=${whatsappMessage}`;

  return (
    <>
      <article className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
        {/* ОСНОВНОЕ ФОТО */}
        <button
          type="button"
          onClick={() => image && setOpenImage(true)}
          className="block h-64 w-full overflow-hidden rounded-2xl bg-neutral-200"
        >
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full cursor-zoom-in object-cover"
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

        {/* КНОПКА */}
        {action === "details" ? (
          <button
            type="button"
            onClick={() => setOpenDetails(true)}
            className="mt-5 w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-neutral-800"
          >
            Подробнее →
          </button>
        ) : (
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

      {/* ===================================
          УВЕЛИЧЕНИЕ ОСНОВНОГО ФОТО
      =================================== */}
      {openImage && image && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-5"
          onClick={() => setOpenImage(false)}
        >
          {/* ФОН */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl" />

          {/* КРЕСТИК */}
          <button
            type="button"
            onClick={() => setOpenImage(false)}
            className="absolute right-6 top-4 z-20 text-5xl font-light text-black transition hover:opacity-50"
            aria-label="Закрыть"
          >
            ×
          </button>

          {/* ФОТО */}
          <img
            src={image}
            alt={title}
            onClick={(event) => event.stopPropagation()}
            className="relative z-10 max-h-[78vh] max-w-[82vw] -translate-y-8 rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* ===================================
          ПОДРОБНОСТИ ПОРТФОЛИО
      =================================== */}
      {openDetails && (
        <div className="fixed inset-0 z-[100000]">
          {/* ФОН — НАЖАТИЕ ЗАКРЫВАЕТ */}
          <button
            type="button"
            aria-label="Закрыть подробности"
            onClick={() => setOpenDetails(false)}
            className="absolute inset-0 h-full w-full bg-white/95 backdrop-blur-2xl"
          />

          {/* КОНТЕНТ */}
          <div className="relative z-10 h-full overflow-y-auto">
            <div className="mx-auto max-w-6xl px-5 py-10">
              {/* ВЕРХ */}
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    LOGOART PORTFOLIO
                  </div>

                  <h2 className="mt-2 text-4xl font-bold md:text-5xl">
                    {title}
                  </h2>

                  <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-500">
                    {description}
                  </p>
                </div>

                {/* КРЕСТИК */}
                <button
                  type="button"
                  onClick={() => setOpenDetails(false)}
                  className="shrink-0 text-5xl font-light text-black transition hover:opacity-50"
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>

              {/* ДОПОЛНИТЕЛЬНЫЕ ФОТО */}
              {(image || detailsImages.length > 0) && (
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {image && (
                    <img
                      src={image}
                      alt={title}
                      className="h-72 w-full rounded-2xl object-cover"
                    />
                  )}

                  {detailsImages.map((photo, index) => (
                    <img
                      key={`${photo}-${index}`}
                      src={photo}
                      alt={`${title} ${index + 2}`}
                      className="h-72 w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              )}

              {/* ВИДЕО */}
              {video && (
                <div className="mt-10 pb-16">
                  <div className="mb-4 text-2xl font-bold">
                    Видео
                  </div>

                  <video
                    src={video}
                    controls
                    className="w-full max-h-[650px] rounded-2xl bg-black object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}