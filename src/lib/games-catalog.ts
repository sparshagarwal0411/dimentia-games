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
    desc: "Flip and match pairs of familiar regional treasures, tea items & handloom artifacts.",
    skill: "Short-term visual retention",
    icon: LayoutGrid,
    accent: "bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20",
    cardGradient: "from-card to-muted/30",
    borderHover: "hover:border-primary/40 hover:bg-card/95",
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
    accent: "bg-primary/10 text-primary border border-primary/20",
    cardGradient: "from-card to-muted/30",
    borderHover: "hover:border-primary/40 hover:bg-card/95",
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
    accent: "bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20",
    cardGradient: "from-card to-muted/30",
    borderHover: "hover:border-primary/40 hover:bg-card/95",
    badge: "Logic & Planning",
    estimatedTime: "2 mins",
    cultureTag: "Tribal Weaving Patterns",
    category: "Logic",
  },
  {
    id: "face-match",
    title: "Face & Expression Match",
    desc: "Recognize gentle facial cues and identify matching emotions across diverse characters.",
    skill: "Social & facial recognition",
    icon: Smile,
    accent: "bg-primary/10 text-primary border border-primary/20",
    cardGradient: "from-card to-muted/30",
    borderHover: "hover:border-primary/40 hover:bg-card/95",
    badge: "Facial Perception",
    estimatedTime: "2 mins",
    cultureTag: "Community Expressions",
    category: "Memory",
  },
  {
    id: "emotion-recognition",
    title: "Emotion & Social Cues",
    desc: "Reflect on relatable family situations and identify the most empathetic response.",
    skill: "Affective empathy & judgment",
    icon: Heart,
    accent: "bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20",
    cardGradient: "from-card to-muted/30",
    borderHover: "hover:border-primary/40 hover:bg-card/95",
    badge: "Social Cognition",
    estimatedTime: "2 mins",
    cultureTag: "Family Scenarios",
    category: "Social",
  },
  {
    id: "tricky-colors",
    title: "Stroop Speed Reaction",
    desc: "Tap the ink color while gently overriding conflicting semantic word text.",
    skill: "Inhibitory cognitive control",
    icon: Palette,
    accent: "bg-primary/10 text-primary border border-primary/20",
    cardGradient: "from-card to-muted/30",
    borderHover: "hover:border-primary/40 hover:bg-card/95",
    badge: "Inhibition Reflex",
    estimatedTime: "1.5 mins",
    cultureTag: "Attention Challenge",
    category: "Attention",
  },
  {
    id: "find-it",
    title: "Visual Search Explorer",
    desc: "Spot subtle cultural artifacts hidden within everyday North East room clutters.",
    skill: "Selective visual attention",
    icon: ScanSearch,
    accent: "bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20",
    cardGradient: "from-card to-muted/30",
    borderHover: "hover:border-primary/40 hover:bg-card/95",
    badge: "Visual Search",
    estimatedTime: "2 mins",
    cultureTag: "Bazaar & Room Clutter",
    category: "Attention",
  },
  {
    id: "word-fluency",
    title: "Verbal Garden Lexicon",
    desc: "Retrieve and type vocabulary items across categories with gentle, calming timing.",
    skill: "Semantic category retrieval",
    icon: SpellCheck,
    accent: "bg-primary/10 text-primary border border-primary/20",
    cardGradient: "from-card to-muted/30",
    borderHover: "hover:border-primary/40 hover:bg-card/95",
    badge: "Verbal Lexicon",
    estimatedTime: "2 mins",
    cultureTag: "Regional Vocabulary",
    category: "Language",
  },
  {
    id: "speech-echo",
    title: "Speech Articulation Echo",
    desc: "Listen to natural regional phrases, then speak or type them back at your own pace.",
    skill: "Auditory memory & speech",
    icon: Mic,
    accent: "bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20",
    cardGradient: "from-card to-muted/30",
    borderHover: "hover:border-primary/40 hover:bg-card/95",
    badge: "Speech Recall",
    estimatedTime: "2 mins",
    cultureTag: "Spoken Phrases",
    category: "Language",
  },
];
