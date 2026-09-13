"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body data-theme="tavern" className="min-h-screen bg-[var(--bg-deep)] text-[var(--parchment)] flex items-center justify-center">
        <div className="quest-card rounded-lg p-8 max-w-sm text-center text-[var(--ink)]">
          <p className="font-display text-xl mb-2">The ledger slipped from your hands.</p>
          <p className="text-sm text-[var(--ink-soft)] mb-5">
            Something went wrong loading this page. Your progress is safe on the server.
          </p>
          <button
            onClick={reset}
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[#1c140b]"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
