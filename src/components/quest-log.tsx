"use client";

import { useEffect, useState } from "react";
import { ATTRIBUTE_META } from "@/lib/rpg";
import type { Attribute, Difficulty } from "@/lib/rpg";

interface CompletionRow {
  id: string;
  title: string;
  attribute: Attribute;
  difficulty: Difficulty;
  xpAwarded: number;
  goldAwarded: number;
  completedOn: string;
}

export function QuestLog() {
  const [rows, setRows] = useState<CompletionRow[] | null>(null);

  useEffect(() => {
    fetch("/api/completions")
      .then((r) => r.json())
      .then((data) => setRows(data.completions));
  }, []);

  if (!rows) {
    return (
      <div aria-busy="true" aria-label="Loading quest log" className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="quest-card h-10 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-[var(--parchment-edge)]">
        No quests completed yet. Your history will be recorded here forever.
      </p>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl text-[var(--parchment)] mb-4">Quest Log</h2>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className="quest-card rounded-lg px-4 py-2.5 flex items-center justify-between text-[var(--ink)] text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{row.title}</p>
              <p className="text-xs text-[var(--ink-soft)]">
                <span aria-hidden>{ATTRIBUTE_META[row.attribute].icon}</span>{" "}
                {ATTRIBUTE_META[row.attribute].label} · {row.completedOn}
              </p>
            </div>
            <span className="text-xs text-[var(--accent-strong)] whitespace-nowrap ml-3">
              +{row.xpAwarded} XP / +{row.goldAwarded}g
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
