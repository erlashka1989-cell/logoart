import { GiftConstructor } from "@/components/constructor/GiftConstructor";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { MobileMenu } from "@/components/MobileMenu";
import { WinterEffects } from "@/components/WinterEffects";

export default function HomePage() {
  return (
    <main
      id="top"
      className="min-h-screen overflow-x-hidden bg-[#f7f7f5] text-neutral-950"
    >
      <WinterEffects />
      {/* =========================
          HEADER
      ========================= */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-5">

          {/* LOGO */}
          <a
            href="#top"
            className="flex shrink-0 items-center"
          >
            <img
              src="/images/Logo.png"
              alt="LogoART"
              className="h-20 w-auto object-contain sm:h-14"
            />
          </a>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex xl:gap-8">
            <a
              href="#constructor"
              className="transition hover:text-neutral-500"
            >
              Подобрать
            </a>

            <a
              href="#giftsets"
              className="transition hover:text-neutral-500"
            >
              Подарочные наборы
            </a>

            <a
              href="#portfolio"
              className="transition hover:text-neutral-500"
            >
              Портфолио
            </a>

            <a
              href="#services"
              className="transition hover:text-neutral-500"
            >
              Услуги
            </a>

            <a
              href="#contacts"
              className="transition hover:text-neutral-500"
            >
              Контакты
            </a>
          </nav>

          {/* DESKTOP BUTTON */}
          <a
            href="#constructor"
            className="hidden rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 lg:block"
          >
            Получить подбор
          </a>

          {/* MOBILE MENU */}
          <MobileMenu />
        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}
      <section
        className="relative min-h-[560px] overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
  backgroundImage: 'url("/images/background.jpg")',
}}
      >
        <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-16 sm:py-20 md:-translate-y-10 md:px-5 lg:-translate-y-15">
          <div className="relative top-16 max-w-4xl text-white">

            <div className="relative top-8 mb-8 inline-flex max-w-full rounded-full border border-white/30 bg-black/20 px-4 py-2 text-center text-xs text-white/90 backdrop-blur sm:mb-6 sm:text-sm">
            Премиальные сувениры · Дизайн · Производство · Брендирование
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)] md:text-7xl">
              Корпоративные подарки,
              <br className="hidden sm:block" />
              которые запоминаются.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8 md:text-xl">
              Разрабатываем и производим премиальные
              сувениры, награды, корпоративные подарки
              и брендированные решения под задачу бизнеса.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#constructor"
                className="rounded-xl bg-white px-6 py-3.5 text-center font-semibold text-black transition hover:bg-neutral-200 sm:px-7 sm:py-4"
              >
                Подобрать подарок →
              </a>

              <a
                href="#portfolio"
                className="rounded-xl border border-white/40 bg-black/20 px-6 py-3.5 text-center font-semibold text-white backdrop-blur transition hover:bg-white/10 sm:px-7 sm:py-4"
              >
                Смотреть проекты
              </a>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-5 border-t border-white/20 pt-6 sm:gap-6 sm:pt-7 md:max-w-2xl md:grid-cols-4">
              
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          ПОДАРОЧНЫЕ НАБОРЫ
      ========================= */}
      <section
        id="giftsets"
        className="scroll-mt-20 border-t border-neutral-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-24">

          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 sm:text-sm">
              LOGOART ПОДАРОЧНЫЕ НАБОРЫ
            </div>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              ГОТОВЫЕ НАБОРЫ
            </h2>

            <p className="mt-3 text-base leading-7 text-neutral-500 sm:text-lg sm:leading-8">
              Выберите готовый вариант — мы адаптируем его под ваш бренд,
              цвет и тираж.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            <PortfolioCard
              title="Подарочный набор №1"
              image="/images/gift1.jpg"
              description="за 1 шт. в корпоративном тираже · базовое брендирование включено."
            />

            <PortfolioCard
              title="Подарочный набор №2"
              image="/images/gift2.jpg"
              description="за 1 шт. в корпоративном тираже · базовое брендирование включено."
            />

            <PortfolioCard
              title="Подарочный набор №3"
              image="/images/gift3.jpg"
              description="за 1 шт. в корпоративном тираже · базовое брендирование включено."
            />

            <PortfolioCard
              title="Подарочный набор №4"
              image="/images/gift4.jpg"
              description="за 1 шт. в корпоративном тираже · базовое брендирование включено."
            />

            <PortfolioCard
              title="Подарочный набор №5"
              image="/images/gift5.jpg"
              description="за 1 шт. в корпоративном тираже · базовое брендирование включено."
            />

            <PortfolioCard
              title="Подарочный набор №6"
              image="/images/gift6.jpg"
              description="за 1 шт. в корпоративном тираже · базовое брендирование включено."
            />

            <PortfolioCard
              title="Подарочный набор №7"
              image="/images/gift7.jpg"
              description="за 1 шт. в корпоративном тираже · базовое брендирование включено."
            />

            <PortfolioCard
              title="Подарочный набор №8"
              image="/images/gift8.jpg"
              description="за 1 шт. в корпоративном тираже · базовое брендирование включено."
            />

            <PortfolioCard
              title="Подарочный набор №9"
              image="/images/gift9.jpg"
              description="за 1 шт. в корпоративном тираже · базовое брендирование включено."
            />
          </div>

        </div>
      </section>

      {/* =========================
          CONSTRUCTOR
      ========================= */}
      <GiftConstructor />

      {/* =========================
          PORTFOLIO
      ========================= */}
      <section
        id="portfolio"
        className="scroll-mt-20 border-t border-neutral-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-24">

          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 sm:text-sm">
              LOGOART PORTFOLIO
            </div>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
              Производим не просто сувениры.
            </h2>

            <p className="mt-3 text-base leading-7 text-neutral-500 sm:text-lg sm:leading-8">
              Статуэтки, награды, подарочные наборы,
              корпоративный мерч, упаковка и
              индивидуальные изделия.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">

            {/* СТАТУЭТКИ */}
            <PortfolioCard
              title="Статуэтки"
              image="/images/portfolio1.jpg"
              detailsImages={[
                "/images/portfolio1-2.jpg",
                "/images/portfolio1-3.jpg",
                "/images/portfolio1-4.jpg",
              ]}
              video="/images/portfolio1.mp4"
              action="details"
              description="Индивидуальные награды и премиальные корпоративные изделия."
            />

            {/* НАГРАДЫ */}
            <PortfolioCard
              title="НАГРАДЫ С 3D ГРАВИРОВКОЙ"
              image="/images/portfolio2.jpg"
              detailsImages={[
                "/images/portfolio2-2.jpg",
                "/images/portfolio2-3.jpg",
                "/images/portfolio2-4.jpg",
                "/images/portfolio2-5.jpg",
                "/images/portfolio2-6.jpg",
              ]}
              video="/images/portfolio2.mp4"
              action="details"
              description="Подарочные наборы для сотрудников, клиентов и партнёров."
            />

            {/* ПЛАКЕТКИ */}
            <PortfolioCard
              title="ПЛАКЕТКИ"
              image="/images/portfolio3.jpg"
              detailsImages={[
                "/images/portfolio3-2.jpg",
                "/images/portfolio3-3.jpg",
              ]}
              action="details"
              description="UV-печать, лазер, металл, акрил, дерево и другие технологии."
            />

          </div>
        </div>
      </section>

      {/* =========================
          SERVICES
      ========================= */}
      <section
  id="services"
  className="scroll-mt-20 bg-cover bg-center bg-fixed"
  style={{
    backgroundImage:
      'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url("/images/background2.jpg")',
  }}
