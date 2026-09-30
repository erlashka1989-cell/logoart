"use client";

import { useState } from "react";

type PortfolioCardProps = {
  title: string;
  description: string;
  image?: string;
};

export function PortfolioCard({
  title,
  description,
  image,
}: PortfolioCardProps) {
  const [open, setOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Здравствуйте! Хочу заказать: ${title}. Подскажите, пожалуйста, стоимость и условия.`
  );

  const whatsappUrl = `https://wa.me/77783572157?text=${whatsappMessage}`;

  return (
    <>
      <article className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">

        {/* ФОТО */}
        <button
          type="button"
          onClick={() => image && setOpen(true)}
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
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 block w-full rounded-xl bg-[#25D366] px-5 py-3.5 text-center font-semibold text-white transition hover:bg-[#1ebe5d]"
        >
          Заказать в WhatsApp →
        </a>
      </article>

      {/* УВЕЛИЧЕННОЕ ФОТО */}
      {open && image && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-5">
          {/* ФОН */}
          <button
            type="button"
            aria-label="Закрыть изображение"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-white/90 backdrop-blur-2xl"
          />

          {/* ФОТО */}
          <div className="relative z-10">
            <img
              src={image}
              alt={title}
              className="max-h-[78vh] max-w-[82vw] -translate-y-8 rounded-2xl object-contain shadow-2xl"
            />
          </div>

          {/* КРЕСТИК */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
            className="absolute right-6 top-4 z-20 text-5xl font-light text-black transition hover:opacity-50"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}