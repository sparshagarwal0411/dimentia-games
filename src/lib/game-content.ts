/**
 * Offline-safe game content. Bundled with the app so every game works with no
 * connection, and personalised by region for the North Eastern Region.
 */

export type CultureItem = { title: string; emoji: string; category: string };

const COMMON: CultureItem[] = [
  { title: "Apple", emoji: "🍎", category: "food" },
  { title: "Teapot", emoji: "🫖", category: "household" },
  { title: "Key", emoji: "🔑", category: "everyday" },
  { title: "Flower", emoji: "🌼", category: "nature" },
  { title: "Book", emoji: "📕", category: "everyday" },
  { title: "Spectacles", emoji: "👓", category: "everyday" },
  { title: "Umbrella", emoji: "☂️", category: "everyday" },
  { title: "Slippers", emoji: "🩴", category: "clothing" },
  { title: "Banana", emoji: "🍌", category: "food" },
  { title: "Cup of tea", emoji: "🍵", category: "food" },
  { title: "Broom", emoji: "🧹", category: "household" },
  { title: "Clock", emoji: "🕰️", category: "household" },
];

export const REGIONS = [
  "Assam",
  "Meghalaya",
  "Manipur",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Arunachal Pradesh",
  "Sikkim",
] as const;

export type Region = (typeof REGIONS)[number];

const REGIONAL: Record<Region, CultureItem[]> = {
  Assam: [
    { title: "Rice plate", emoji: "🍚", category: "food" },
    { title: "Brass water pot", emoji: "🏺", category: "household" },
    { title: "Woven shawl", emoji: "🧣", category: "clothing" },
    { title: "Bamboo grove", emoji: "🎍", category: "nature" },
    { title: "Hand fan", emoji: "🪭", category: "everyday" },
    { title: "Tea leaf", emoji: "🍃", category: "nature" },
  ],
  Meghalaya: [
    { title: "Rice cake", emoji: "🍥", category: "food" },
    { title: "Bamboo basket", emoji: "🧺", category: "household" },
    { title: "Rain cloud", emoji: "🌧️", category: "nature" },
    { title: "Shoulder wrap", emoji: "🧥", category: "clothing" },
    { title: "Waterfall", emoji: "💧", category: "nature" },
    { title: "Umbrella", emoji: "☂️", category: "everyday" },
  ],
  Manipur: [
    { title: "Fish curry", emoji: "🐟", category: "food" },
    { title: "Clay pot", emoji: "🫙", category: "household" },
    { title: "Boat", emoji: "🛶", category: "nature" },
    { title: "Wrap skirt", emoji: "👗", category: "clothing" },
    { title: "Hand drum", emoji: "🪘", category: "everyday" },
    { title: "Lotus", emoji: "🪷", category: "nature" },
  ],
  Mizoram: [
    { title: "Bamboo shoot", emoji: "🎍", category: "food" },
    { title: "Wooden mortar", emoji: "🪵", category: "household" },
    { title: "Hill slope", emoji: "⛰️", category: "nature" },
    { title: "Striped cloth", emoji: "🧶", category: "clothing" },
    { title: "Basket hat", emoji: "👒", category: "everyday" },
    { title: "Boiled greens", emoji: "🥬", category: "food" },
  ],
  Nagaland: [
    { title: "Roasted corn", emoji: "🌽", category: "food" },
    { title: "Log drum", emoji: "🪘", category: "household" },
    { title: "Hornbill", emoji: "🦜", category: "nature" },
    { title: "Beaded necklace", emoji: "📿", category: "clothing" },
    { title: "Cane stool", emoji: "🪑", category: "everyday" },
    { title: "Pine tree", emoji: "🌲", category: "nature" },
  ],
  Tripura: [
    { title: "Pineapple", emoji: "🍍", category: "food" },
    { title: "Bamboo mat", emoji: "🧺", category: "household" },
    { title: "Rubber tree", emoji: "🌳", category: "nature" },
    { title: "Handloom cloth", emoji: "🧵", category: "clothing" },
    { title: "Water jug", emoji: "🫗", category: "everyday" },
    { title: "Rice bowl", emoji: "🥣", category: "food" },
  ],
  "Arunachal Pradesh": [
    { title: "Millet bowl", emoji: "🥣", category: "food" },
    { title: "Snow peak", emoji: "🏔️", category: "nature" },
    { title: "Fire hearth", emoji: "🔥", category: "household" },
    { title: "Woollen coat", emoji: "🧥", category: "clothing" },
    { title: "Walking stick", emoji: "🦯", category: "everyday" },
    { title: "Orchid", emoji: "🌺", category: "nature" },
  ],
  Sikkim: [
    { title: "Dumpling", emoji: "🥟", category: "food" },
    { title: "Mountain", emoji: "🏔️", category: "nature" },
    { title: "Butter tea churn", emoji: "🫖", category: "household" },
    { title: "Prayer scarf", emoji: "🧣", category: "clothing" },
    { title: "Prayer wheel", emoji: "☸️", category: "everyday" },
    { title: "Yak", emoji: "🐂", category: "nature" },
  ],
};

