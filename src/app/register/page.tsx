"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      setError("Account created — please log in.");
      router.push("/login");
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
        aria-labelledby="register-heading"
      >
        <h1 id="register-heading" className="font-display text-2xl mb-1">
          Create your character
        </h1>
        <p className="text-sm text-[var(--ink-soft)] mb-6">
          Level 1. Everyone starts somewhere.
        </p>

        <label htmlFor="name" className="block text-sm mb-1">
          Name
        </label>
        <input
          id="name"
          required
          minLength={2}
          maxLength={40}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-md border border-[var(--parchment-edge)] bg-white/40 px-3 py-2 mb-4 text-sm"
        />

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
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-[var(--parchment-edge)] bg-white/40 px-3 py-2 mb-2 text-sm"
        />
        <p className="text-xs text-[var(--ink-soft)] mb-2">At least 8 characters.</p>

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
          {loading ? "Rolling your stats…" : "Begin the adventure"}
        </button>

        <p className="mt-6 text-sm text-center text-[var(--ink-soft)]">
          Already adventuring?{" "}
          <Link href="/login" className="text-[var(--accent-strong)] underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
