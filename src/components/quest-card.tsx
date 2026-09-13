"use client";

import { motion } from "framer-motion";
import { ATTRIBUTE_META, DIFFICULTY_REWARDS } from "@/lib/rpg";
import type { Task } from "@/lib/types";

export function QuestCard({
  task,
  onComplete,
  onDelete,
  busy,
}: {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  busy: boolean;
}) {
  const meta = ATTRIBUTE_META[task.attribute];
  const reward = DIFFICULTY_REWARDS[task.difficulty];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`quest-card rounded-lg p-4 flex items-center gap-3 text-[var(--ink)] ${
        task.isDone ? "opacity-60" : ""
      }`}
    >
      <button
        onClick={() => !task.isDone && onComplete(task.id)}
        disabled={task.isDone || busy}
        aria-pressed={task.isDone}
        aria-label={task.isDone ? `${task.title} completed` : `Complete ${task.title}`}
        className={`shrink-0 h-7 w-7 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.isDone
            ? "border-[var(--success)] bg-[var(--success)] text-white"
            : "border-[var(--accent-strong)] hover:bg-[var(--accent-glow)]"
        }`}
      >
        {task.isDone ? "✓" : ""}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${task.isDone ? "line-through" : ""}`}>
          {task.title}
        </p>
        <p className="text-xs text-[var(--ink-soft)]">
          <span aria-hidden>{meta.icon}</span> {meta.label} · {task.difficulty} · +{reward.xp} XP
          / +{reward.gold}g
        </p>
      </div>

      {!task.isDone && (
        <button
          onClick={() => onDelete(task.id)}
          disabled={busy}
          aria-label={`Delete ${task.title}`}
          className="text-xs text-[var(--ink-soft)] hover:text-[var(--danger)] px-2 py-1"
        >
          Remove
        </button>
      )}
    </motion.li>
  );
}
