import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Album AI — LogoART",
  description: "AI-конструктор свадебного фотоальбома LogoART."
};

export default function AlbumLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
