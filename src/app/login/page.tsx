"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Those credentials don't match an adventurer in our ledger.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex-1 flex items-center justify-center bg-[var(--bg-deep)] px-6 py-16">
      <form
        onSubmit={onSubmit}
        className="quest-card w-full max-w-sm rounded-lg p-8 text-[var(--ink)]"
        aria-labelledby="login-heading"
      >
        <h1 id="login-heading" className="font-display text-2xl mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--ink-soft)] mb-6">
          Sign in to continue your ledger.
        </p>

        <label htmlFor="email" className="block text-sm mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-[var(--parchment-edge)] bg-white/40 px-3 py-2 mb-4 text-sm"
        />

        <label htmlFor="password" className="block text-sm mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-[var(--parchment-edge)] bg-white/40 px-3 py-2 mb-2 text-sm"
        />

        {error && (
          <p role="alert" className="text-sm text-[var(--danger)] mb-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-md bg-[var(--accent)] py-2 font-medium text-[#1c140b] hover:bg-[var(--accent-glow)] transition-colors disabled:opacity-60"
        >
          {loading ? "Entering the tavern…" : "Log in"}
        </button>

        <p className="mt-6 text-sm text-center text-[var(--ink-soft)]">
          New here?{" "}
          <Link href="/register" className="text-[var(--accent-strong)] underline">
            Create a character
          </Link>
        </p>
      </form>
    </main>
  );
}
