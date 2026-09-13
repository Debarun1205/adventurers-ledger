"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export function LevelUpOverlay({
  newLevel,
  onDone,
}: {
  newLevel: number | null;
  onDone: () => void;
}) {
  useEffect(() => {
    if (newLevel === null) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [newLevel, onDone]);

  const particles = Array.from({ length: 14 });

  return (
    <AnimatePresence>
      {newLevel !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-live="polite"
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="relative quest-card rounded-xl px-10 py-8 text-center text-[var(--ink)]"
          >
            {particles.map((_, i) => {
              const angle = (i / particles.length) * Math.PI * 2;
              const dist = 90 + (i % 3) * 20;
              return (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                  style={{ background: "var(--accent-glow)" }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    opacity: 0,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              );
            })}
            <p className="text-xs tracking-wide text-[var(--accent-strong)] mb-1">
              LEVEL UP
            </p>
            <p className="font-display text-4xl">Level {newLevel}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
