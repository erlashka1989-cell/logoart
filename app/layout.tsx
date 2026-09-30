import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "LogoART — корпоративные подарки и сувениры",
  description:
    "Премиальные корпоративные подарки, статуэтки, награды, мерч и индивидуальное производство LogoART.",
  keywords: [
    "корпоративные подарки",
    "сувениры",
    "статуэтки",
    "награды",
    "мерч",
    "LogoART",
    "Астана",
    "Казахстан"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}