"use client";

import { motion } from "framer-motion";

interface SelectionCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}

export function SelectionCard({
  title,
  description,
  selected,
  onClick,
  multi = false
}: SelectionCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={[
        "group relative w-full rounded-3xl border p-5 text-left transition-all",
        selected
          ? "border-black bg-black text-white shadow-xl"
          : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400 hover:shadow-lg"
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div
          className={[
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            selected
              ? "border-white bg-white text-black"
              : "border-neutral-300"
          ].join(" ")}
        >
          {selected && (
            <span className="text-xs font-bold">
              {multi ? "✓" : "•"}
            </span>
          )}
        </div>

        <div>
          <div className="font-semibold">
            {title}
          </div>

          {description && (
            <div
              className={[
                "mt-1 text-sm leading-5",
                selected
                  ? "text-neutral-300"
                  : "text-neutral-500"
              ].join(" ")}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}