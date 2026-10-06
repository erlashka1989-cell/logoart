"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Photo = { name: string; path: string; url: string; size?: number };
type BridgeStatus = { connected: boolean; folder: string; corel: boolean };
type Layout = { id: number; name: string; slots: { x:number;y:number;w:number;h:number }[] };
type AiSpread = { layoutId: number; photos: string[] };
type AiPlan = { spreads: AiSpread[] };

const BRIDGE = "http://127.0.0.1:17321";

export default function WeddingAlbumPage() {
  const [status, setStatus] = useState<BridgeStatus>({ connected: false, folder: "", corel: false });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("Подключите LogoART Album Bridge.");
  const [plan, setPlan] = useState<AiPlan | null>(null);

  const scan = useCallback(async () => {
    setLoading(true);
    setMessage("Сканирую папку фотографий…");
    try {
      const [health, photoResponse, layoutResponse] = await Promise.all([
        fetch(BRIDGE + "/health", { cache: "no-store" }),
        fetch(BRIDGE + "/photos", { cache: "no-store" }),
        fetch(BRIDGE + "/layouts", { cache: "no-store" })
      ]);
      if (!health.ok || !photoResponse.ok || !layoutResponse.ok) throw new Error("Bridge offline");
      const info = await health.json();
      const data = await photoResponse.json();
      const layoutData = await layoutResponse.json();
      setStatus(info);
      setPhotos(data.photos ?? []);
      setLayouts(layoutData.layouts ?? []);
      setMessage("Найдено фотографий: " + (data.photos?.length ?? 0));
    } catch {
      setStatus({ connected: false, folder: "", corel: false });
      setMessage("Bridge не запущен. Запустите LogoART Album Bridge на этом ПК.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void scan(); }, [scan]);

  const photoByName = useMemo(() => new Map(photos.map((p) => [p.name, p])), [photos]);

  async function buildAiPlan() {
    setLoading(true);
    setMessage("AI анализирует фотографии и собирает 10 разворотов…");
    try {
      const response = await fetch(BRIDGE + "/ai-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI plan failed");
      setPlan(data.plan);
      setMessage("AI-план готов. Проверьте 10 разворотов.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ошибка AI");
    } finally { setLoading(false); }
  }

  async function createAlbum() {
    if (!plan) return;
    setCreating(true);
    setMessage("Передаю готовый план в CorelDRAW…");
    try {
      const spreads = plan.spreads.map((spread) => {
        const layout = layouts.find((x) => x.id === spread.layoutId);
        if (!layout) throw new Error("Не найден layout " + spread.layoutId);
        if (spread.photos.length !== layout.slots.length) {
          throw new Error("Layout " + spread.layoutId + " требует " + layout.slots.length + " фото.");
        }
        return {
          slots: layout.slots.map((slot, i) => ({
            ...slot,
            photoPath: photoByName.get(spread.photos[i])?.path
          }))
        };
      });
      if (spreads.length !== 10) throw new Error("Нужно ровно 10 разворотов.");
      const response = await fetch(BRIDGE + "/create-album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          output: "C:\\Users\\Public\\Desktop\\Wedding_Album_AI.cdr",
          spreads
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "CorelDRAW error");
      setMessage("Готово: CorelDRAW начал создание Wedding_Album_AI.cdr");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ошибка создания альбома");
    } finally { setCreating(false); }
  }

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
              <button onClick={() => void scan()} disabled={loading || creating} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50">
                {loading ? "Работаю…" : "Обновить"}
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
            AI выберет сильные кадры, соберёт 10 разных композиций 600×300 мм и передаст их в CorelDRAW.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => void buildAiPlan()} disabled={!photos.length || loading || creating} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-40">
              {loading ? "AI анализирует…" : "Создать AI-план"}
            </button>
            <button onClick={() => void createAlbum()} disabled={!plan || loading || creating} className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-black disabled:opacity-40">
              {creating ? "Создаю CDR…" : "Создать альбом в CorelDRAW"}
            </button>
          </div>
        </section>

        {plan && (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">План альбома</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {plan.spreads.map((spread, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Разворот {index + 1}</span>
                    <span className="text-xs text-white/40">Layout {spread.layoutId}</span>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-white/60">
                    {spread.photos.map((name) => <div key={name} className="truncate">{name}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
