import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe2,
  Heart,
  HeartHandshake,
  Mic,
  Palette,
  Play,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { soundEffects } from "@/lib/audio-effects";
import { speak } from "@/lib/speech";
import { useI18n } from "@/lib/i18n";
import { useApp } from "@/lib/app-state";
import { GAMES, type GameMeta } from "@/lib/games-catalog";

/* ------------------------- 8 NER States Cultural Data ------------------------- */
const NER_STATES = [
  {
    name: "Assam",
    greeting: "নমস্কাৰ (Nomoskar)",
    pronounce: "Nomoskar! Assam tea gardens and Bihu festivals welcome you.",
    culture: "Bihu Dance · Assam Tea · Kaziranga Rhino · Brass Pots",
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300",
    emoji: "🍃",
    elderImage: "/images/elder_grandfather_assam.jpg",
    items: ["🍵 Assam Tea", "🍚 Rice Plate", "🏺 Brass Pot", "🪭 Hand Fan"],
  },
  {
    name: "Meghalaya",
    greeting: "Khublei Shibun",
    pronounce: "Khublei Shibun! Living root bridges and cloud waterfalls.",
    culture: "Living Root Bridges · Cherrapunji Rain · Bamboo Weaving",
    color: "bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-300",
    emoji: "🌧️",
    elderImage: "/images/elder_grandmother_meghalaya.jpg",
    items: ["🧺 Bamboo Basket", "🌧️ Rain Cloud", "🧥 Wrap Shawl", "☂️ Umbrella"],
  },
  {
    name: "Manipur",
    greeting: "Khurumjari",
    pronounce: "Khurumjari! Loktak floating phumdis and lotus blooms.",
    culture: "Loktak Lake · Phumdis · Classical Manipuri Dance",
    color: "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300",
    emoji: "🪷",
    items: ["🐟 Fish Curry", "🫙 Clay Pot", "🛶 Canoe", "🪘 Hand Drum"],
  },
  {
    name: "Mizoram",
    greeting: "Chibai",
    pronounce: "Chibai! Cheraw bamboo dance and evergreen hill slopes.",
    culture: "Cheraw Bamboo Dance · Blue Mountains · Chapchar Kut",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300",
    emoji: "🎍",
    items: ["🎍 Bamboo Shoot", "🪵 Wooden Mortar", "⛰️ Hill Slope", "🧶 Striped Shawl"],
  },
  {
    name: "Nagaland",
    greeting: "Ilyi / Welcome",
    pronounce: "Welcome to Nagaland! Hornbill festival and ancient hills.",
    culture: "Hornbill Festival · Naga Handlooms · Log Drums",
    color: "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300",
    emoji: "🦜",
    items: ["🌽 Roasted Corn", "📿 Beaded Necklace", "🪑 Cane Stool", "🌲 Pine Tree"],
  },
  {
    name: "Tripura",
    greeting: "Khulumkha",
    pronounce: "Khulumkha! Ujjayanta palace and golden queen pineapples.",
    culture: "Queen Pineapples · Ujjayanta Palace · Cane Craft",
    color: "bg-orange-500/10 border-orange-500/30 text-orange-800 dark:text-orange-300",
    emoji: "🍍",
    items: ["🍍 Queen Pineapple", "🧺 Bamboo Mat", "🧵 Handloom", "🥣 Rice Bowl"],
  },
  {
    name: "Arunachal Pradesh",
    greeting: "Tashi Delek / Namaste",
    pronounce: "Tashi Delek! Land of dawn-lit mountains and wild orchids.",
    culture: "Tawang Monastery · Snow Peaks · Wild Orchids",
    color: "bg-teal-500/10 border-teal-500/30 text-teal-800 dark:text-teal-300",
    emoji: "🏔️",
    items: ["🥣 Millet Bowl", "🏔️ Snow Peak", "🔥 Hearth Fire", "🌺 Wild Orchid"],
  },
  {
    name: "Sikkim",
    greeting: "Kuzoozangpo / Namaste",
    pronounce: "Kuzoozangpo! Mount Kanchenjunga and sacred prayer wheels.",
    culture: "Kanchenjunga · Butter Tea · Monasteries · Yak Herds",
    color: "bg-purple-500/10 border-purple-500/30 text-purple-800 dark:text-purple-300",
    emoji: "☸️",
    elderImage: "/images/elder_grandmother_sikkim.jpg",
    items: ["🥟 Dumpling", "🫖 Butter Churn", "🧣 Khata Scarf", "🐂 Mountain Yak"],
  },
];

