import { useState } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { makeRoutine, type RoutineStep } from "@/lib/game-content";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function RoutineRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [data] = useState(() => makeRoutine(difficulty));
  const [userOrder, setUserOrder] = useState<RoutineStep[]>([]);
  const [startTime] = useState<number>(Date.now());

  const handlePick = (step: RoutineStep) => {
    if (userOrder.some((s) => s.label === step.label)) return;
    speakText(step.label);
    const next = [...userOrder, step];
    setUserOrder(next);
  };

  const handleRemove = (label: string) => {
    setUserOrder((prev) => prev.filter((s) => s.label !== label));
  };

  const handleSubmit = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    const isCorrect = userOrder.every((step, idx) => step.label === data.correct[idx]?.label);
    onRound({ correct: isCorrect, responseTime: elapsed });
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <p className="text-base text-muted-foreground text-center">
        Tap the activities in the correct order from morning to evening:
      </p>

      {/* Selected Sequence */}
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-3xl border border-primary/30 bg-secondary/40 p-5 min-h-[90px] w-full max-w-lg">
        {userOrder.length === 0 ? (
          <span className="text-sm font-semibold text-muted-foreground">
            Tap activities below to arrange them here...
          </span>
        ) : (
          userOrder.map((step, idx) => (
            <button
              key={step.label}
              type="button"
              onClick={() => handleRemove(step.label)}
              className="tap flex items-center gap-2 rounded-xl bg-card border border-border px-3 py-2 text-sm font-bold shadow-soft"
            >
              <span className="text-xs font-extrabold text-primary">{idx + 1}.</span>
              <span>{step.emoji}</span>
              <span>{step.label}</span>
            </button>
          ))
        )}
      </div>

      {/* Choice Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg sm:grid-cols-3">
        {data.scrambled.map((step) => {
          const isChosen = userOrder.some((s) => s.label === step.label);
          return (
            <button
              key={step.label}
              type="button"
              disabled={isChosen}
              onClick={() => handlePick(step)}
              className={`tap flex flex-col items-center justify-center rounded-2xl border-2 p-4 text-center transition-all ${
                isChosen
                  ? "opacity-40 border-border bg-muted cursor-not-allowed"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <span className="text-4xl">{step.emoji}</span>
              <span className="mt-2 text-sm font-semibold text-foreground">{step.label}</span>
              <span className="text-xs text-muted-foreground font-medium">{step.time}</span>
            </button>
          );
        })}
      </div>

      {userOrder.length === data.correct.length && (
        <Button
          size="lg"
          onClick={handleSubmit}
          className="tap gap-2 text-lg font-bold w-full max-w-xs bg-primary text-primary-foreground"
        >
          Check Sequence <ArrowRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

export function RoutineRecallGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="routine-recall"
      title="Daily Routine & Spatial Recall"
      instruction="Order daily activities in the correct chronological sequence."
      totalRounds={3}
      onExit={onExit}
    >
      {(props) => <RoutineRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
