import Link from "next/link";

export default function NotFound() {
  return (
    <main
      data-theme="tavern"
      className="flex-1 min-h-screen flex items-center justify-center bg-[var(--bg-deep)] px-6"
    >
      <div className="quest-card rounded-lg p-8 max-w-sm text-center text-[var(--ink)]">
        <p className="font-display text-xl mb-2">No quest posted here.</p>
        <p className="text-sm text-[var(--ink-soft)] mb-5">
          This page doesn&apos;t exist in the ledger.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#1c140b]"
        >
          Back to the tavern
        </Link>
      </div>
    </main>
  );
}