const GOVERNMENT_SHOUTOUTS = [
  {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_India.svg",
    institution: "Ministry of Health & Family Welfare",
    initiative: "Public health access",
    wordmark: "HEALTH & FAMILY WELFARE",
  },
  {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_India.svg",
    institution: "Ministry of Ayush",
    initiative: "Whole-person wellbeing",
    wordmark: "AYUSH",
  },
  {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_India.svg",
    institution: "Ministry of Electronics & IT",
    initiative: "Digital public infrastructure",
    wordmark: "ELECTRONICS & IT",
  },
  {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_India.svg",
    institution: "Ministry of Social Justice & Empowerment",
    initiative: "Inclusive community support",
    wordmark: "SOCIAL JUSTICE",
  },
  {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_India.svg",
    institution: "Ministry of Women & Child Development",
    initiative: "Family-centred care",
    wordmark: "WOMEN & CHILD",
  },
  {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_India.svg",
    institution: "Tele-MANAS 14416",
    initiative: "Mental health support line",
    wordmark: "TELE-MANAS",
  },
];

/* ------------------------------- Testimonials ------------------------------ */
const REVIEWS = [
  {
    quote:
      "The screening felt like a comforting chat, not a medical test. My 74-year-old father in Jorhat finished it without any anxiety, and the daily memory games keep him engaged every morning.",
    name: "Priyanka Sharma",
    role: "Daughter & Caregiver, Jorhat (Assam)",
    rating: 5,
    tag: "Family Care",
    image: "/images/family_care_northeast.jpg",
  },
  {
    quote:
      "For community health workers in remote hills, this provides an objective pre-clinical screening before referral. The Assamese voice assistance works seamlessly offline in field clinics.",
    name: "Dr. Lanu Jamir",
    role: "Community Physician, Kohima (Nagaland)",
    rating: 5,
    tag: "Clinical Validation",
    image: "/images/elder_grandmother_meghalaya.jpg",
  },
  {
    quote:
      "Using local items like bamboo baskets and morning tea instead of foreign objects makes a world of difference for our elderly patients in Meghalaya.",
    name: "Roderick Marak",
    role: "ASHA Field Coordinator, Garo Hills (Meghalaya)",
    rating: 5,
    tag: "Cultural Relevance",
    image: "/images/elder_grandmother_meghalaya.jpg",
  },
  {
    quote:
      "The large buttons and Assamese voice prompts helped my mother complete the check-in independently. I could see where she needed support without hovering over her.",
    name: "Ankita Bora",
    role: "Daughter & Caregiver, Dibrugarh (Assam)",
    rating: 5,
    tag: "Family Care",
    image: "/images/elder_grandfather_assam.jpg",
  },
  {
    quote:
      "Our outreach team can continue working when the signal drops. The local-first design makes this practical for villages beyond the main road.",
    name: "Merenla Ao",
    role: "Community Health Worker, Mokokchung (Nagaland)",
    rating: 5,
    tag: "Field Access",
    image: "/images/elder_grandmother_sikkim.jpg",
  },
  {
    quote:
      "The routine recall activities feel familiar rather than abstract. Patients talk about their own mornings, which makes the conversation much more natural.",
    name: "Dr. Tashi Lepcha",
    role: "Geriatric Physician, Gangtok (Sikkim)",
    rating: 5,
    tag: "Clinical Practice",
    image: "/images/elder_grandmother_sikkim.jpg",
  },
  {
    quote:
      "It gave our family a gentle starting point for discussing memory changes. The privacy controls also made everyone more comfortable trying it.",
    name: "Lalhmingliani Zote",
    role: "Family Caregiver, Aizawl (Mizoram)",
    rating: 5,
    tag: "Privacy First",
    image: "/images/family_care_northeast.jpg",
  },
];

