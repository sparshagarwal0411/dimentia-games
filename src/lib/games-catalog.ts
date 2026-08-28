import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  Heart,
  Layers,
  LayoutGrid,
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
  | "find-it"
  | "routine-recall"
  | "emotion-recognition";

export type GameMeta = {
  id: GameId;
  title: string;
  desc: string;
  skill: string;
  icon: LucideIcon;
  accent: string;
  category: "Memory" | "Attention" | "Recall" | "Logic" | "Language" | "Social";
};

export const GAMES: GameMeta[] = [
  {
    id: "memory-match",
    title: "Memory Cards",
    desc: "Flip and match pairs of familiar regional objects — strengthens short-term visual retention.",
    skill: "Short-term memory",
    icon: LayoutGrid,
    accent: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
    category: "Memory",
  },
  {
    id: "routine-recall",
    title: "Daily Routine Recall",
    desc: "Arrange morning, noon, and evening activities in proper chronological sequence.",
    skill: "Temporal & routine memory",
    icon: CalendarClock,
    accent: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    category: "Recall",
  },
  {
    id: "pattern",
    title: "Pattern Trail",
    desc: "Identify sequence rules and predict the next symbol in geometric & cultural patterns.",
    skill: "Pattern logic & planning",
    icon: Layers,
    accent: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
    category: "Logic",
  },
  {
    id: "face-match",
    title: "Face & Expression",
    desc: "Match identical emotional expressions to preserve social and facial recognition.",
    skill: "Social & visual memory",
    icon: Smile,
    accent: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
    category: "Memory",
  },
  {
    id: "emotion-recognition",
    title: "Emotion & Cues",
    desc: "Interpret social scenarios and select the corresponding emotional response.",
    skill: "Emotional engagement",
    icon: Heart,
    accent: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    category: "Social",
  },
  {
    id: "tricky-colors",
    title: "Tricky Colours (Stroop)",
    desc: "Tap the ink colour, ignoring the written word — exercises inhibitory cognitive control.",
    skill: "Attention & focus",
    icon: Palette,
    accent: "bg-red-500/15 text-red-700 dark:text-red-400",
    category: "Attention",
  },
  {
    id: "find-it",
    title: "Let's Find It",
    desc: "Scan a cluttered visual scene to locate everyday household items and hidden objects.",
    skill: "Visual scanning & focus",
    icon: ScanSearch,
    accent: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
    category: "Attention",
  },
  {
    id: "word-fluency",
    title: "Word Garden",
    desc: "Name and retrieve words in specific categories (fruits, animals, markets) under gentle timing.",
    skill: "Verbal fluency & lexicon",
    icon: SpellCheck,
    accent: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    category: "Language",
  },
  {
    id: "speech-echo",
    title: "Speech Echo",
    desc: "Listen to regional spoken phrases, then speak them back to stimulate articulation and auditory memory.",
    skill: "Speech & auditory recall",
    icon: Mic,
    accent: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    category: "Language",
  },
];
