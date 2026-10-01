"use client";

export function MobileMenu() {
  const closeMenu = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const details = event.currentTarget.closest("details");

    if (details) {
      details.removeAttribute("open");
    }
  };

  return (
    <details className="relative lg:hidden">
      <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-neutral-200 bg-white text-xl">
        ☰
      </summary>

      <div className="absolute right-0 top-14 z-[100] w-[calc(100vw-32px)] max-w-72 rounded-2xl border border-neutral-200 bg-white p-3 shadow-2xl">
        <nav className="flex flex-col">
          <a
            href="#constructor"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 font-medium transition hover:bg-neutral-100"
          >
            Подобрать
          </a>

          <a
            href="#giftsets"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 font-medium transition hover:bg-neutral-100"
          >
            Подарочные наборы
          </a>

          <a
            href="#portfolio"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 font-medium transition hover:bg-neutral-100"
          >
            Портфолио
          </a>

          <a
            href="#services"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 font-medium transition hover:bg-neutral-100"
          >
            Услуги
          </a>

          <a
            href="#contacts"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 font-medium transition hover:bg-neutral-100"
          >
            Контакты
          </a>

          <a
            href="#constructor"
            onClick={closeMenu}
            className="mt-2 rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
          >
            Получить подбор
          </a>
        </nav>
      </div>
    </details>
  );
}