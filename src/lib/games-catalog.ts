import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Layers,
  Mic,
  Palette,
  ScanSearch,
  Smile,
  SpellCheck,
} from "lucide-react";

export type GameId =
  | "memory-match"
  | "pattern"
  | "face-match"
  | "tricky-colors"
  | "word-fluency"
  | "speech-echo"
  | "find-it";

export type GameMeta = {
  id: GameId;
  title: string;
  desc: string;
  skill: string;
  icon: LucideIcon;
  accent: string;
};

export const GAMES: GameMeta[] = [
  {
    id: "memory-match",
    title: "Memory cards",
    desc: "Flip and match pairs of familiar objects — like classic card matching.",
    skill: "Short-term memory",
    icon: LayoutGrid,
    accent: "bg-teal-500/15 text-teal-700",
  },
  {
    id: "pattern",
    title: "Pattern trail",
    desc: "Spot what comes next in a simple repeating sequence.",
    skill: "Logic & planning",
    icon: Layers,
    accent: "bg-indigo-500/15 text-indigo-700",
  },
  {
    id: "face-match",
    title: "Face recognition",
    desc: "Match the same expression twice to train visual memory.",
    skill: "Visual & social memory",
    icon: Smile,
    accent: "bg-amber-500/15 text-amber-800",
  },
  {
    id: "tricky-colors",
    title: "Tricky colours",
    desc: "Tap the ink colour, not the written word — a gentle Stroop game.",
    skill: "Attention & control",
    icon: Palette,
    accent: "bg-rose-500/15 text-rose-700",
  },
  {
    id: "word-fluency",
    title: "Word garden",
    desc: "Name as many words as you can in a category before time runs out.",
    skill: "Vocabulary & fluency",
    icon: SpellCheck,
    accent: "bg-emerald-500/15 text-emerald-700",
  },
  {
    id: "speech-echo",
    title: "Speech echo",
    desc: "Hear a short sentence, then say it back. Great for speech practice.",
    skill: "Speech & recall",
    icon: Mic,
    accent: "bg-sky-500/15 text-sky-700",
  },
  {
    id: "find-it",
    title: "Let's find it",
    desc: "Scan a busy grid and tap the hidden everyday object.",
    skill: "Focus & scanning",
    icon: ScanSearch,
    accent: "bg-violet-500/15 text-violet-700",
  },
];
