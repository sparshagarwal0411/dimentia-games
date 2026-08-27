import { useEffect, useState } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { shuffle } from "@/lib/game-content";
import { cn } from "@/lib/utils";

const DISTRACTORS = ["🌸", "🍀", "⭐", "🌙", "🍁", "🍎", "🔔", "☂️", "🪵", "🫖", "🧺", "🐟"];

function FindRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [target, setTarget] = useState("🫖");
  const [grid, setGrid] = useState<string[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const size = difficulty <= 2 ? 12 : 16;
    const goal = DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)]!;
    const others = DISTRACTORS.filter((d) => d !== goal);
    const cells = Array.from({ length: size }, () => others[Math.floor(Math.random() * others.length)]!);
    const hideAt = Math.floor(Math.random() * size);
    cells[hideAt] = goal;
    setTarget(goal);
    setGrid(shuffle(cells));
    setPicked(null);
    setStartTime(Date.now());
    speakText("Find the odd object in the grid.");
  }, [difficulty, roundKey, speakText]);

  const tap = (idx: number, emoji: string) => {
    if (picked !== null) return;
    setPicked(idx);
    onRound({ correct: emoji === target, responseTime: (Date.now() - startTime) / 1000 });
  };

  return (
    <div className="space-y-5 text-center">
      <p className="text-lg">
        Find this: <span className="text-4xl align-middle">{target}</span>
      </p>
      <div className={cn("grid gap-2 mx-auto max-w-md", grid.length > 12 ? "grid-cols-4" : "grid-cols-4")}>
        {grid.map((emoji, idx) => (
          <button
            key={`${emoji}-${idx}`}
            type="button"
            onClick={() => tap(idx, emoji)}
            className={cn(
              "tap flex h-16 items-center justify-center rounded-xl border bg-card text-3xl shadow-soft",
              picked === idx ? (emoji === target ? "border-emerald-500" : "border-rose-500") : "border-border",
            )}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FindItGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="find-it"
      title="Let's find it"
      instruction="Scan the grid and tap the hidden object."
      totalRounds={4}
      onExit={onExit}
    >
      {(props) => <FindRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
