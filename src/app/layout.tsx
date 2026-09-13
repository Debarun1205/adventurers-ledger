import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adventurer's Ledger — Turn your to-do list into an RPG",
  description:
    "Adventurer's Ledger turns daily tasks into quests. Earn XP, level up, grow your attributes, and keep your streak alive — a life RPG that makes real progress feel like a game.",
  keywords: [
    "life rpg",
    "gamified productivity",
    "habit tracker",
    "todo list rpg",
    "task game",
  ],
  openGraph: {
    title: "Adventurer's Ledger — Turn your to-do list into an RPG",
    description:
      "Earn XP, level up, and grow your attributes by completing real quests.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" data-theme="tavern">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