export function LandingPage({
  onStart,
  onResume,
}: {
  onStart: () => void;
  onResume?: (() => void) | undefined;
}) {
  const { t } = useI18n();
  const { session } = useApp();

  // Carousel State
  const [reviewIndex, setReviewIndex] = useState(0);

  // Regional State Selector
  const [selectedState, setSelectedState] = useState(0);

  // ── Demo tab state ──
  const [demoStep, setDemoStep] = useState<"memory" | "stroop" | "voice">("memory");

  // ── Memory card game state ──
  const MEMORY_PAIRS = ["🌿", "🦏", "🫖", "🎋"];
  const makeMemoryDeck = () => {
    const pairs = [...MEMORY_PAIRS, ...MEMORY_PAIRS];
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j]!, pairs[i]!];
    }
    return pairs.map((emoji, idx) => ({ id: idx, emoji, flipped: false, matched: false }));
  };
  const [memCards, setMemCards] = useState(() => makeMemoryDeck());
  const [memSelected, setMemSelected] = useState<number[]>([]);
  const [memScore, setMemScore] = useState(0);
  const [memLocked, setMemLocked] = useState(false);
  const memPairs = memCards.filter(c => c.matched).length / 2;

  const handleMemCard = (id: number) => {
    if (memLocked) return;
    const card = memCards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    soundEffects.playClick();
    const newSelected = [...memSelected, id];
    setMemCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    if (newSelected.length === 2) {
      setMemLocked(true);
      const [a, b] = newSelected.map(sid => memCards.find(c => c.id === sid)!);
      if (a!.emoji === b!.emoji) {
        soundEffects.playSuccess();
        setTimeout(() => {
          setMemCards(prev => prev.map(c => newSelected.includes(c.id) ? { ...c, matched: true } : c));
          setMemScore(s => s + 10);
          setMemSelected([]);
          setMemLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setMemCards(prev => prev.map(c => newSelected.includes(c.id) ? { ...c, flipped: false } : c));
          setMemSelected([]);
          setMemLocked(false);
        }, 900);
      }
    } else {
      setMemSelected(newSelected);
    }
  };

  // ── Stroop game state ──
  const STROOP_WORDS = [
    { word: "RED", inkColor: "text-blue-500", correct: "Blue" },
    { word: "GREEN", inkColor: "text-rose-500", correct: "Red" },
    { word: "BLUE", inkColor: "text-emerald-500", correct: "Green" },
    { word: "YELLOW", inkColor: "text-purple-500", correct: "Purple" },
    { word: "PURPLE", inkColor: "text-orange-500", correct: "Orange" },
  ];
  const [stroopIdx, setStroopIdx] = useState(0);
  const [stroopScore, setStroopScore] = useState(0);
  const [stroopFeedback, setStroopFeedback] = useState<"correct" | "wrong" | null>(null);
  const [stroopDone, setStroopDone] = useState(false);
  const stroopCurrent = STROOP_WORDS[stroopIdx % STROOP_WORDS.length]!;
  const stroopChoices = ["Red", "Blue", "Green", "Purple", "Orange"].filter(() => true);

  const handleStroopAnswer = (answer: string) => {
    if (stroopFeedback !== null) return;
    const isCorrect = answer === stroopCurrent.correct;
    setStroopFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) { soundEffects.playSuccess(); setStroopScore(s => s + 20); }
    else soundEffects.playClick();
    setTimeout(() => {
      setStroopFeedback(null);
      if (stroopIdx + 1 >= STROOP_WORDS.length) {
        setStroopDone(true);
      } else {
        setStroopIdx(i => i + 1);
      }
    }, 700);
  };

  // ── Voice quiz state ──
  const VOICE_QUIZ = [
    { question: "Which state is famous for Kaziranga National Park?", options: ["Assam", "Meghalaya", "Manipur", "Nagaland"], answer: "Assam", speak: "Kaziranga National Park is in Assam" },
    { question: "One-horned rhino is a symbol of which NE state?", options: ["Tripura", "Assam", "Mizoram", "Sikkim"], answer: "Assam", speak: "The one-horned rhino is the symbol of Assam" },
    { question: "Which state is known as the 'Land of Blue Mountains'?", options: ["Manipur", "Nagaland", "Mizoram", "Arunachal Pradesh"], answer: "Mizoram", speak: "Mizoram means Land of Blue Mountains" },
  ];
  const [voiceQIdx, setVoiceQIdx] = useState(0);
  const [voiceScore, setVoiceScore] = useState(0);
  const [voiceFeedback, setVoiceFeedback] = useState<"correct" | "wrong" | null>(null);
  const [voiceDone, setVoiceDone] = useState(false);
  const voiceCurrent = VOICE_QUIZ[voiceQIdx % VOICE_QUIZ.length]!;

  const handleVoiceAnswer = (answer: string) => {
    if (voiceFeedback !== null) return;
    const isCorrect = answer === voiceCurrent.answer;
    setVoiceFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) { soundEffects.playSuccess(); setVoiceScore(s => s + 25); }
    speak(voiceCurrent.speak, "en-IN");
    setTimeout(() => {
      setVoiceFeedback(null);
      if (voiceQIdx + 1 >= VOICE_QUIZ.length) {
        setVoiceDone(true);
      } else {
        setVoiceQIdx(i => i + 1);
      }
    }, 1200);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((previous) => (previous + 1) % REVIEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleStateVoice = (stateObj: (typeof NER_STATES)[number]) => {
    soundEffects.playChime();
    speak(`${stateObj.greeting}. ${stateObj.pronounce}`, "en-IN");
  };

  const resetDemo = () => {
    soundEffects.playClick();
    setMemCards(makeMemoryDeck());
    setMemSelected([]);
    setMemScore(0);
    setMemLocked(false);
    setStroopIdx(0);
    setStroopScore(0);
    setStroopFeedback(null);
    setStroopDone(false);
    setVoiceQIdx(0);
    setVoiceScore(0);
    setVoiceFeedback(null);
    setVoiceDone(false);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background pb-24 text-foreground transition-colors duration-300 selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Header with Profile & Resume support */}
      <SiteHeader onStart={onResume || onStart} ctaLabel={onResume ? t("nav.resume") : t("nav.start")} />

      {/* Marquee Banner */}
      <div className="overflow-hidden border-b border-border/70 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-primary/10 py-2 text-xs font-semibold text-primary">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          <span>🌿 {t("hero.badge")}</span>
          <span>•</span>
          <span>⚡ {t("features.title")}</span>
          <span>•</span>
          <span>🎮 9 AI-Adaptive Brain Gym Games (L1–L5)</span>
          <span>•</span>
          <span>🗣️ Regional Voice in Assamese, Hindi & English</span>
          <span>•</span>
          <span>🔒 {t("hero.metric1Label")}</span>
          <span>•</span>
          <span>🌿 {t("hero.badge")}</span>
          <span>•</span>
          <span>⚡ {t("features.title")}</span>
        </div>
      </div>



      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH INTERACTIVE LIVE MINI-DEMO                           */}
      {/* ========================================================================= */}
      <section
        className="hero-stage relative overflow-hidden surface-hero border-b border-border/80"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--hero-x", `${event.clientX - bounds.left}px`);
          event.currentTarget.style.setProperty("--hero-y", `${event.clientY - bounds.top}px`);
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.removeProperty("--hero-x");
          event.currentTarget.style.removeProperty("--hero-y");
        }}
      >
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="hero-pulse pointer-events-none absolute" aria-hidden="true">
          <svg viewBox="0 0 900 120" preserveAspectRatio="none">
            <g>
              <path className="hero-pulse-trace" d="M0 64 H120 L138 64 L151 58 L164 64 H290 L306 64 L321 20 L337 102 L353 64 H500 L516 64 L530 54 L544 64 H670 L686 64 L700 34 L714 91 L728 64 H900" />
              <path className="hero-pulse-trace" transform="translate(900 0)" d="M0 64 H120 L138 64 L151 58 L164 64 H290 L306 64 L321 20 L337 102 L353 64 H500 L516 64 L530 54 L544 64 H670 L686 64 L700 34 L714 91 L728 64 H900" />
            </g>
          </svg>
          <span />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-12 px-4 py-12 sm:py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 border-l-2 border-primary bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>{t("hero.badge")}</span>
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {t("hero.title1")} <br />
              <span className="text-gradient">{t("hero.titleGradient")}</span> {t("hero.title2")}
            </h1>

            <p className="max-w-xl border-l border-border/80 pl-4 text-sm leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.subhead")}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-md px-7 py-5 sm:py-6 text-sm sm:text-base font-bold shadow-lift hover:-translate-y-0.5 transition-all gap-2"
                onClick={() => {
                  soundEffects.playSuccess();
                  if (session && onResume) {
                    onResume();
                  } else {
                    onStart();
                  }
                }}
              >
                <span>{session ? "Go to Dashboard" : t("nav.start")}</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Micro Feature Badges */}
            <div className="grid max-w-lg grid-cols-3 gap-2.5 border-t border-border/70 pt-2 sm:gap-3 sm:pt-4">
              <div className="border-b border-border/60 p-2.5 text-center sm:p-3">
                <p className="text-lg sm:text-xl font-extrabold text-primary">{t("hero.metric3Value")}</p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground">{t("hero.metric3Label")}</p>
              </div>
              <div className="border-b border-border/60 p-2.5 text-center sm:p-3">
                <p className="text-lg sm:text-xl font-extrabold text-primary">{t("hero.metric2Value")}</p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground">{t("hero.metric2Label")}</p>
              </div>
              <div className="border-b border-emerald-500/40 p-2.5 text-center sm:p-3">
                <p className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{t("hero.metric1Value")}</p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground">{t("hero.metric1Label")}</p>
              </div>
            </div>

            {/* Relatable Community Proof Banner */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-border/80 bg-card/70 p-3 shadow-xs backdrop-blur-sm">
              <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                <img
                  src="/images/elder_grandfather_assam.jpg"
                  alt="North Eastern grandfather in Assam"
                  className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-background shadow-xs"
                />
                <img
                  src="/images/elder_grandmother_meghalaya.jpg"
                  alt="North Eastern grandmother in Meghalaya"
                  className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-background shadow-xs"
                />
                <img
                  src="/images/family_care_northeast.jpg"
                  alt="Father and daughter in North East India"
                  className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-background shadow-xs"
                />
                <img
                  src="/images/elder_grandmother_sikkim.jpg"
                  alt="North Eastern elder in Sikkim"
                  className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-background shadow-xs"
                />
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-foreground">Built with & for North Eastern families</p>
                <p className="text-[11px] text-muted-foreground">Gentle on older eyes, large touch targets, culturally familiar memories</p>
              </div>
            </div>
          </div>


          {/* Right Column: Interactive Live Mini-Demo Widget */}
          <div
            id="interactive-demo"
            className="hero-demo lg:col-span-5 relative border border-border/80 bg-card/75 p-5 shadow-lift glass-card sm:p-6"
          >
            <div className="absolute -right-px -top-px h-10 w-10 border-r-2 border-t-2 border-primary/70" />
            <div className="absolute -bottom-px -left-px h-10 w-10 border-b-2 border-l-2 border-primary/40" />
            <div className="relative flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">{t("demo.title")}</h2>
                  <p className="text-[11px] text-muted-foreground">{t("demo.subtitle")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hero-live-status hidden items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-primary sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Live
                </span>
                <button
                  type="button"
                  onClick={resetDemo}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Reset Demo"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Demo Tabs */}
            <div className="mt-4 flex rounded-xl bg-muted/60 p-1 text-xs font-bold">
              {[
                { id: "memory" as const, label: t("demo.tabMemory") },
                { id: "stroop" as const, label: t("demo.tabStroop") },
                { id: "voice" as const, label: t("demo.tabVoice") },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setDemoStep(tab.id);
                    resetDemo();
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${demoStep === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Demo Body */}
            <div className="mt-4 min-h-[240px] flex flex-col items-center justify-center">

              {/* ── MEMORY CARD GAME ── */}
              {demoStep === "memory" && (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">{t("demo.matchPairs")}</span>
                    <span className="font-bold text-primary">✨ {memScore} {t("demo.pts")} · {memPairs}/{MEMORY_PAIRS.length} {t("demo.pairs")}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {memCards.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleMemCard(card.id)}
                        disabled={card.matched || memLocked}
                        className={`h-14 w-full rounded-xl border-2 text-2xl font-bold transition-all duration-300 select-none
                          ${ card.matched
                              ? "border-emerald-500/50 bg-emerald-500/15 scale-95 opacity-60"
                              : card.flipped
                              ? "border-primary bg-primary/10 scale-105 shadow-md"
                              : "border-border bg-muted/60 hover:border-primary hover:bg-primary/5"
                          }`}
                      >
                        {card.flipped || card.matched ? card.emoji : "❓"}
                      </button>
                    ))}
                  </div>
                  {memPairs === MEMORY_PAIRS.length && (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-in fade-in">
                      {t("demo.perfectMatch")}{memScore} {t("demo.pts")}
                    </div>
                  )}
                </div>
              )}

              {/* ── STROOP CHALLENGE ── */}
              {demoStep === "stroop" && (
                <div className="w-full space-y-3 text-center">
                  {stroopDone ? (
                    <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 space-y-2 animate-in fade-in">
                      <p className="text-2xl">🧠</p>
                      <p className="text-sm font-bold text-foreground">{t("demo.attentionComplete")}</p>
                      <p className="text-xl font-extrabold text-primary">{stroopScore} / {STROOP_WORDS.length * 20} {t("demo.pts")}</p>
                      <p className="text-[11px] text-muted-foreground">{t("demo.stroopDesc")}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{t("demo.round")} {stroopIdx + 1} {t("demo.of")} {STROOP_WORDS.length}</span>
                        <span className="font-bold text-primary">⚡ {stroopScore} {t("demo.pts")}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{t("demo.whatColor")}</p>
                      <div className={`py-3 text-4xl font-extrabold tracking-widest ${stroopCurrent.inkColor} transition-all`}>
                        {stroopCurrent.word}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {["Red", "Blue", "Green", "Purple", "Orange", "Amber"].slice(0, 5).map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleStroopAnswer(color)}
                            disabled={stroopFeedback !== null}
                            className={`rounded-xl border py-2 text-xs font-bold transition-all
                              ${ stroopFeedback !== null && color === stroopCurrent.correct
                                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-700 scale-105"
                                  : stroopFeedback === "wrong" && color !== stroopCurrent.correct
                                  ? "opacity-40"
                                  : "border-border bg-card hover:bg-muted hover:border-primary"
                              }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                      {stroopFeedback && (
                        <p className={`text-xs font-bold animate-in fade-in ${ stroopFeedback === "correct" ? "text-emerald-600" : "text-rose-600"}`}>
                          {stroopFeedback === "correct" ? t("demo.correct20") : `${t("demo.itWas")} ${stroopCurrent.correct}`}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── VOICE / NE KNOWLEDGE QUIZ ── */}
              {demoStep === "voice" && (
                <div className="w-full space-y-3">
                  {voiceDone ? (
                    <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 space-y-2 text-center animate-in fade-in">
                      <p className="text-2xl">🗣️</p>
                      <p className="text-sm font-bold text-foreground">{t("demo.quizDone")}</p>
                      <p className="text-xl font-extrabold text-primary">{voiceScore} / {VOICE_QUIZ.length * 25} {t("demo.pts")}</p>
                      <p className="text-[11px] text-muted-foreground">{t("demo.quizDesc")}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{t("demo.q")} {voiceQIdx + 1} {t("demo.of")} {VOICE_QUIZ.length}</span>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => speak(voiceCurrent.question, "en-IN")} className="flex items-center gap-1 rounded-full border border-border/80 bg-muted px-2 py-0.5 text-[10px] font-bold hover:bg-muted/80">
                            <Volume2 className="h-3 w-3 text-primary" /> {t("demo.hear")}
                          </button>
                          <span className="font-bold text-primary">🌿 {voiceScore} {t("demo.pts")}</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/40 p-3">
                        <p className="text-xs font-semibold text-foreground leading-relaxed">{voiceCurrent.question}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {voiceCurrent.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleVoiceAnswer(opt)}
                            disabled={voiceFeedback !== null}
                            className={`rounded-xl border py-2.5 text-xs font-bold transition-all
                              ${ voiceFeedback !== null && opt === voiceCurrent.answer
                                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-700 scale-105"
                                  : voiceFeedback === "wrong" && opt !== voiceCurrent.answer
                                  ? "opacity-40"
                                  : "border-border bg-card hover:bg-muted hover:border-primary"
                              }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {voiceFeedback && (
                        <p className={`text-xs font-bold text-center animate-in fade-in ${ voiceFeedback === "correct" ? "text-emerald-600" : "text-rose-600"}`}>
                          {voiceFeedback === "correct" ? t("demo.correct25") : `${t("demo.answerIs")} ${voiceCurrent.answer}`}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Quick Action Footer */}
            <div className="mt-4 border-t border-border pt-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {t("demo.noSignIn")}
              </span>
              <Button
                size="sm"
                className="rounded-full text-xs font-bold"
                onClick={() => {
                  soundEffects.playSuccess();
                  onStart();
                }}
              >
                {t("demo.startFree")}
              </Button>
            </div>
          </div>
        </div>
      </section>

            {/* Public health partners and initiatives */}
      <section className="government-marquee border-y border-border/70 py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="government-heading text-center">
            <p className="text-xl font-semibold tracking-tight sm:text-2xl">Proudly Supported By</p>
            <span className="mx-auto mt-2 block h-0.5 w-56 bg-gradient-to-r from-primary via-cyan-400 to-blue-500" />
          </div>
          <div className="mt-10 overflow-hidden" aria-label="Government ministries and public health initiatives">
            <div className="government-marquee-track">
              {[...GOVERNMENT_SHOUTOUTS, ...GOVERNMENT_SHOUTOUTS].map((item, index) => (
                <div key={`${item.institution}-${index}`} className="government-shoutout">
                  <img src={item.image} alt={`${item.institution} emblem`} />
                  <div>
                    <strong>{item.wordmark}</strong>
                    <p>{item.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="government-marquee-note mt-8 text-center text-[10px]">
            SmritiMitra is an independent project inspired by public digital-health and community-care goals.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WHO SMRITIMITRA IS FOR — ROOTED IN NORTH EASTERN HOMES & FAMILIES        */}
      {/* ========================================================================= */}
      <section id="who-its-for" className="relative border-b border-border/80 bg-gradient-to-b from-card/40 via-background to-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              🌱 Rooted In North East India
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Made with Care for Our Grandparents & Families
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Too many medical tests feel alienating, clinical, and stressful. SmritiMitra is shaped around the rhythms of home life across North East India — gentle, warm, and deeply relatable.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-3">
            {/* Card 1: For Grandparents */}
            <div className="group overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col">
              <div className="relative h-60 sm:h-64 overflow-hidden bg-muted">
                <img
                  src="/images/elder_grandfather_assam.jpg"
                  alt="Elderly grandfather from Assam"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="rounded-full bg-primary/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    For Elders (Aita & Koka)
                  </span>
                  <p className="mt-1 text-xs font-semibold text-white/90">Bhaben K., 74 — Jorhat, Assam</p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Gentle & Anxiety-Free</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Feels like a quiet morning chat on the veranda over Assam tea. Large high-contrast touch targets, slow animations, and read-aloud voice so shaky hands or weak eyesight are never barriers.
                  </p>
                </div>
                <div className="pt-2 border-t border-border/60 flex flex-wrap gap-1.5 text-[11px] font-semibold text-primary">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5">Big Touch Buttons</span>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5">Voice in Mother Tongue</span>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5">Zero Medical Jargon</span>
                </div>
              </div>
            </div>

            {/* Card 2: For Sons, Daughters & Caregivers */}
            <div className="group overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col">
              <div className="relative h-60 sm:h-64 overflow-hidden bg-muted">
                <img
                  src="/images/family_care_northeast.jpg"
                  alt="Father and daughter in North East India sharing a memory game"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    For Family Caregivers
                  </span>
                  <p className="mt-1 text-xs font-semibold text-white/90">Priyanka & Father — Dibrugarh</p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Peace of Mind for Loved Ones</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Stay closely connected to your parents' memory health, whether living under the same roof or working far away in Guwahati or Bengaluru. Track weekly trends and share clear summaries with doctors.
                  </p>
                </div>
                <div className="pt-2 border-t border-border/60 flex flex-wrap gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5">Caregiver Portal</span>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5">Doctor Summaries</span>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5">Gentle Daily Habits</span>
                </div>
              </div>
            </div>

            {/* Card 3: For Remote Villages & Clinics */}
            <div className="group overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col">
              <div className="relative h-60 sm:h-64 overflow-hidden bg-muted">
                <img
                  src="/images/elder_grandmother_meghalaya.jpg"
                  alt="Elderly grandmother in Meghalaya"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="rounded-full bg-amber-600/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    For Hill Districts & Clinics
                  </span>
                  <p className="mt-1 text-xs font-semibold text-white/90">Ka Marak, 72 — Garo Hills</p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Built Beyond the Main Road</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Designed for remote hill villages where mobile data is weak or intermittent. 100% offline functionality ensures community health workers can conduct screenings anywhere, anytime.
                  </p>
                </div>
                <div className="pt-2 border-t border-border/60 flex flex-wrap gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5">100% Offline Ready</span>
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5">On-Device Privacy</span>
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5">North East Clinics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE 8 NER STATES CULTURAL EXPLORER                             */}
      {/* ========================================================================= */}
      <section
        id="regional-culture"
        className="weave pixel-grid relative border-y border-border/80 bg-muted/20 py-20"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--grid-x", `${event.clientX - bounds.left}px`);
          event.currentTarget.style.setProperty("--grid-y", `${event.clientY - bounds.top}px`);
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.removeProperty("--grid-x");
          event.currentTarget.style.removeProperty("--grid-y");
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Indigenous Familiarity
            </p>
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Designed for 8 North East States
            </h2>
            <p className="text-sm text-muted-foreground">
              Cognitive stimuli are rooted in local life — tea gardens, rain-fed hills, handlooms, and familiar morning routines.
            </p>
          </div>

          {/* Hoverable State Matrix */}
          <div className="culture-matrix mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8" role="list" aria-label="Explore North East states">
            {NER_STATES.map((st, idx) => (
              <button
                key={st.name}
                type="button"
                role="listitem"
                aria-pressed={selectedState === idx}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedState(idx);
                }}
                className={`culture-matrix-cell relative min-h-24 overflow-hidden rounded-2xl border p-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selectedState === idx
                  ? "is-selected border-primary bg-primary text-primary-foreground shadow-lg -translate-y-1"
                  : "border-border/80 bg-card/75 text-foreground"
                  }`}
              >
                <span className="relative z-10 flex items-center justify-between text-xl">
                  <span aria-hidden>{st.emoji}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedState === idx ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                    0{idx + 1}
                  </span>
                </span>
                <span className="relative z-10 mt-3 block text-xs font-extrabold leading-tight">{st.name}</span>
                <span className={`relative z-10 mt-1 block truncate text-[10px] ${selectedState === idx ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {st.greeting}
                </span>
              </button>
            ))}
          </div>

          {/* Selected State Showcase Card */}
          {(() => {
            const state = NER_STATES[selectedState];
            return (
              <div className="mt-8 border-y border-border/80 bg-background/20 p-6 sm:p-8">
                <div className="grid gap-6 md:grid-cols-12 items-center">
                  <div className="md:col-span-7 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{state.emoji}</span>
                      <h3 className="text-2xl font-bold text-foreground">{state.name}</h3>
                      <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-bold text-secondary-foreground">
                        {state.greeting}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cultural Themes: <span className="font-semibold text-foreground">{state.culture}</span>
                    </p>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStateVoice(state)}
                        className="rounded-full text-xs font-bold gap-2 hover:bg-muted"
                      >
                        <Volume2 className="h-4 w-4 text-primary" />
                        Listen to Greeting & Cues
                      </Button>
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-3">
                    {state.elderImage && (
                      <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/80 p-2.5 shadow-xs">
                        <img
                          src={state.elderImage}
                          alt={`Elder from ${state.name}`}
                          className="h-14 w-14 rounded-xl object-cover ring-1 ring-border shrink-0"
                        />
                        <div className="min-w-0 flex-1 text-xs">
                          <p className="font-bold text-foreground truncate">Familiar to Elders in {state.name}</p>
                          <p className="text-[11px] text-muted-foreground leading-tight">Grounded in native language & daily memory prompts</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Screening Stimuli Samples
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {state.items.map((item) => (
                          <div
                            key={item}
                            className="rounded-xl border border-border/80 bg-muted/40 p-2.5 text-xs font-semibold text-foreground flex items-center gap-2 shadow-xs"
                          >
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>
      
      {/* ========================================================================= */}
      {/* 5. PRIVACY & HOW WE MONITOR SECTION                                       */}
      {/* ========================================================================= */}
      <section id="how-we-monitor" className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Local-First AI
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
              Privacy-First Behavioral Monitoring
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Passive pattern tracking to detect subtle cognitive changes early without invading privacy.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="border-l-2 border-primary/40 bg-transparent p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Passive Biomarkers Tracked</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Typing speed & touch cadence (milliseconds)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Sleep-wake rhythms and nighttime screen usage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Daily routine completion frequency</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Voice articulation rhythm and pauses</span>
                </li>
              </ul>
            </article>

            <article className="border-l-2 border-emerald-500/50 bg-transparent p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Strict Privacy Guarantees</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Zero message or keystroke text contents logged</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Processed locally on your device without cloud streaming</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Automatic deletion of raw sensor logs after 30 days</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Can be paused or disabled at any time in Settings</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CLINICAL & CAREGIVER STORIES                                           */}
      {/* ========================================================================= */}
      <section id="reviews" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Community Trust
          </p>
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Trusted by Families & Field Clinics
          </h2>
          <p className="text-sm text-muted-foreground">
            Real stories from caregivers, physicians, and health facilitators across North East India.
          </p>
        </div>

        <div className="mt-10">
          {(() => {
            const review = REVIEWS[reviewIndex] || REVIEWS[0];
            return (
              <div
                key={review.name}
                className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/80 bg-card/85 shadow-lift backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-500"
              >
                <div className="grid md:grid-cols-12 items-stretch">
                  <div className="relative md:col-span-5 min-h-[260px] sm:min-h-[300px] overflow-hidden bg-muted">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/40 p-2.5 backdrop-blur-md text-white border border-white/10">
                      <p className="text-xs font-bold">{review.role}</p>
                      <p className="text-[10px] text-white/80">North East Community Story</p>
                    </div>
                  </div>
                  <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                          {review.tag}
                        </span>
                        <div className="flex text-amber-500 text-xs" aria-label={`${review.rating} out of 5 stars`}>
                          {"★".repeat(review.rating)}
                        </div>
                      </div>
                      <p className="mt-4 text-base sm:text-lg leading-relaxed text-foreground italic font-medium">
                        "{review.quote}"
                      </p>
                    </div>
                    <footer className="border-t border-border/60 pt-4">
                      <p className="text-sm font-bold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.role}</p>
                    </footer>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-between gap-4 border-t border-border/60 pt-4">
            <div className="flex items-center gap-1.5" aria-label="Testimonial slides">
              {REVIEWS.map((review, idx) => (
                <button
                  key={review.name}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setReviewIndex(idx);
                  }}
                  className={`h-1.5 transition-all ${reviewIndex === idx ? "w-8 bg-primary" : "w-1.5 bg-border hover:bg-primary/50"}`}
                  aria-label={`Show testimonial ${idx + 1}`}
                  aria-current={reviewIndex === idx ? "true" : undefined}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setReviewIndex((previous) => (previous - 1 + REVIEWS.length) % REVIEWS.length);
                }}
                className="flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-muted"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setReviewIndex((previous) => (previous + 1) % REVIEWS.length);
                }}
                className="flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-muted"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BOTTOM CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
      <section className="border-t border-border bg-gradient-to-b from-card to-background py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6">
          <div className="max-w-xl space-y-2">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Ready when your family is
            </h2>
            <p className="text-sm text-muted-foreground">
              Create a private profile, explore the daily cognitive gym, and screen without anxiety or clinical jargon.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-bold shadow-lift hover:scale-105 transition-all gap-2"
              onClick={() => {
                soundEffects.playSuccess();
                onStart();
              }}
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Screening is an assistive guide, not a formal medical diagnosis.
          </p>
        </div>
      </section>

      {/* Footer with working legal modals and helplines */}
      <SiteFooter onStart={onStart} />
    </div>
  );
}
