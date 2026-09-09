import { useState, useRef } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { makeRoutine, type RoutineStep } from "@/lib/game-content";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, RotateCcw, Calendar, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

function RoutineRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [data] = useState(() => makeRoutine(difficulty, roundKey));
  const [userOrder, setUserOrder] = useState<RoutineStep[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());

  const handlePick = (step: RoutineStep) => {
    if (submitted) return;
    if (userOrder.some((s) => s.label === step.label)) return;
    speakText(step.label);
    setUserOrder((prev) => [...prev, step]);
  };

  const handleRemove = (label: string) => {
    if (submitted) return;
    setUserOrder((prev) => prev.filter((s) => s.label !== label));
  };

  const handleReset = () => {
    if (submitted) return;
    setUserOrder([]);
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const elapsed = Math.max(1, (Date.now() - startTimeRef.current) / 1000);

    // Evaluate how many items are in correct chronological order
    const correctCount = userOrder.filter(
      (step, idx) => step.order === data.correct[idx]?.order
    ).length;
    const isSuccess = correctCount === data.correct.length;

    setTimeout(() => {
      onRound({ correct: isSuccess, responseTime: elapsed });
    }, 1300);
  };

  return (
    <div className="flex flex-col items-center space-y-6 max-w-xl mx-auto">
      {/* Story & Theme Card */}
      <div className="w-full rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-0.5 text-xs font-bold text-primary mb-1">
          <Calendar className="h-3.5 w-3.5" /> Scenario: {data.theme}
        </span>
        <p className="text-xs sm:text-sm text-foreground/80 font-medium mt-1">
          {data.story}
        </p>
      </div>

      {/* Interactive Timeline Ribbon */}
      <div className="w-full">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-2 mb-2">
          <span>Your Arranged Timeline ({userOrder.length}/{data.correct.length})</span>
          {userOrder.length > 0 && !submitted && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Clear all
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2.5 rounded-3xl border-2 border-dashed border-primary/30 bg-muted/40 p-4 min-h-[90px] w-full">
          {userOrder.length === 0 ? (
            <p className="text-xs text-muted-foreground italic w-full text-center py-4">
              Tap the activity cards below in chronological order from morning to night.
            </p>
          ) : (
            userOrder.map((step, idx) => {
              const isCorrectPosition = submitted && step.order === data.correct[idx]?.order;
              return (
                <button
                  key={step.label}
                  type="button"
                  disabled={submitted}
                  onClick={() => handleRemove(step.label)}
                  className={cn(
                    "tap flex items-center gap-2 rounded-2xl border-2 px-3.5 py-2 text-xs font-bold transition-all shadow-sm",
                    submitted
                      ? isCorrectPosition
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200"
                        : "border-rose-500 bg-rose-500/15 text-rose-950 dark:text-rose-200"
                      : "border-border/80 bg-card hover:border-destructive/40 text-foreground"
                  )}
                  title={submitted ? (isCorrectPosition ? "Correct position" : "Wrong position") : "Tap to remove"}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-black">
                    {idx + 1}
                  </span>
                  <span className="text-base">{step.emoji}</span>
                  <span className="truncate max-w-[130px]">{step.label}</span>
                  {submitted && (
                    <span>
                      {isCorrectPosition ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                      )}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Choice Options Grid */}
      <div className="w-full">
        <p className="text-xs font-bold text-muted-foreground px-2 mb-2">
          Available Daily Activities:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {data.scrambled.map((step) => {
            const isChosen = userOrder.some((s) => s.label === step.label);
            return (
              <button
                key={step.label}
                type="button"
                disabled={isChosen || submitted}
                onClick={() => handlePick(step)}
                className={cn(
                  "tap flex items-center gap-3.5 rounded-2xl border-2 p-3 text-left transition-all duration-200 shadow-soft",
                  isChosen
                    ? "opacity-35 border-border bg-muted cursor-not-allowed"
                    : "border-border/80 bg-card hover:border-primary/50 hover:bg-muted/60 hover:-translate-y-0.5"
                )}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl shadow-sm">
                  {step.emoji}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-foreground truncate">{step.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{step.context}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submission Action */}
      {userOrder.length === data.correct.length && !submitted && (
        <div className="pt-2 w-full flex justify-center animate-in zoom-in-95 duration-200">
          <Button
            size="lg"
            onClick={handleSubmit}
            className="tap rounded-2xl px-8 font-bold text-base bg-primary text-primary-foreground shadow-soft gap-2"
          >
            <span>Verify Chronological Order</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {submitted && (
        <p className="text-xs font-bold text-primary animate-pulse text-center">
          Analyzing sequence timeline...
        </p>
      )}
    </div>
  );
}

export function RoutineRecallGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="routine-recall"
      title="Daily Routine Chrono"
      categoryName="Temporal Memory"
      instruction="Order the day's routine activities from morning to evening."
      totalRounds={3}
      onExit={onExit}
    >
      {(props) => <RoutineRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
