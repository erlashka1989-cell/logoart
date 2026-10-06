"use client";

import { useCallback, useEffect, useState } from "react";

type Photo = { name: string; path: string; url: string; width?: number; height?: number; size?: number };
type BridgeStatus = { connected: boolean; folder: string; corel: boolean };
const BRIDGE = "http://127.0.0.1:17321";

export default function WeddingAlbumPage() {
  const [status, setStatus] = useState<BridgeStatus>({ connected: false, folder: "", corel: false });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Подключите LogoART Album Bridge.");

  const scan = useCallback(async () => {
    setLoading(true);
    setMessage("Сканирую папку фотографий…");
    try {
      const health = await fetch(BRIDGE + "/health", { cache: "no-store" });
      if (!health.ok) throw new Error("Bridge offline");
      const info = await health.json();
      setStatus(info);
      const response = await fetch(BRIDGE + "/photos", { cache: "no-store" });
      if (!response.ok) throw new Error("Не удалось получить фотографии");
      const data = await response.json();
      setPhotos(data.photos ?? []);
      setMessage("Найдено фотографий: " + (data.photos?.length ?? 0));
    } catch {
      setStatus({ connected: false, folder: "", corel: false });
      setMessage("Bridge не запущен. Запустите LogoART Album Bridge на этом ПК.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void scan(); }, [scan]);

  return (
    <main className="min-h-screen bg-[#111] text-white">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">LogoART AI</div>
            <h1 className="mt-1 text-2xl font-bold">Wedding Album</h1>
          </div>
          <a href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/10">LogoART</a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Фотографии</h2>
              <p className="mt-2 text-sm text-white/50">{status.folder || "Локальная папка свадьбы"}</p>
              <p className="mt-1 text-sm text-white/60">{message}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={status.connected ? "rounded-full bg-emerald-400/15 px-3 py-2 text-xs text-emerald-300" : "rounded-full bg-red-400/15 px-3 py-2 text-xs text-red-300"}>
                {status.connected ? "Bridge подключён" : "Bridge не подключён"}
              </span>
              <span className={status.corel ? "rounded-full bg-blue-400/15 px-3 py-2 text-xs text-blue-300" : "rounded-full bg-white/10 px-3 py-2 text-xs text-white/40"}>
                CorelDRAW {status.corel ? "готов" : "не запущен"}
              </span>
              <button onClick={() => void scan()} disabled={loading} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50">
                {loading ? "Сканирование…" : "Обновить"}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {photos.map((photo) => (
            <div key={photo.path} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <div className="aspect-square overflow-hidden bg-black">
                <img src={photo.url} alt={photo.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="truncate px-3 py-2 text-xs text-white/60">{photo.name}</div>
            </div>
          ))}
        </section>

        {photos.length === 0 && !loading && (
          <div className="mt-8 rounded-3xl border border-dashed border-white/15 py-20 text-center text-white/40">
            Здесь появятся фотографии из свадебной папки.
          </div>
        )}

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-semibold">AI-конструктор</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
            AI отберёт лучшие кадры, распределит их по 10 разным разворотам 600×300 мм,
            сохранит пропорции и передаст готовый план локальному Bridge для создания документа в CorelDRAW.
          </p>
          <button disabled className="mt-5 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white/30">
            Создать 10 разворотов — подключаем AI
          </button>
        </section>
      </div>
    </main>
  );
}
