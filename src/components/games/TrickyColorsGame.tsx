import { useEffect, useState, useRef } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { shuffle } from "@/lib/game-content";
import { cn } from "@/lib/utils";
import { Zap, Check, X, ShieldAlert } from "lucide-react";

type ColorItem = {
  name: string;
  hex: string;
  bgHex: string;
};

const STROOP_PALETTE: ColorItem[] = [
  { name: "Red", hex: "#ef4444", bgHex: "bg-red-500" },
  { name: "Blue", hex: "#3b82f6", bgHex: "bg-blue-500" },
  { name: "Green", hex: "#10b981", bgHex: "bg-emerald-500" },
  { name: "Yellow", hex: "#eab308", bgHex: "bg-yellow-500" },
  { name: "Purple", hex: "#8b5cf6", bgHex: "bg-purple-500" },
  { name: "Orange", hex: "#f97316", bgHex: "bg-orange-500" },
];

function ColorsRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [wordItem, setWordItem] = useState<ColorItem>(STROOP_PALETTE[0]!);
  const [inkItem, setInkItem] = useState<ColorItem>(STROOP_PALETTE[1]!);
  const [options, setOptions] = useState<ColorItem[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Generate Stroop conflict: Word says X, Ink is Y (where X != Y)
    const word = STROOP_PALETTE[Math.floor(Math.random() * STROOP_PALETTE.length)]!;
    let ink = STROOP_PALETTE[Math.floor(Math.random() * STROOP_PALETTE.length)]!;
    while (ink.name === word.name) {
      ink = STROOP_PALETTE[Math.floor(Math.random() * STROOP_PALETTE.length)]!;
    }

    const count = difficulty <= 2 ? 3 : 4;
    const others = shuffle(STROOP_PALETTE.filter((c) => c.name !== ink.name)).slice(0, count - 1);
    const roundOptions = shuffle([ink, ...others]);

    setWordItem(word);
    setInkItem(ink);
    setOptions(roundOptions);
    setPicked(null);
    startTimeRef.current = Date.now();
    speakText("Tap the ink color, ignore the word text.");
  }, [difficulty, roundKey, speakText]);

  const choose = (choice: ColorItem) => {
    if (picked) return;
    setPicked(choice.name);
    const correct = choice.name === inkItem.name;
    const elapsed = Math.max(0.3, (Date.now() - startTimeRef.current) / 1000);

    setTimeout(() => {
      onRound({ correct, responseTime: elapsed });
    }, 600);
  };

  return (
    <div className="space-y-6 text-center max-w-lg mx-auto">
      {/* Visual Instruction Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
        <ShieldAlert className="h-3.5 w-3.5" />
        Override the reflex: Name the INK COLOR!
      </div>

      {/* High-Impact Stroop Centerpiece */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-border/80 bg-card py-12 px-6 shadow-lift transition-all">
        <div className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/60">
          Incongruent Stimulus
        </div>
        <p
          className="text-5xl sm:text-7xl font-black tracking-widest filter drop-shadow-sm select-none transition-transform"
          style={{ color: inkItem.hex }}
        >
          {wordItem.name.toUpperCase()}
        </p>
      </div>

      {/* Answer Pads: Neutral high-contrast option buttons with color swatches */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {options.map((option) => {
          const isSelected = picked === option.name;
          const isCorrect = option.name === inkItem.name;

          let btnClass = "border-border/80 bg-card hover:bg-muted/70 hover:border-primary/40 hover:-translate-y-0.5";
          if (picked) {
            if (isSelected) {
              btnClass = isCorrect
                ? "border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30"
                : "border-rose-500 bg-rose-500/15 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30";
            } else if (isCorrect) {
              btnClass = "border-emerald-500/60 bg-emerald-500/10";
            } else {
              btnClass = "opacity-40 border-border bg-muted";
            }
          }

          return (
            <button
              key={option.name}
              type="button"
              disabled={Boolean(picked)}
              onClick={() => choose(option)}
              className={cn(
                "tap flex items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left font-bold transition-all duration-200 shadow-soft",
                btnClass
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-5 w-5 rounded-full border border-black/10 shadow-sm shrink-0"
                  style={{ backgroundColor: option.hex }}
                />
                <span className="text-base sm:text-lg text-foreground font-black">
                  {option.name}
                </span>
              </div>

              {isSelected && (
                <span>
                  {isCorrect ? (
                    <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <X className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TrickyColorsGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="tricky-colors"
      title="Stroop Speed Reaction"
      categoryName="Inhibitory Control"
      instruction="Tap the ink color of the letters, ignoring what the word reads."
      totalRounds={5}
      onExit={onExit}
    >
      {(props) => <ColorsRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
