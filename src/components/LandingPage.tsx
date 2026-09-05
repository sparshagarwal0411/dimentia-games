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
  Languages,
  Mic,
  Palette,
  Play,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { soundEffects } from "@/lib/audio-effects";
import { speak } from "@/lib/speech";
import { useI18n } from "@/lib/i18n";
import { GAMES, type GameMeta } from "@/lib/games-catalog";

/* --------------------------- Carousel Slide Data -------------------------- */
const CAROUSEL_SLIDES = [
  {
    tag: "Clinical Triad",
    title: "Triple-Biomarker Guided Screening",
    badge: "Cognitive · Speech · Behavioral",
    description:
      "A calm, conversational screening combining memory tasks, spoken language rhythm, and daily behavioral indicators. Scored directly on-device with zero diagnostic stigma.",
    icon: Brain,
    accent: "from-teal-500/20 via-primary/10 to-transparent",
    bullets: [
      "No intimidating hospital forms",
      "Instant risk category & clinician next-steps",
      "Automatic offline caching in remote districts",
    ],
  },
  {
    tag: "AI Cognitive Gym",
    title: "9 AI-Adaptive Brain Games",
    badge: "Real-time Difficulty Scaling (L1–L5)",
    description:
      "Engaging memory cards, routine recall, Stroop attention, face recognition, and speech echo games that dynamically adjust challenge level based on response speed and accuracy.",
    icon: Sparkles,
    accent: "from-indigo-500/20 via-primary/10 to-transparent",
    bullets: [
      "Memory, attention, logic & temporal recall",
      "Weekly community tournaments & XP streaks",
      "Designed specifically for elderly hand dexterity",
    ],
  },
  {
    tag: "Regional Dialects",
    title: "Multilingual & Voice-Assisted",
    badge: "Assamese · Hindi · English · Cues",
    description:
      "Elderly-friendly large tap buttons, full voice read-aloud, and speech-based answers tailored for North East Indian households with familiar tea garden and market cues.",
    icon: Languages,
    accent: "from-amber-500/20 via-primary/10 to-transparent",
    bullets: [
      "Assamese & Hindi voice guidance built-in",
      "High contrast & slow interaction modes",
      "Culturally familiar objects from all 8 states",
    ],
  },
  {
    tag: "Privacy Guarantee",
    title: "Zero-Cloud Local Privacy",
    badge: "DPDP Act 2023 Compliant",
    description:
      "All screening data and behavioral telemetry stay securely encrypted on your device. Works completely offline without requiring an active internet connection.",
    icon: ShieldCheck,
    accent: "from-emerald-500/20 via-primary/10 to-transparent",
    bullets: [
      "Works in zero-connectivity hills & tea estates",
      "No keystrokes or private messages logged",
      "1-click data deletion anytime",
    ],
  },
];

