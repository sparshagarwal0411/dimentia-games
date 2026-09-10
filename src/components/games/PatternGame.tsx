import { useState, useRef } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { makePattern, type PatternToken } from "@/lib/game-content";
import { ArrowRight, HelpCircle, Sparkles, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

function PatternRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [data] = useState(() => makePattern(difficulty, roundKey));
  const startTimeRef = useRef<number>(Date.now());
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: PatternToken) => {
    if (selected) return;
    setSelected(option.emoji);
    speakText(option.label);
    const correct = option.emoji === data.answer.emoji;
    const elapsed = Math.max(0.5, (Date.now() - startTimeRef.current) / 1000);

    setTimeout(() => {
      onRound({ correct, responseTime: elapsed });
    }, 700);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Visual Pattern Trail Runway */}
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between px-2 mb-2 text-xs font-bold text-muted-foreground">
          <span>Observed Sequence</span>
          <span className="text-primary flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Deduce the Rule
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 rounded-3xl border border-border/80 bg-gradient-to-r from-muted/60 via-card to-muted/60 p-5 sm:p-7 shadow-soft">
          {data.sequence.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="flex h-16 w-16 sm:h-20 sm:w-20 flex-col items-center justify-center rounded-2xl border-2 border-border/80 bg-card p-2 shadow-soft hover:scale-105 transition-all"
                title={item.label}
              >
                <span className="text-3xl sm:text-4xl filter drop-shadow-sm">{item.emoji}</span>
                <span className="mt-1 text-[9px] font-bold text-muted-foreground truncate max-w-[60px]">
                  {item.label}
                </span>
              </div>
              {index < data.sequence.length - 1 && (
                <span className="text-muted-foreground/40 font-bold hidden sm:inline">→</span>
              )}
            </div>
          ))}

          {/* Missing Step Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold hidden sm:inline">→</span>
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-primary/10 shadow-soft animate-pulse">
              <HelpCircle className="h-7 w-7 text-primary" />
              <span className="mt-1 text-[9px] font-extrabold text-primary uppercase">
                Next?
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm sm:text-base font-bold text-foreground text-center">
        Which cultural symbol comes next in this sequence rule?
      </p>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md sm:grid-cols-4">
        {data.options.map((option) => {
          const isSelected = selected === option.emoji;
          const isAnswer = option.emoji === data.answer.emoji;

          let btnStyle = "border-border/80 bg-card hover:bg-muted/70 hover:border-primary/40 hover:-translate-y-0.5";
          if (selected) {
            if (isSelected) {
              btnStyle = isAnswer
                ? "border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30"
                : "border-rose-500 bg-rose-500/15 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30";
            } else if (isAnswer) {
              btnStyle = "border-emerald-500/60 bg-emerald-500/10 opacity-90";
            } else {
              btnStyle = "opacity-40 border-border bg-muted";
            }
          }

          return (
            <button
              key={option.emoji}
              type="button"
              disabled={Boolean(selected)}
              onClick={() => handleSelect(option)}
              className={cn(
                "tap group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 text-center transition-all duration-200 shadow-soft",
                btnStyle
              )}
            >
              <span className="text-3xl sm:text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                {option.emoji}
              </span>
              <span className="mt-2 text-xs font-bold text-foreground tracking-tight line-clamp-1">
                {option.label}
              </span>

              {isSelected && (
                <span className="absolute top-2 right-2">
                  {isAnswer ? (
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <X className="h-4 w-4 text-rose-600 dark:text-rose-400" />
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

export function PatternGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="pattern"
      title="Pattern Trail Matrix"
      categoryName="Inductive Logic"
      instruction="Examine the repeating sequence rule, then pick the missing symbol."
      totalRounds={4}
      onExit={onExit}
    >
      {(props) => <PatternRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
