/**
 * Offline-safe game content. Bundled with the app so every game works with no
 * connection, and personalised by region for the North Eastern Region.
 */

export type CultureItem = { title: string; emoji: string; category: string; description?: string };

const COMMON: CultureItem[] = [
  { title: "Apple", emoji: "🍎", category: "food", description: "Fresh mountain fruit" },
  { title: "Teapot", emoji: "🫖", category: "household", description: "Warm morning kettle" },
  { title: "Brass Key", emoji: "🔑", category: "everyday", description: "Homestead lock key" },
  { title: "Marigold", emoji: "🌼", category: "nature", description: "Garden celebration flower" },
  { title: "Folktale Book", emoji: "📕", category: "everyday", description: "Evening reading stories" },
  { title: "Reading Glasses", emoji: "👓", category: "everyday", description: "Clear vision spectacles" },
  { title: "Cane Umbrella", emoji: "☂️", category: "everyday", description: "Monsoon rain shield" },
  { title: "Cloth Slippers", emoji: "🩴", category: "clothing", description: "Comfortable porch footwear" },
  { title: "Sweet Banana", emoji: "🍌", category: "food", description: "Sweet Malbhog banana" },
  { title: "Assam Tea", emoji: "🍵", category: "food", description: "Fragrant brew with milk" },
  { title: "Grass Broom", emoji: "🧹", category: "household", description: "Broom made of hill grass" },
  { title: "Wall Clock", emoji: "🕰️", category: "household", description: "Tick-tock family timepiece" },
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
    { title: "Khorahi (Plate)", emoji: "🍚", category: "food", description: "Steaming Joha rice" },
    { title: "Kalah (Water Pot)", emoji: "🏺", category: "household", description: "Handcrafted brass water vessel" },
    { title: "Gamosa (Wrap)", emoji: "🧣", category: "clothing", description: "Red-and-white woven cotton wrap" },
    { title: "Bamboo Grove", emoji: "🎍", category: "nature", description: "Green bamboo riverbank" },
    { title: "Bisoni (Hand Fan)", emoji: "🪭", category: "everyday", description: "Woven palm leaf cooling fan" },
    { title: "Two Leaves & Bud", emoji: "🍃", category: "nature", description: "Fresh organic tea leaves" },
  ],
  Meghalaya: [
    { title: "Pukhlein (Cake)", emoji: "🍥", category: "food", description: "Crisp jaggery rice sweet" },
    { title: "Thiah Basket", emoji: "🧺", category: "household", description: "Handwoven Khasi cane basket" },
    { title: "Cherra Monsoon", emoji: "🌧️", category: "nature", description: "Living rain cloud mist" },
    { title: "Jainsem Silk", emoji: "🧥", category: "clothing", description: "Elegantly pinned silk wrap" },
    { title: "Nohkalikai Falls", emoji: "💧", category: "nature", description: "Emerald valley cascade" },
    { title: "Knup (Sun Shield)", emoji: "☂️", category: "everyday", description: "Traditional woven rain canopy" },
  ],
  Manipur: [
    { title: "Sareng Fish", emoji: "🐟", category: "food", description: "Loktak fresh catch curry" },
    { title: "Chingkhei Pot", emoji: "🫙", category: "household", description: "Smooth black clay pottery" },
    { title: "Loktak Canoe", emoji: "🛶", category: "nature", description: "Floating phumdi wooden boat" },
    { title: "Phanek Skirt", emoji: "👗", category: "clothing", description: "Handloom striped wrap skirt" },
    { title: "Pung (Hand Drum)", emoji: "🪘", category: "everyday", description: "Rhythmic Manipuri dance drum" },
    { title: "Thambal (Lotus)", emoji: "🪷", category: "nature", description: "Sacred lake lotus bloom" },
  ],
  Mizoram: [
    { title: "Mau Tuai (Shoot)", emoji: "🎍", category: "food", description: "Fresh tender bamboo shoot" },
    { title: "Sum (Mortar)", emoji: "🪵", category: "household", description: "Heavy carved wood pounder" },
    { title: "Blue Mountain", emoji: "⛰️", category: "nature", description: "Mist-covered rolling ridge" },
    { title: "Puan Chei (Wrap)", emoji: "🧶", category: "clothing", description: "Vibrant festive woven textile" },
    { title: "Khumbeu Hat", emoji: "👒", category: "everyday", description: "Fine bamboo sunshade hat" },
    { title: "Bai (Steamed Greens)", emoji: "🥬", category: "food", description: "Wholesome seasonal greens" },
  ],
  Nagaland: [
    { title: "Smoked Corn", emoji: "🌽", category: "food", description: "Hearth-roasted sweet maize" },
    { title: "Morung Log Drum", emoji: "🪘", category: "household", description: "Village gathering signal drum" },
    { title: "Hornbill Plume", emoji: "🦜", category: "nature", description: "Sacred forest bird feather" },
    { title: "Carnelian Beads", emoji: "📿", category: "clothing", description: "Hand-strung orange glass necklace" },
    { title: "Cane Machang", emoji: "🪑", category: "everyday", description: "Flexible bamboo lounge seat" },
    { title: "Highland Pine", emoji: "🌲", category: "nature", description: "Fragrant Naga pine branch" },
  ],
  Tripura: [
    { title: "Queen Pineapple", emoji: "🍍", category: "food", description: "Sweet honey pineapple" },
    { title: "Cane Shitalpati", emoji: "🧺", category: "household", description: "Cooling woven floor mat" },
    { title: "Rubber Grove", emoji: "🌳", category: "nature", description: "Shady green rubber plantation" },
    { title: "Risa Stole", emoji: "🧵", category: "clothing", description: "Embroidered traditional breast cloth" },
    { title: "Bell Metal Jug", emoji: "🫗", category: "everyday", description: "Polished water pourer" },
    { title: "Awn Rice Bowl", emoji: "🥣", category: "food", description: "Fragrant sticky upland rice" },
  ],
  "Arunachal Pradesh": [
    { title: "Warm Thukpa", emoji: "🥣", category: "food", description: "Steaming herb broth noodles" },
    { title: "Gora Snow Peak", emoji: "🏔️", category: "nature", description: "Himalayan white summit" },
    { title: "Bukhari Hearth", emoji: "🔥", category: "household", description: "Crackling wood warming stove" },
    { title: "Yak Wool Chuba", emoji: "🧥", category: "clothing", description: "Heavy felted winter coat" },
    { title: "Carved Staff", emoji: "🦯", category: "everyday", description: "Mountain trail walking stick" },
    { title: "Blue Poppy", emoji: "🌺", category: "nature", description: "Alpine wild hillside blossom" },
  ],
  Sikkim: [
    { title: "Steamed Momo", emoji: "🥟", category: "food", description: "Handcrafted soft dumpling" },
    { title: "Kanchenjunga", emoji: "🏔️", category: "nature", description: "Guardian snow peak of Sikkim" },
    { title: "Dongmo (Tea Churn)", emoji: "🫖", category: "household", description: "Wooden salty butter tea churner" },
    { title: "Khata (Silk Scarf)", emoji: "🧣", category: "clothing", description: "White blessing ceremonial scarf" },
    { title: "Mani Prayer Wheel", emoji: "☸️", category: "everyday", description: "Spinning copper prayer wheel" },
    { title: "Highland Yak", emoji: "🐂", category: "nature", description: "Strong furry mountain grazer" },
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

export type PatternToken = { emoji: string; label: string; colorClass?: string };

const PATTERN_TOKENS: PatternToken[] = [
  { emoji: "🍃", label: "Tea Leaf", colorClass: "text-emerald-500" },
  { emoji: "🪷", label: "Lotus", colorClass: "text-pink-500" },
  { emoji: "🏺", label: "Brass Pot", colorClass: "text-amber-500" },
  { emoji: "☀️", label: "Morning Sun", colorClass: "text-amber-400" },
  { emoji: "💧", label: "Rain Drop", colorClass: "text-sky-500" },
  { emoji: "🏔️", label: "Snow Peak", colorClass: "text-indigo-400" },
  { emoji: "🎋", label: "Bamboo", colorClass: "text-teal-600" },
  { emoji: "☸️", label: "Prayer Wheel", colorClass: "text-purple-500" },
  { emoji: "🦜", label: "Hornbill", colorClass: "text-orange-500" },
];

/**
 * Multi-rule cognitive pattern generator:
 * - Level 1-2: Simple alternating (AB AB AB -> A or B)
 * - Level 3: Triad loop (ABC ABC AB -> C)
 * - Level 4: Mirrored or incremental pattern (A B C C B -> A) or (A BB CCC -> DDD)
 * - Level 5: Dual alternation or interleaved sequence
 */
export function makePattern(difficulty: number, roundKey: number = 0) {
  const mode = (difficulty + roundKey) % 3;
  let sequence: PatternToken[] = [];
  let answer: PatternToken;

  if (mode === 0 || difficulty <= 2) {
    // Alternating 2-token: A B A B A -> B
    const pair = pick(PATTERN_TOKENS, 2);
    const [a, b] = pair as [PatternToken, PatternToken];
    const length = 3 + Math.min(3, difficulty);
    for (let i = 0; i < length; i++) {
      sequence.push(i % 2 === 0 ? a : b);
    }
    answer = length % 2 === 0 ? a : b;
  } else if (mode === 1 || difficulty <= 4) {
    // Triad 3-token loop: A B C A B -> C
    const trio = pick(PATTERN_TOKENS, 3);
    const length = 4 + (difficulty >= 4 ? 2 : 1);
    for (let i = 0; i < length; i++) {
      sequence.push(trio[i % 3] as PatternToken);
    }
    answer = trio[length % 3] as PatternToken;
  } else {
    // Double repeat: A A B B C C A -> A
    const trio = pick(PATTERN_TOKENS, 3);
    const [a, b, c] = trio as [PatternToken, PatternToken, PatternToken];
    const full = [a, a, b, b, c, c, a];
    sequence = full.slice(0, 5 + Math.min(2, difficulty - 3));
    answer = full[sequence.length] ?? a;
  }

  const distractors = PATTERN_TOKENS.filter((t) => t.emoji !== answer.emoji);
  const optionCount = difficulty <= 2 ? 3 : 4;
  const options = shuffle([answer, ...pick(distractors, optionCount - 1)]);

  return { sequence, answer, options };
}

/* ---------------------------- daily routine recall ------------------------ */

export type RoutineStep = {
  emoji: string;
  label: string;
  context: string;
  order: number;
};

export type RoutineScenario = {
  theme: string;
  story: string;
  steps: RoutineStep[];
};

const SCENARIOS: RoutineScenario[] = [
  {
    theme: "Market Day in Shillong",
    story: "Organize the day's tasks as Grandma travels down to Police Bazar to meet friends.",
    steps: [
      { emoji: "🌅", label: "Wake up & Morning Stretch", context: "Early dawn light on the hills", order: 1 },
      { emoji: "🍵", label: "Brew Spiced Red Tea", context: "Warm cup by the front window", order: 2 },
      { emoji: "🧺", label: "Pack Woven Cane Basket", context: "Carefully folding the market cloth", order: 3 },
      { emoji: "🚶", label: "Walk Down to Police Bazar", context: "Greeting neighbors along the footway", order: 4 },
      { emoji: "🍯", label: "Select Wild Honey & Plums", context: "Meeting local stall keepers", order: 5 },
      { emoji: "🍲", label: "Home Cooked Family Lunch", context: "Hot steaming meal together", order: 6 },
      { emoji: "📻", label: "Listen to Evening Radio", context: "Classic melodies and quiet rest", order: 7 },
    ],
  },
  {
    theme: "Harvest Day in Majuli Island",
    story: "Order the daily steps of farm life and devotion beside the sacred riverbank.",
    steps: [
      { emoji: "🔔", label: "Namghar Morning Prayer Bell", context: "Sacred dawn hymn across the island", order: 1 },
      { emoji: "🔥", label: "Kindle the Hearth Stove", context: "Starting the warming firewood", order: 2 },
      { emoji: "🍚", label: "Breakfast of Pitha & Milk", context: "Hearty fuel for the morning", order: 3 },
      { emoji: "🌾", label: "Tend Golden Paddy Crops", context: "Checking river moisture along fields", order: 4 },
      { emoji: "🛶", label: "Return Across Calm River", context: "Canoe gliding at sunset", order: 5 },
      { emoji: "🪔", label: "Light Evening Brass Lamp", context: "Blessing the porch and doorway", order: 6 },
      { emoji: "🛏️", label: "Rest Under Mosquito Net", context: "Peaceful river breeze slumber", order: 7 },
    ],
  },
  {
    theme: "Festive Weaving Day in Kohima",
    story: "Chronologically sequence the steps of handloom weaving and community celebration.",
    steps: [
      { emoji: "☀️", label: "Early Sun Courtyard Sweep", context: "Clearing leaves from stone courtyard", order: 1 },
      { emoji: "🫖", label: "Hot Mug of Ginger Tea", context: "Warming the hands before craft", order: 2 },
      { emoji: "🧵", label: "Set Colorful Yarn on Loom", context: "Arranging red and black cotton warps", order: 3 },
      { emoji: "🪡", label: "Weave Traditional Shawl Edge", context: "Rhythmic backstrap loom wooden clack", order: 4 },
      { emoji: "📿", label: "Wear Festive Beads for Guests", context: "Welcoming relatives from neighboring hill", order: 5 },
      { emoji: "🍲", label: "Community Stew Dinner", context: "Sharing hot broth and smoked squash", order: 6 },
    ],
  },
  {
    theme: "Quiet Garden Morning in Gangtok",
    story: "Arrange the gentle restorative flow of an elder's morning in the garden terrace.",
    steps: [
      { emoji: "🏔️", label: "View Kanchenjunga Sunrise", context: "Golden light touching the white peak", order: 1 },
      { emoji: "🧈", label: "Sip Warm Salt Butter Tea", context: "Rich traditional wooden churn tea", order: 2 },
      { emoji: "🪴", label: "Water Potted Wild Orchids", context: "Tending purple petals on the balcony", order: 3 },
      { emoji: "☸️", label: "Turn Brass Hand Prayer Wheel", context: "Reciting quiet mantras for well-being", order: 4 },
      { emoji: "🥟", label: "Light Lunch with Momo & Broth", context: "Delicate fresh steamed dumplings", order: 5 },
      { emoji: "📖", label: "Afternoon Reading on Verandah", context: "Reading chronicles in the mountain breeze", order: 6 },
    ],
  },
];

export function makeRoutine(difficulty: number, roundKey: number = 0) {
  const scenario = SCENARIOS[roundKey % SCENARIOS.length]!;
  // Number of steps calibrated to difficulty: 3 to 5
  const count = Math.min(scenario.steps.length, 3 + Math.min(2, Math.floor(difficulty / 2)));
  const selectedSteps = scenario.steps.slice(0, count);
  return {
    theme: scenario.theme,
    story: scenario.story,
    correct: selectedSteps,
    scrambled: shuffle(selectedSteps),
  };
}

/* --------------------------- emotion recognition -------------------------- */

export type EmotionQuestion = {
  id: string;
  situation: string;
  speaker: string;
  answer: string;
  explanation: string;
  nuanceContext: string;
};

const EMOTION_QUESTIONS: EmotionQuestion[] = [
  {
    id: "e1",
    situation: "Her daughter unexpectedly arrived by the afternoon bus with her favorite seasonal bamboo shoot pickles.",
    speaker: "Grandmother Lakshmi",
    answer: "Joyful & Touched",
    explanation: "Unexpected acts of care and familiar gifts foster warm affection and delight.",
    nuanceContext: "Surprise reunion with beloved family member",
  },
  {
    id: "e2",
    situation: "He spent thirty minutes looking everywhere on the verandah for his reading spectacles, only to find them resting on his own forehead.",
    speaker: "Uncle Pranab",
    answer: "Amused & Relieved",
    explanation: "A harmless moment of forgetfulness that turns into gentle, lighthearted self-laughter.",
    nuanceContext: "Misplaced item found safely",
  },
  {
    id: "e3",
    situation: "Sitting quietly on the porch at dusk, watching the rain mist drift slowly across the tea hills with hot tea in hand.",
    speaker: "Grandfather Biren",
    answer: "Peaceful & Serene",
    explanation: "Quiet immersion in familiar gentle nature brings profound mental calmness and low anxiety.",
    nuanceContext: "Restorative solitary evening moment",
  },
  {
    id: "e4",
    situation: "The morning power went out just as she was trying to iron her fine silk wrap for a community wedding ceremony.",
    speaker: "Aunt Maya",
    answer: "Flustered & Impatient",
    explanation: "Sudden disruptions right before an important social event trigger temporary agitation.",
    nuanceContext: "Unexpected delay before an event",
  },
  {
    id: "e5",
    situation: "His grandchild proudly showed him a certificate for winning first prize in the school folk song competition.",
    speaker: "Grandpa Aosen",
    answer: "Proud & Radiant",
    explanation: "Witnessing younger generations succeed and honor cultural heritage produces deep pride.",
    nuanceContext: "Celebrating family milestone",
  },
  {
    id: "e6",
    situation: "Dark storm clouds gathered suddenly over the valley while his young grandson was still walking back from the football field.",
    speaker: "Elder Tashi",
    answer: "Concerned & Anxious",
    explanation: "Protectiveness and worry for loved ones during unpredictable mountain weather.",
    nuanceContext: "Apprehension about safety",
  },
];

const EMOTION_POOL = [
  "Joyful & Touched",
  "Peaceful & Serene",
  "Amused & Relieved",
  "Flustered & Impatient",
  "Proud & Radiant",
  "Concerned & Anxious",
  "Nostalgic & Reflective",
  "Courageous & Confident",
];

export function makeEmotionRound(difficulty: number, roundKey: number = 0) {
  const item = EMOTION_QUESTIONS[roundKey % EMOTION_QUESTIONS.length]!;
  const distractors = EMOTION_POOL.filter((opt) => opt !== item.answer);
  const count = difficulty <= 2 ? 3 : 4;
  const options = shuffle([item.answer, ...pick(distractors, count - 1)]);
  return { card: item, options };
}

/* --------------------------- word fluency dictionary -------------------------- */

export type CategoryLexicon = {
  id: string;
  label: string;
  iconName: string;
  hint: string;
  words: Set<string>;
};

const ANIMALS_LIST = [
  "cat", "dog", "cow", "goat", "fish", "bird", "duck", "tiger", "lion", "rhino", "elephant",
  "deer", "horse", "bear", "monkey", "rabbit", "sheep", "pig", "frog", "snake", "eagle",
  "hornbill", "gibbon", "mithun", "leopard", "buffalo", "crab", "pigeon", "parrot", "swan",
  "butterfly", "squirrel", "turtle", "otter", "yak", "serow", "pangolin", "badger", "falcon",
  "sparrow", "crow", "hen", "rooster", "wolf", "fox", "ant", "bee", "beetle", "peacock",
  "dolphin", "crane", "owl", "bat", "mouse", "rat", "donkey", "mule", "camel", "gecko",
  "lizard", "goose", "turkey", "whale", "shark", "seal", "walrus", "cheetah", "zebra", "giraffe"
];

const FOODS_LIST = [
  "rice", "tea", "banana", "apple", "fish", "dal", "bread", "milk", "egg", "roti",
  "mango", "potato", "tomato", "chicken", "soup", "ginger", "garlic", "chili", "onion", "pork",
  "momo", "curry", "paneer", "orange", "pineapple", "mustard", "bamboo", "dumpling", "jackfruit",
  "litchi", "papaya", "pitha", "honey", "butter", "cheese", "ghee", "spinach", "carrot", "pea",
  "bean", "corn", "millet", "cucumber", "gourd", "brinjal", "cabbage", "cauliflower", "radish",
  "coconut", "guava", "plum", "pear", "peach", "apricot", "nut", "cashew", "almond", "walnut",
  "pickle", "jam", "yogurt", "kheer", "halwa", "poha", "upma", "dosa", "idli", "sambhar"
];

const HOUSEHOLD_LIST = [
  "cup", "chair", "bed", "fan", "lamp", "broom", "key", "clock", "plate", "spoon",
  "bowl", "pillow", "door", "window", "bucket", "mat", "table", "mirror", "towel", "blanket",
  "pot", "pan", "kettle", "teapot", "knife", "fork", "lantern", "candle", "lock", "basket",
  "curtain", "stool", "sofa", "shelf", "box", "bottle", "jug", "glass", "comb", "brush",
  "radio", "stove", "hearth", "umbrella", "spectacles", "ladder", "rope", "mortar", "pestle",
  "needle", "thread", "scissors", "quilt", "rug", "cupboard", "desk", "torch", "vase", "tray"
];

const NATURE_LIST = [
  "tree", "flower", "river", "mountain", "cloud", "rain", "sun", "moon", "star", "leaf",
  "stone", "rock", "hill", "valley", "stream", "lake", "forest", "grass", "bamboo", "orchid",
  "lotus", "pond", "waterfall", "spring", "soil", "wind", "breeze", "snow", "mist", "fog",
  "sand", "wave", "wood", "branch", "root", "seed", "fruit", "moss", "fern", "meadow",
  "cliff", "cave", "island", "ocean", "sea", "sky", "dawn", "dusk", "rainbow", "thunder"
];

export const CATEGORIES_LEXICON: Record<string, CategoryLexicon> = {
  animals: {
    id: "animals",
    label: "Animals & Birds",
    iconName: "PawPrint",
    hint: "Name any living animal, bird, or aquatic creature",
    words: new Set(ANIMALS_LIST),
  },
  foods: {
    id: "foods",
    label: "Foods, Fruits & Crops",
    iconName: "Utensils",
    hint: "Name any fruit, vegetable, dish, drink, or meal",
    words: new Set(FOODS_LIST),
  },
  household: {
    id: "household",
    label: "Everyday Household Items",
    iconName: "Home",
    hint: "Name any object found in home, kitchen, or living room",
    words: new Set(HOUSEHOLD_LIST),
  },
  nature: {
    id: "nature",
    label: "Nature & Landscape Elements",
    iconName: "Mountain",
    hint: "Name natural objects like trees, waters, hills, skies",
    words: new Set(NATURE_LIST),
  },
};

/** Exact normalized dictionary lookup with minimum length check */
export function isWordValid(categoryId: string, input: string): boolean {
  const norm = input.trim().toLowerCase();
  if (norm.length < 3) return false;
  const category = CATEGORIES_LEXICON[categoryId];
  if (!category) return false;
  return category.words.has(norm);
}

export function memoryRound(difficulty: number) {
  return { showCount: 2 + difficulty, viewSeconds: Math.max(3, 8 - difficulty) };
}
