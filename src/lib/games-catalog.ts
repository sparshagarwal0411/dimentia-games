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
  cardGradient: string;
  borderHover: string;
  badge: string;
  estimatedTime: string;
  cultureTag: string;
  category: "Memory" | "Attention" | "Recall" | "Logic" | "Language" | "Social";
};

export const GAMES: GameMeta[] = [
  {
    id: "memory-match",
    title: "Cultural Memory Match",
    desc: "3D flip and match authentic regional treasures, tea items & handloom artifacts.",
    skill: "Short-term visual retention",
    icon: LayoutGrid,
    accent: "bg-teal-500/20 text-teal-700 dark:text-teal-300",
    cardGradient: "from-teal-500/10 via-emerald-500/5 to-transparent",
    borderHover: "hover:border-teal-500/60 hover:shadow-teal-500/10",
    badge: "Visual Memory",
    estimatedTime: "2 mins",
    cultureTag: "Assam & Sikkim Heritage",
    category: "Memory",
  },
  {
    id: "routine-recall",
    title: "Daily Routine Chrono",
    desc: "Reconstruct realistic day-in-the-life sequences from morning tea to evening rest.",
    skill: "Temporal & procedural memory",
    icon: CalendarClock,
    accent: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    cardGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    borderHover: "hover:border-amber-500/60 hover:shadow-amber-500/10",
    badge: "Chronology",
    estimatedTime: "2.5 mins",
    cultureTag: "Majuli & Shillong Life",
    category: "Recall",
  },
  {
    id: "pattern",
    title: "Pattern Trail Matrix",
    desc: "Decode alternating, incremental, and symbolic sequence rules with regional motifs.",
    skill: "Inductive reasoning & planning",
    icon: Layers,
    accent: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300",
    cardGradient: "from-indigo-500/10 via-blue-500/5 to-transparent",
    borderHover: "hover:border-indigo-500/60 hover:shadow-indigo-500/10",
    badge: "Logic & Planning",
    estimatedTime: "2 mins",
    cultureTag: "Tribal Weaving Patterns",
    category: "Logic",
  },
  {
    id: "face-match",
    title: "Face & Expression Match",
    desc: "Recognize genuine facial cues and identify twin emotions across diverse characters.",
    skill: "Social & facial recognition",
    icon: Smile,
    accent: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
    cardGradient: "from-orange-500/10 via-amber-500/5 to-transparent",
    borderHover: "hover:border-orange-500/60 hover:shadow-orange-500/10",
    badge: "Facial Perception",
    estimatedTime: "2 mins",
    cultureTag: "Community Expressions",
    category: "Memory",
  },
  {
    id: "emotion-recognition",
    title: "Emotion & Social Cues",
    desc: "Analyze relatable social scenarios and identify the most empathetic response.",
    skill: "Affective empathy & judgment",
    icon: Heart,
    accent: "bg-rose-500/20 text-rose-700 dark:text-rose-300",
    cardGradient: "from-rose-500/10 via-pink-500/5 to-transparent",
    borderHover: "hover:border-rose-500/60 hover:shadow-rose-500/10",
    badge: "Social Cognition",
    estimatedTime: "2 mins",
    cultureTag: "Family Scenarios",
    category: "Social",
  },
  {
    id: "tricky-colors",
    title: "Stroop Speed Reaction",
    desc: "Speed-tap the printed ink color while overriding the conflicting semantic word text.",
    skill: "Inhibitory cognitive control",
    icon: Palette,
    accent: "bg-red-500/20 text-red-700 dark:text-red-300",
    cardGradient: "from-red-500/10 via-rose-500/5 to-transparent",
    borderHover: "hover:border-red-500/60 hover:shadow-red-500/10",
    badge: "Inhibition Reflex",
    estimatedTime: "1.5 mins",
    cultureTag: "Speed Neuro-Challenge",
    category: "Attention",
  },
  {
    id: "find-it",
    title: "Visual Search Explorer",
    desc: "Spot subtle cultural artifacts hidden within everyday North East room clutters.",
    skill: "Selective visual attention",
    icon: ScanSearch,
    accent: "bg-violet-500/20 text-violet-700 dark:text-violet-300",
    cardGradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    borderHover: "hover:border-violet-500/60 hover:shadow-violet-500/10",
    badge: "Visual Search",
    estimatedTime: "2 mins",
    cultureTag: "Bazaar & Room Clutter",
    category: "Attention",
  },
  {
    id: "word-fluency",
    title: "Verbal Garden Lexicon",
    desc: "Retrieve and type vocabulary items across categories with instant validation and bonus multipliers.",
    skill: "Semantic category retrieval",
    icon: SpellCheck,
    accent: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    cardGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    borderHover: "hover:border-emerald-500/60 hover:shadow-emerald-500/10",
    badge: "Verbal Lexicon",
    estimatedTime: "2 mins",
    cultureTag: "Regional Vocabulary",
    category: "Language",
  },
  {
    id: "speech-echo",
    title: "Speech Articulation Echo",
    desc: "Listen to natural local phrases, then speak or type them back for acoustic scoring.",
    skill: "Auditory working memory & speech",
    icon: Mic,
    accent: "bg-sky-500/20 text-sky-700 dark:text-sky-300",
    cardGradient: "from-sky-500/10 via-cyan-500/5 to-transparent",
    borderHover: "hover:border-sky-500/60 hover:shadow-sky-500/10",
    badge: "Speech & Articulation",
    estimatedTime: "2 mins",
    cultureTag: "Spoken Dialects & Tone",
    category: "Language",
  },
];