export function itemsForRegion(region: string): CultureItem[] {
  const regional = REGIONAL[region as Region] ?? REGIONAL.Assam;
  return [...regional, ...COMMON];
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = copy[i] as T;
    copy[i] = copy[j] as T;
    copy[j] = a;
  }
  return copy;
}

export function pick<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

/* --------------------------- pattern recognition -------------------------- */

export type PatternToken = { emoji: string; label: string };

const SHAPES: PatternToken[] = [
  { emoji: "🟢", label: "Green circle" },
  { emoji: "🔵", label: "Blue circle" },
  { emoji: "🟡", label: "Yellow circle" },
  { emoji: "🔴", label: "Red circle" },
  { emoji: "🟪", label: "Purple square" },
  { emoji: "🟧", label: "Orange square" },
];

/** Difficulty 1-5 controls sequence length and repeat period. */
export function makePattern(difficulty: number) {
  const period = difficulty <= 1 ? 2 : difficulty <= 3 ? 3 : 4;
  const length = 3 + difficulty;
  const base = pick(SHAPES, period);
  const sequence: PatternToken[] = [];
  for (let i = 0; i < length; i += 1) sequence.push(base[i % period] as PatternToken);
  const answer = base[length % period] as PatternToken;
  const distractors = SHAPES.filter((s) => s.emoji !== answer.emoji);
  const options = shuffle([answer, ...pick(distractors, difficulty <= 2 ? 2 : 3)]);
  return { sequence, answer, options };
}

/* ---------------------------- daily routine recall ------------------------ */

export type RoutineStep = { emoji: string; label: string; time: string };

const ROUTINE: RoutineStep[] = [
  { emoji: "☀️", label: "Wake up", time: "6:30 AM" },
  { emoji: "🪥", label: "Brush teeth", time: "7:00 AM" },
  { emoji: "🍵", label: "Morning tea", time: "7:30 AM" },
  { emoji: "🍚", label: "Breakfast", time: "8:30 AM" },
  { emoji: "💊", label: "Take medicine", time: "9:00 AM" },
  { emoji: "🚶", label: "Go for a walk", time: "5:00 PM" },
  { emoji: "🛏️", label: "Rest", time: "9:00 PM" },
];

export function makeRoutine(difficulty: number) {
  const count = Math.min(ROUTINE.length, 3 + difficulty);
  const correct = ROUTINE.slice(0, count);
  return { correct, scrambled: shuffle(correct) };
}

/* --------------------------- emotion recognition -------------------------- */

export type EmotionCard = { emoji: string; answer: string; situation: string };

export const EMOTION_OPTIONS = ["Happy", "Sad", "Angry", "Worried", "Surprised", "Calm"];

const EMOTIONS: EmotionCard[] = [
  { emoji: "😊", answer: "Happy", situation: "Her grandchildren came to visit." },
  { emoji: "☹️", answer: "Sad", situation: "He lost his favourite umbrella." },
  { emoji: "😠", answer: "Angry", situation: "Someone spilled his tea." },
  { emoji: "😟", answer: "Worried", situation: "The bus has not arrived yet." },
  { emoji: "😲", answer: "Surprised", situation: "A friend arrived without telling." },
  { emoji: "😌", answer: "Calm", situation: "She is sitting in the garden." },
];

export function makeEmotionRound(difficulty: number) {
  const card = pick(EMOTIONS, 1)[0] as EmotionCard;
  const others = EMOTION_OPTIONS.filter((option) => option !== card.answer);
  const optionCount = difficulty <= 2 ? 2 : difficulty <= 4 ? 3 : 4;
  return { card, options: shuffle([card.answer, ...pick(others, optionCount - 1)]) };
}

/* ------------------------------ round sizing ------------------------------ */

export function memoryRound(difficulty: number) {
  return { showCount: 2 + difficulty, viewSeconds: Math.max(3, 8 - difficulty) };
}
