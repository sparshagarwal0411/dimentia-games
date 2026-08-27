import { useState } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { makeEmotionRound } from "@/lib/game-content";

function EmotionRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [data] = useState(() => makeEmotionRound(difficulty));
  const [startTime] = useState<number>(Date.now());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    speakText(option);
    const isCorrect = option === data.card.answer;
    const elapsed = (Date.now() - startTime) / 1000;
    setTimeout(() => {
      onRound({ correct: isCorrect, responseTime: elapsed });
    }, 800);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft max-w-md w-full">
        <span className="text-7xl">{data.card.emoji}</span>
        <p className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
          "{data.card.situation}"
        </p>
      </div>

      <p className="text-base font-semibold text-muted-foreground">
        How is this person feeling?
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {data.options.map((option) => {
          const isSelected = selectedOption === option;
          const isAnswer = option === data.card.answer;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`tap rounded-2xl border-2 py-4 px-6 text-center text-xl font-bold transition-all ${
                isSelected
                  ? isAnswer
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                    : "border-rose-600 bg-rose-50 text-rose-900"
                  : "border-border bg-card hover:bg-muted text-foreground"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function EmotionGame() {
  return (
    <GameShell
      gameId="emotion-recognition"
      title="Emotion & Cue Recognition"
      instruction="Read the situation and choose the emotion."
      totalRounds={3}
    >
      {(props) => <EmotionRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