/* ------------------------- 8 NER States Cultural Data ------------------------- */
const NER_STATES = [
  {
    name: "Assam",
    greeting: "নমস্কাৰ (Nomoskar)",
    pronounce: "Nomoskar! Assam tea gardens and Bihu festivals welcome you.",
    culture: "Bihu Dance · Assam Tea · Kaziranga Rhino · Brass Pots",
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300",
    emoji: "🍃",
    items: ["🍵 Assam Tea", "🍚 Rice Plate", "🏺 Brass Pot", "🪭 Hand Fan"],
  },
  {
    name: "Meghalaya",
    greeting: "Khublei Shibun",
    pronounce: "Khublei Shibun! Living root bridges and cloud waterfalls.",
    culture: "Living Root Bridges · Cherrapunji Rain · Bamboo Weaving",
    color: "bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-300",
    emoji: "🌧️",
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
    items: ["🥟 Dumpling", "🫖 Butter Churn", "🧣 Khata Scarf", "🐂 Mountain Yak"],
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
  },
  {
    quote:
      "For community health workers in remote hills, this provides an objective pre-clinical screening before referral. The Assamese voice assistance works seamlessly offline in field clinics.",
    name: "Dr. Lanu Jamir",
    role: "Community Physician, Kohima (Nagaland)",
    rating: 5,
    tag: "Clinical Validation",
  },
  {
    quote:
      "Using local items like bamboo baskets and morning tea instead of foreign objects makes a world of difference for our elderly patients in Meghalaya.",
    name: "Roderick Marak",
    role: "ASHA Field Coordinator, Garo Hills (Meghalaya)",
    rating: 5,
    tag: "Cultural Relevance",
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

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Regional State Selector
  const [selectedState, setSelectedState] = useState(0);

  // Interactive Mini-Demo State (Memory flip card demo in hero)
  const [demoStep, setDemoStep] = useState<"memory" | "stroop" | "voice">("memory");
  const [demoFlipped, setDemoFlipped] = useState(false);
  const [demoMatched, setDemoMatched] = useState(false);
  const [stroopSelected, setStroopSelected] = useState<string | null>(null);
  const [voiceSpoken, setVoiceSpoken] = useState(false);

  // Auto-advance Carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleStateVoice = (stateObj: (typeof NER_STATES)[number]) => {
    soundEffects.playChime();
    speak(stateObj.pronounce, "en-IN");
  };

  const handleDemoClick = () => {
    soundEffects.playSuccess();
    setDemoFlipped(true);
    setTimeout(() => {
      setDemoMatched(true);
    }, 500);
  };

  const resetDemo = () => {
    soundEffects.playClick();
    setDemoFlipped(false);
    setDemoMatched(false);
    setStroopSelected(null);
    setVoiceSpoken(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Header */}
      <SiteHeader onStart={onStart} />

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
      <section className="relative overflow-hidden surface-hero border-b border-border/80">
        {/* Ambient background glow orbs */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-12 px-4 py-12 sm:py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>{t("hero.badge")}</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("hero.title1")} <br />
              <span className="text-gradient">{t("hero.titleGradient")}</span> {t("hero.title2")}
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.subhead")}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-7 py-5 sm:py-6 text-sm sm:text-base font-bold shadow-lift hover:scale-105 transition-all gap-2"
                onClick={() => {
                  soundEffects.playSuccess();
                  onStart();
                }}
              >
                <span>{t("hero.ctaPrimary")}</span>
                <ArrowRight className="h-5 w-5" />
              </Button>

              {onResume ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full px-6 py-5 sm:py-6 text-sm sm:text-base font-bold hover:bg-muted"
                  onClick={() => {
                    soundEffects.playClick();
                    onResume();
                  }}
                >
                  {t("hero.ctaResume")}
                </Button>
              ) : (
                <a
                  href="#interactive-demo"
                  onClick={() => soundEffects.playClick()}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-border/80 bg-card/80 px-6 py-3 text-sm font-bold text-foreground hover:bg-muted transition-all"
                >
                  <Play className="h-4 w-4 mr-2 text-primary" />
                  {t("hero.ctaDemo")}
                </a>
              )}
            </div>

            {/* Micro Feature Badges */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2 sm:pt-4 max-w-lg">
              <div className="rounded-2xl border border-border/60 bg-card/60 p-2.5 sm:p-3 text-center backdrop-blur-sm">
                <p className="text-lg sm:text-xl font-extrabold text-primary">{t("hero.metric3Value")}</p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground">{t("hero.metric3Label")}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-2.5 sm:p-3 text-center backdrop-blur-sm">
                <p className="text-lg sm:text-xl font-extrabold text-primary">{t("hero.metric2Value")}</p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground">{t("hero.metric2Label")}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-2.5 sm:p-3 text-center backdrop-blur-sm">
                <p className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{t("hero.metric1Value")}</p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground">{t("hero.metric1Label")}</p>
              </div>
            </div>
          </div>


          {/* Right Column: Interactive Live Mini-Demo Widget */}
          <div
            id="interactive-demo"
            className="lg:col-span-5 rounded-3xl border border-border bg-card p-6 shadow-lift relative glass-card"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Interactive Demo</h2>
                  <p className="text-[11px] text-muted-foreground">Experience a quick cognitive exercise</p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetDemo}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Reset Demo"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Demo Tabs */}
            <div className="mt-4 flex rounded-xl bg-muted/60 p-1 text-xs font-bold">
              {[
                { id: "memory" as const, label: "Memory Match" },
                { id: "stroop" as const, label: "Stroop Attention" },
                { id: "voice" as const, label: "Voice Echo" },
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
            <div className="mt-5 min-h-[210px] flex flex-col items-center justify-center text-center">
              {demoStep === "memory" && (
                <div className="space-y-4 w-full">
                  <p className="text-xs text-muted-foreground">
                    Tap the card to match with the regional Assam Tea Leaf:
                  </p>
                  <div className="flex justify-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary/40 bg-primary/10 text-3xl shadow-sm">
                      🍃
                    </div>
                    <button
                      type="button"
                      onClick={handleDemoClick}
                      className={`flex h-20 w-20 items-center justify-center rounded-2xl border-2 text-3xl transition-all ${demoFlipped
                        ? "border-emerald-500 bg-emerald-500/20 rotate-y-180"
                        : "border-dashed border-border bg-muted hover:border-primary cursor-pointer animate-pulse"
                        }`}
                    >
                      {demoFlipped ? "🍃" : "❓"}
                    </button>
                  </div>
                  {demoMatched && (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="h-4 w-4" /> Match found! +20 XP awarded.
                    </div>
                  )}
                </div>
              )}

              {demoStep === "stroop" && (
                <div className="space-y-4 w-full">
                  <p className="text-xs text-muted-foreground">
                    Tap the <strong>INK COLOR</strong>, not what the word says:
                  </p>
                  <div className="py-2 text-3xl font-extrabold text-emerald-600">
                    "RED"
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setStroopSelected("red");
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${stroopSelected === "red"
                        ? "border-rose-500 bg-rose-500/20 text-rose-700"
                        : "border-border bg-card hover:bg-muted"
                        }`}
                    >
                      Red
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playSuccess();
                        setStroopSelected("green");
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${stroopSelected === "green"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-700 font-extrabold"
                        : "border-border bg-card hover:bg-muted"
                        }`}
                    >
                      Green (Correct!)
                    </button>
                  </div>
                  {stroopSelected === "green" && (
                    <p className="text-xs font-bold text-emerald-600 animate-in fade-in">
                      ✓ Great cognitive inhibitory control!
                    </p>
                  )}
                </div>
              )}

              {demoStep === "voice" && (
                <div className="space-y-4 w-full">
                  <p className="text-xs text-muted-foreground">
                    Listen to regional voice guidance & repeat aloud:
                  </p>
                  <div className="rounded-2xl border border-border bg-muted/40 p-3 text-xs">
                    <p className="font-semibold text-foreground">
                      "আজি আপোনাৰ দিনটো কেনে গৈছে?"
                    </p>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      (How has your day been going?)
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        soundEffects.playChime();
                        speak("Aji aponar dinto kene goise?", "as-IN");
                        setVoiceSpoken(true);
                      }}
                      className="rounded-full text-xs font-bold gap-1.5"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-primary" />
                      Play Voice Sample
                    </Button>
                  </div>
                  {voiceSpoken && (
                    <p className="text-[11px] text-primary font-semibold animate-in fade-in">
                      🗣️ Voice engine ready in Assamese, Hindi, and English.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Action Footer */}
            <div className="mt-5 border-t border-border pt-4 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                No sign-in required to try full tests
              </span>
              <Button
                size="sm"
                className="rounded-full text-xs font-bold"
                onClick={() => {
                  soundEffects.playSuccess();
                  onStart();
                }}
              >
                Start Free Onboarding →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC INTERACTIVE FEATURE CAROUSEL                                   */}
      {/* ========================================================================= */}
      <section
        id="features"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Core Capabilities
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
              Engineered for real homes & field clinics
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Explore the four pillars supporting cognitive wellbeing across the North Eastern Region.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors shadow-soft"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors shadow-soft"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel Slide Viewer */}
        <div className="mt-8 relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lift">
          {(() => {
            const slide = CAROUSEL_SLIDES[currentSlide];
            const Icon = slide.icon;
            return (
              <div className="grid gap-8 lg:grid-cols-12 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {slide.tag}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {slide.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {slide.title}
                  </h3>

                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {slide.description}
                  </p>

                  <ul className="space-y-2 pt-2 text-sm text-foreground font-medium">
                    {slide.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <Button
                      onClick={() => {
                        soundEffects.playSuccess();
                        onStart();
                      }}
                      className="rounded-full px-6 font-bold"
                    >
                      Try this module <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center">
                  <div className={`relative flex h-64 w-64 sm:h-72 sm:w-72 items-center justify-center rounded-3xl border border-border bg-gradient-to-br ${slide.accent} shadow-inner`}>
                    <Icon className="h-28 w-28 text-primary animate-float" />
                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-card/90 p-3 text-center border border-border/70 backdrop-blur-md">
                      <p className="text-xs font-bold text-foreground">Active Module</p>
                      <p className="text-[11px] text-muted-foreground">{slide.tag}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Carousel Slide Indicators */}
          <div className="mt-8 flex items-center justify-center gap-2 border-t border-border/60 pt-6">
            {CAROUSEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setCurrentSlide(idx);
                }}
                className={`h-2 rounded-full transition-all ${currentSlide === idx ? "w-8 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/40"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE 8 NER STATES CULTURAL EXPLORER                             */}
      {/* ========================================================================= */}
      <section id="regional-culture" className="weave border-y border-border/80 bg-muted/20 py-20">
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

          {/* State Tabs Selector */}
          <div className="mt-10 flex gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
            {NER_STATES.map((st, idx) => (
              <button
                key={st.name}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedState(idx);
                }}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${selectedState === idx
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
              >
                <span>{st.emoji}</span>
                <span>{st.name}</span>
              </button>
            ))}
          </div>

          {/* Selected State Showcase Card */}
          {(() => {
            const state = NER_STATES[selectedState];
            return (
              <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft">
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

                  <div className="md:col-span-5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                      Screening Stimuli Samples
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {state.items.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-border/80 bg-muted/40 p-3 text-xs font-semibold text-foreground flex items-center gap-2 shadow-xs"
                        >
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. 9 COGNITIVE GAMES GALLERY                                              */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Cognitive Gym
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
            9 Interactive Brain Activities
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Targeting memory preservation, focus control, daily routine recall, and verbal fluency.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className="group rounded-3xl border border-border bg-card p-5 shadow-soft hover:shadow-lift hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${game.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {game.category}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {game.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-primary">{game.skill}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{game.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-muted-foreground">Level 1–5 Adaptive</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      soundEffects.playSuccess();
                      onStart();
                    }}
                    className="rounded-full text-xs font-bold text-primary hover:bg-primary/10 h-7 px-3"
                  >
                    Play →
                  </Button>
                </div>
              </div>
            );
          })}
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
            <article className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
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

            <article className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
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

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <blockquote
              key={review.name}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    {review.tag}
                  </span>
                  <div className="flex text-amber-500 text-xs">{"★".repeat(review.rating)}</div>
                </div>
                <p className="text-sm leading-relaxed text-foreground italic">
                  "{review.quote}"
                </p>
              </div>

              <footer className="mt-6 border-t border-border/60 pt-4">
                <p className="text-sm font-bold text-foreground">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.role}</p>
              </footer>
            </blockquote>
          ))}
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
