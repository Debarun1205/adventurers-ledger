"use client";

import { useState } from "react";
import { ATTRIBUTE_META, DIFFICULTY_REWARDS } from "@/lib/rpg";
import type { Attribute, Difficulty } from "@/lib/rpg";

export function NewQuestForm({
  onCreate,
}: {
  onCreate: (input: {
    title: string;
    attribute: Attribute;
    difficulty: Difficulty;
  }) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [attribute, setAttribute] = useState<Attribute>("discipline");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Give the quest a name first.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onCreate({ title: trimmed, attribute, difficulty });
      setTitle("");
      setDifficulty("easy");
      setOpen(false);
    } catch {
      setError("Couldn't post that quest. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border-2 border-dashed border-[var(--parchment-edge)]/60 py-3 text-sm text-[var(--parchment-edge)] hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)] transition-colors"
      >
        + Post a new quest
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="quest-card rounded-lg p-4 text-[var(--ink)] space-y-3"
      aria-label="Post a new quest"
    >
      <div>
        <label htmlFor="quest-title" className="block text-xs mb-1">
          Quest
        </label>
        <input
          id="quest-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Read 20 pages"
          autoFocus
          maxLength={120}
          className="w-full rounded-md border border-[var(--parchment-edge)] bg-white/40 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="quest-attribute" className="block text-xs mb-1">
            Attribute
          </label>
          <select
            id="quest-attribute"
            value={attribute}
            onChange={(e) => setAttribute(e.target.value as Attribute)}
            className="w-full rounded-md border border-[var(--parchment-edge)] bg-white/40 px-2 py-2 text-sm"
          >
            {Object.entries(ATTRIBUTE_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.icon} {meta.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quest-difficulty" className="block text-xs mb-1">
            Difficulty
          </label>
          <select
            id="quest-difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full rounded-md border border-[var(--parchment-edge)] bg-white/40 px-2 py-2 text-sm"
          >
            {Object.entries(DIFFICULTY_REWARDS).map(([key, reward]) => (
              <option key={key} value={key}>
                {key} (+{reward.xp} xp, +{reward.gold}g)
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs text-[var(--danger)]">
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#1c140b] hover:bg-[var(--accent-glow)] transition-colors disabled:opacity-60"
        >
          {submitting ? "Posting…" : "Post quest"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-4 py-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
