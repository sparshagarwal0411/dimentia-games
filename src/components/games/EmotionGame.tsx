import { useState, useRef } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { makeEmotionRound } from "@/lib/game-content";
import { Heart, Sparkles, Check, X, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";

function EmotionRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [data] = useState(() => makeEmotionRound(difficulty, roundKey));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    speakText(option);
    const isCorrect = option === data.card.answer;
    const elapsed = Math.max(0.5, (Date.now() - startTimeRef.current) / 1000);

    setTimeout(() => {
      onRound({ correct: isCorrect, responseTime: elapsed });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center space-y-6 max-w-lg mx-auto text-center">
      {/* Relatable Social Scenario Card (No spoiler emoji!) */}
      <div className="w-full rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card via-card to-rose-500/5 p-6 sm:p-8 shadow-soft">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-400 mb-3">
          <MessageSquareQuote className="h-3.5 w-3.5" />
          <span>Scenario involving {data.card.speaker}</span>
        </div>

        <p className="text-lg sm:text-xl font-black text-foreground leading-relaxed">
          “{data.card.situation}”
        </p>

        <p className="mt-3 text-xs text-muted-foreground font-semibold">
          Context: {data.card.nuanceContext}
        </p>
      </div>

      <p className="text-sm font-bold text-foreground">
        How is {data.card.speaker} most likely feeling in this moment?
      </p>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {data.options.map((option) => {
          const isSelected = selectedOption === option;
          const isAnswer = option === data.card.answer;

          let btnClass = "border-border/80 bg-card hover:bg-muted/70 hover:border-primary/40 hover:-translate-y-0.5";
          if (selectedOption) {
            if (isSelected) {
              btnClass = isAnswer
                ? "border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30"
                : "border-rose-500 bg-rose-500/15 text-rose-950 dark:text-rose-200 ring-2 ring-rose-500/30";
            } else if (isAnswer) {
              btnClass = "border-emerald-500/60 bg-emerald-500/10";
            } else {
              btnClass = "opacity-40 border-border bg-muted";
            }
          }

          return (
            <button
              key={option}
              type="button"
              disabled={Boolean(selectedOption)}
              onClick={() => handleSelect(option)}
              className={cn(
                "tap flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left font-bold text-base transition-all duration-200 shadow-soft",
                btnClass
              )}
            >
              <span>{option}</span>
              {isSelected && (
                <span>
                  {isAnswer ? (
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

      {selectedOption && (
        <div className="rounded-2xl bg-muted/60 p-3.5 border border-border text-xs text-muted-foreground animate-in fade-in duration-300">
          <span className="font-bold text-foreground">Clinical insight: </span>
          {data.card.explanation}
        </div>
      )}
    </div>
  );
}

export function EmotionGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="emotion-recognition"
      title="Emotion & Social Cues"
      categoryName="Social Cognition"
      instruction="Read the real-life family situation and determine the person's emotional state."
      totalRounds={3}
      onExit={onExit}
    >
      {(props) => <EmotionRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
