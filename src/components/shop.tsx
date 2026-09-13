"use client";

import { useEffect, useState } from "react";
import type { Character, ShopItem } from "@/lib/types";

export function Shop({
  character,
  onBought,
  onEquipped,
}: {
  character: Character;
  onBought: (character: Character) => void;
  onEquipped: (character: Character) => void;
}) {
  const [items, setItems] = useState<ShopItem[] | null>(null);
  const [ownedIds, setOwnedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/shop")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items);
        setOwnedIds(data.ownedIds);
      });
  }, []);

  async function buy(item: ShopItem) {
    setError(null);
    setBusyId(item.id);
    const res = await fetch("/api/shop/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id }),
    });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(data.error ?? "Couldn't complete that purchase.");
      return;
    }
    setOwnedIds((prev) => [...prev, item.id]);
    onBought(data.character);
  }

  async function equip(item: ShopItem) {
    setError(null);
    setBusyId(item.id);
    const res = await fetch("/api/shop/equip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id }),
    });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(data.error ?? "Couldn't equip that item.");
      return;
    }
    onEquipped(data.character);
  }

  if (!items) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading shop">
        {[0, 1, 2].map((i) => (
          <div key={i} className="quest-card h-16 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-[var(--parchment)]">The Shop</h2>
        <p className="text-sm text-[var(--parchment-edge)]">
          <span aria-hidden>🪙</span> {character.gold} gold
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-[var(--danger)] mb-3">
          {error}
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const owned = ownedIds.includes(item.id);
          const equipped =
            (item.kind === "theme" && character.equippedTheme === item.id) ||
            (item.kind === "badge" && character.equippedBadge === item.id);
          return (
            <li key={item.id} className="quest-card rounded-lg p-4 text-[var(--ink)]">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-sm">{item.name}</p>
                <span className="text-xs uppercase tracking-wide text-[var(--ink-soft)]">
                  {item.kind}
                </span>
              </div>
              <p className="text-xs text-[var(--ink-soft)] mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">{item.cost === 0 ? "Free" : `🪙 ${item.cost}`}</span>
                {owned ? (
                  <button
                    onClick={() => equip(item)}
                    disabled={equipped || busyId === item.id}
                    className="text-xs rounded-md border border-[var(--accent-strong)] px-3 py-1.5 disabled:opacity-50"
                  >
                    {equipped ? "Equipped" : "Equip"}
                  </button>
                ) : (
                  <button
                    onClick={() => buy(item)}
                    disabled={busyId === item.id || character.gold < item.cost}
                    className="text-xs rounded-md bg-[var(--accent)] text-[#1c140b] px-3 py-1.5 disabled:opacity-50"
                  >
                    {busyId === item.id ? "…" : "Buy"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