>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-24">

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 md:translate-y-5">

            <ServiceCard
              number="01"
              title="Дизайн"
              image="/images/service1.jpg"
              text="Создаём концепцию, визуализацию и индивидуальный дизайн изделия."
            />

            <ServiceCard
              number="02"
              title="Производство"
              image="/images/service2.jpg"
              text="Организуем изготовление, брендирование, комплектацию и контроль качества."
            />

            <ServiceCard
              number="03"
              title="Под ключ"
              image="/images/service3.jpg"
              text="Берём на себя согласование, упаковку, документы и доставку."
            />

          </div>
        </div>
      </section>

      {/* =========================
          CONTACTS
      ========================= */}
      <footer
        id="contacts"
        className="scroll-mt-20 bg-black text-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-16">

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:items-start">

            {/* LOGOART */}
            <div>
              <div className="text-3xl font-black">
                LOGOART
              </div>

              <p className="mt-4 max-w-md text-neutral-400">
                Премиальные сувениры, корпоративные
                подарки и индивидуальное производство.
              </p>
            </div>

            {/* КАРТА 2ГИС */}
            <div>
              <div className="text-sm uppercase tracking-widest text-neutral-500">
                Мы на карте
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-800">
                <iframe
                  src="/2gis-map.html"
                  title="LogoART на карте 2ГИС"
                  className="h-[220px] w-full border-0 sm:h-[260px]"
                  loading="lazy"
                />
              </div>

              <a
                href="https://2gis.kz/nur_sultan/firm/70000001104791408"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-neutral-400 underline underline-offset-4 transition hover:text-white"
              >
                Открыть в 2ГИС →
              </a>
            </div>

            {/* АДРЕС */}
            <div>
              <div className="text-sm uppercase tracking-widest text-neutral-500">
                Адрес
              </div>

              <div className="mt-2 text-neutral-400">
                Астана · Казахстан
              </div>

              <div className="mt-2 text-neutral-400">
                ул. Альмукана Сембинова 13/1
              </div>

              <div className="mt-2 text-neutral-400">
                БЦ "INDUSTRIAL"
              </div>
            </div>

          </div>

          <div className="mt-14 border-t border-neutral-800 pt-6 text-sm text-neutral-500 sm:mt-16">
            © {new Date().getFullYear()} LogoART. Все права защищены.
          </div>

        </div>
      </footer>

      {/* =========================
          FLOATING ACTIONS
      ========================= */}
      <div className="fixed bottom-4 right-4 z-[99999] flex flex-col items-center gap-1 sm:bottom-8 sm:right-6">

        {/* СТРЕЛКА НАВЕРХ */}
        <a
          href="#top"
          aria-label="Вернуться наверх"
          className="flex h-12 w-12 items-center justify-center pb-1 text-[#25D366] transition-transform duration-200 hover:-translate-y-1 sm:h-16 sm:w-16"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="78"
            viewBox="0 0 24 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 sm:h-12 sm:w-12"
          >
            <path d="M12 25V5" />
            <path d="M6 11l6-6 6 6" />
          </svg>
        </a>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/77783572157"
          target="_blank"
          rel="noreferrer"
          aria-label="Написать в WhatsApp"
          className="whatsapp-float relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-110 sm:h-16 sm:w-16"
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <path
              d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.56 1.74 6.55L3 29l6.68-1.7A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Z"
              fill="white"
            />

            <path
              d="M22.2 18.8c-.34-.17-2.02-1-2.33-1.12-.31-.12-.54-.17-.77.17-.23.34-.88 1.12-1.08 1.35-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.68-1.01-.9-1.69-2-1.88-2.34-.2-.34-.02-.52.15-.69.15-.15.34-.4.5-.6.17-.2.22-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.77-1.86-1.06-2.55-.28-.67-.57-.58-.77-.59h-.66c-.23 0-.6.08-.91.43-.31.34-1.2 1.17-1.2 2.84s1.23 3.3 1.4 3.53c.17.23 2.4 3.66 5.82 5.13.81.35 1.44.56 2.12.13.65-.1 2.02-.83 2.3-1.64.28-.81.28-1.5.2-1.64-.08-.14-.31-.22-.65-.39Z"
              fill="#25D366"
            />
          </svg>

          <span className="whatsapp-pulse"></span>
        </a>

      </div>
    </main>
  );
}


/* =========================
   STAT
========================= */

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="font-bold text-white">
        {value}
      </div>

      <div className="mt-1 text-xs leading-5 text-white/60">
        {label}
      </div>
    </div>
  );
}


/* =========================
   SERVICE CARD
========================= */

function ServiceCard({
  number,
  title,
  text,
  image,
}: {
  number: string;
  title: string;
  text: string;
  image?: string;
}) {
  return (
    <article>
      {/* ИКОНКА */}
      {image && (
        <img
          src={image}
          alt={title}
          className="mb-5 h-32 w-32 rounded-2xl object-cover sm:h-40 sm:w-40"
        />
      )}

      {/* НОМЕР */}
      <div className="text-sm font-semibold text-neutral-400">
        {number}
      </div>

      {/* ЗАГОЛОВОК */}
      <h3 className="mt-4 text-2xl font-bold">
        {title}
      </h3>

      {/* ОПИСАНИЕ */}
      <p className="mt-3 leading-7 text-neutral-500">
        {text}
      </p>
    </article>
  );
}