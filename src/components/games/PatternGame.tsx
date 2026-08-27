import { useState } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { makePattern, type PatternToken } from "@/lib/game-content";

function PatternRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [data] = useState(() => makePattern(difficulty));
  const [startTime] = useState<number>(Date.now());
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: PatternToken) => {
    if (selected) return;
    setSelected(option.emoji);
    speakText(option.label);
    const correct = option.emoji === data.answer.emoji;
    const elapsed = (Date.now() - startTime) / 1000;
    setTimeout(() => {
      onRound({ correct, responseTime: elapsed });
    }, 800);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Pattern sequence line */}
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-3xl border border-border bg-muted/60 p-6 shadow-soft">
        {data.sequence.map((item, index) => (
          <div
            key={index}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-3xl shadow-soft"
          >
            {item.emoji}
          </div>
        ))}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-secondary/50 text-2xl font-bold text-primary">
          ?
        </div>
      </div>

      <p className="text-lg font-semibold text-foreground">
        Which symbol comes next in the pattern?
      </p>

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md sm:grid-cols-3">
        {data.options.map((option) => {
          const isSelected = selected === option.emoji;
          return (
            <button
              key={option.emoji}
              type="button"
              onClick={() => handleSelect(option)}
              className={`tap flex flex-col items-center justify-center rounded-2xl border-2 p-5 text-center transition-all ${
                isSelected
                  ? option.emoji === data.answer.emoji
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                    : "border-rose-600 bg-rose-50 text-rose-900"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <span className="text-4xl">{option.emoji}</span>
              <span className="mt-2 text-sm font-semibold">{option.label}</span>
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
      gameId="pattern-recognition"
      title="Pattern & Sequence Trail"
      instruction="Look at the repeating pattern and pick the missing symbol."
      totalRounds={4}
      onExit={onExit}
    >
      {(props) => <PatternRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
