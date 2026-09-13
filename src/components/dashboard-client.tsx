"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { CharacterPanel } from "@/components/character-panel";
import { NewQuestForm } from "@/components/new-quest-form";
import { QuestCard } from "@/components/quest-card";
import { Shop } from "@/components/shop";
import { QuestLog } from "@/components/quest-log";
import { LevelUpOverlay } from "@/components/level-up-overlay";
import type { Character, Task } from "@/lib/types";
import type { Attribute, Difficulty } from "@/lib/rpg";

type Tab = "quests" | "shop" | "log";

export function DashboardClient({ displayName }: { displayName: string }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [tab, setTab] = useState<Tab>("quests");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setTasks(data.tasks);
      setCharacter(data.character);
    } catch {
      setLoadError(
        "Couldn't reach the ledger — check your connection and try again."
      );
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
  }, [load]);

  async function createQuest(input: {
    title: string;
    attribute: Attribute;
    difficulty: Difficulty;
  }) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create quest");
    const data = await res.json();
    setTasks((prev) => (prev ? [data.task, ...prev] : [data.task]));
  }

  async function completeQuest(id: string) {
    setBusyId(id);
    // Optimistic UI: mark done immediately, reconcile with server response after.
    setTasks((prev) =>
      prev ? prev.map((t) => (t.id === id ? { ...t, isDone: true } : t)) : prev
    );
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Roll back on failure.
        setTasks((prev) =>
          prev ? prev.map((t) => (t.id === id ? { ...t, isDone: false } : t)) : prev
        );
        setLoadError(data.error ?? "Couldn't complete that quest.");
        return;
      }
      setCharacter(data.character);
      setTasks((prev) => (prev ? prev.map((t) => (t.id === id ? data.task : t)) : prev));
      if (data.didLevelUp) {
        setNewLevel(data.character.level);
      }
    } catch {
      setTasks((prev) =>
        prev ? prev.map((t) => (t.id === id ? { ...t, isDone: false } : t)) : prev
      );
      setLoadError("Connection dropped before the quest could be logged. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteQuest(id: string) {
    const prevTasks = tasks;
    setTasks((prev) => (prev ? prev.filter((t) => t.id !== id) : prev));
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setTasks(prevTasks ?? null);
      setLoadError("Couldn't remove that quest.");
    }
  }

  const theme = character?.equippedTheme ?? "tavern";
  const activeTasks = tasks?.filter((t) => !t.isDone) ?? [];
  const doneTasks = tasks?.filter((t) => t.isDone) ?? [];

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg-deep)]">
      <LevelUpOverlay newLevel={newLevel} onDone={() => setNewLevel(null)} />

      <header className="px-6 pt-6 flex items-baseline justify-between max-w-5xl mx-auto w-full">
        <p className="font-display text-lg text-[var(--parchment)]">
          Adventurer&apos;s Ledger
        </p>
        <p className="text-xs text-[var(--parchment-edge)]">
          Welcome back, {character?.displayName ?? displayName}
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {loadError && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-[var(--danger)] bg-black/20 px-4 py-3 text-sm text-[var(--parchment)] flex items-center justify-between gap-4"
          >
            <span>{loadError}</span>
            <button onClick={load} className="underline shrink-0">
              Retry
            </button>
          </div>
        )}

        {!character || !tasks ? (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="quest-card h-64 rounded-lg animate-pulse" />
            <div className="space-y-3">
              <div className="quest-card h-14 rounded-lg animate-pulse" />
              <div className="quest-card h-14 rounded-lg animate-pulse" />
              <div className="quest-card h-14 rounded-lg animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <CharacterPanel character={character} />

            <div>
              <div
                role="tablist"
                aria-label="Dashboard sections"
                className="flex gap-1 mb-5 border-b border-[var(--parchment-edge)]/30"
              >
                {(["quests", "shop", "log"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    id={`tab-${t}`}
                    role="tab"
                    aria-selected={tab === t}
                    aria-controls={`panel-${t}`}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2 text-sm capitalize rounded-t-md ${
                      tab === t
                        ? "bg-[var(--parchment-card)] text-[var(--ink)] font-medium"
                        : "text-[var(--parchment-edge)] hover:text-[var(--parchment)]"
                    }`}
                  >
                    {t === "quests" ? `Quests (${activeTasks.length})` : t}
                  </button>
                ))}
              </div>

              {tab === "quests" && (
                <div
                  className="space-y-4"
                  id="panel-quests"
                  role="tabpanel"
                  aria-labelledby="tab-quests"
                >
                  <NewQuestForm onCreate={createQuest} />

                  {activeTasks.length === 0 && (
                    <p className="text-sm text-[var(--parchment-edge)] px-1">
                      The board is empty. Post your first quest above.
                    </p>
                  )}

                  <ul className="space-y-2">
                    <AnimatePresence initial={false}>
                      {activeTasks.map((t) => (
                        <QuestCard
                          key={t.id}
                          task={t}
                          onComplete={completeQuest}
                          onDelete={deleteQuest}
                          busy={busyId === t.id}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>

                  {doneTasks.length > 0 && (
                    <details className="pt-2">
                      <summary className="text-sm text-[var(--parchment-edge)] cursor-pointer">
                        Completed ({doneTasks.length})
                      </summary>
                      <ul className="space-y-2 mt-2">
                        {doneTasks.map((t) => (
                          <QuestCard
                            key={t.id}
                            task={t}
                            onComplete={completeQuest}
                            onDelete={deleteQuest}
                            busy={false}
                          />
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              )}

              {tab === "shop" && (
                <div id="panel-shop" role="tabpanel" aria-labelledby="tab-shop">
                  <Shop
                    character={character}
                    onBought={setCharacter}
                    onEquipped={setCharacter}
                  />
                </div>
              )}

              {tab === "log" && (
                <div id="panel-log" role="tabpanel" aria-labelledby="tab-log">
                  <QuestLog />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
