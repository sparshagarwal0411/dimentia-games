import { useEffect, useState, useRef } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { shuffle } from "@/lib/game-content";
import { cn } from "@/lib/utils";
import { ScanSearch, Sparkles, Check, X } from "lucide-react";

type TargetItem = {
  emoji: string;
  name: string;
};

const SEARCH_TARGETS: TargetItem[] = [
  { emoji: "🫖", name: "Brass Teapot" },
  { emoji: "🏺", name: "Water Pot" },
  { emoji: "🧺", name: "Cane Basket" },
  { emoji: "🪘", name: "Log Drum" },
  { emoji: "🪭", name: "Hand Fan" },
  { emoji: "🪷", name: "Lotus Flower" },
  { emoji: "🦜", name: "Hornbill" },
  { emoji: "☸️", name: "Prayer Wheel" },
  { emoji: "🧣", name: "Woven Shawl" },
  { emoji: "🐟", name: "Fresh Fish" },
];

const CLUTTER_POOL = ["🌸", "🍀", "⭐", "🌙", "🍁", "🍎", "🔔", "☂️", "🪵", "🥣", "🌽", "🩴", "🍵", "🍃", "🪵", "🧵"];

function FindRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [target, setTarget] = useState<TargetItem>(SEARCH_TARGETS[0]!);
  const [grid, setGrid] = useState<string[]>([]);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Clutter size scales with difficulty: 12 (easy) to 20 (hard)
    const size = difficulty <= 1 ? 12 : difficulty <= 3 ? 16 : 20;
    const goal = SEARCH_TARGETS[roundKey % SEARCH_TARGETS.length]!;

    const others = CLUTTER_POOL.filter((d) => d !== goal.emoji);
    const cells: string[] = [];
    for (let i = 0; i < size - 1; i++) {
      cells.push(others[Math.floor(Math.random() * others.length)]!);
    }
    // Insert goal at random position
    const hideAt = Math.floor(Math.random() * size);
    cells.splice(hideAt, 0, goal.emoji);

    setTarget(goal);
    setGrid(cells);
    setPickedIdx(null);
    startTimeRef.current = Date.now();
    speakText(`Scan the room and find the ${goal.name}.`);
  }, [difficulty, roundKey, speakText]);

  const handleTap = (idx: number, emoji: string) => {
    if (pickedIdx !== null) return;
    setPickedIdx(idx);
    const correct = emoji === target.emoji;
    const elapsed = Math.max(0.5, (Date.now() - startTimeRef.current) / 1000);

    setTimeout(() => {
      onRound({ correct, responseTime: elapsed });
    }, 650);
  };

  const gridCols =
    grid.length <= 12
      ? "grid-cols-4 max-w-sm"
      : grid.length <= 16
      ? "grid-cols-4 max-w-md"
      : "grid-cols-4 sm:grid-cols-5 max-w-lg";

  return (
    <div className="space-y-6 text-center max-w-lg mx-auto">
      {/* Target Mission Spotlight Banner */}
      <div className="flex items-center justify-between rounded-3xl border border-primary/20 bg-primary/5 p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card border-2 border-primary/40 shadow-soft text-4xl animate-bounce">
            {target.emoji}
          </div>
          <div className="text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1">
              <ScanSearch className="h-3 w-3" /> Target to Locate
            </span>
            <p className="text-lg font-black text-foreground">{target.name}</p>
          </div>
        </div>

        <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
          {grid.length} items
        </span>
      </div>

      {/* Clutter Grid Search Field */}
      <div className={cn("grid gap-2.5 sm:gap-3 mx-auto", gridCols)}>
        {grid.map((emoji, idx) => {
          const isTarget = emoji === target.emoji;
          const isSelected = pickedIdx === idx;

          let btnClass = "border-border/80 bg-card hover:bg-muted/70 hover:border-primary/40 hover:scale-105";
          if (pickedIdx !== null) {
            if (isSelected) {
              btnClass = isTarget
                ? "border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/40 scale-110 shadow-lift"
                : "border-rose-500 bg-rose-500/20 ring-2 ring-rose-500/40 scale-95 shadow-sm";
            } else if (isTarget) {
              // Highlight where target was if missed
              btnClass = "border-emerald-500/60 bg-emerald-500/10 animate-pulse";
            } else {
              btnClass = "opacity-30 border-border bg-muted";
            }
          }

          return (
            <button
              key={`${emoji}-${idx}`}
              type="button"
              disabled={pickedIdx !== null}
              onClick={() => handleTap(idx, emoji)}
              className={cn(
                "tap group relative flex h-14 sm:h-16 items-center justify-center rounded-2xl border-2 text-2xl sm:text-3xl transition-all duration-200 shadow-soft select-none",
                btnClass
              )}
            >
              <span className="filter drop-shadow-sm group-hover:scale-110 transition-transform">
                {emoji}
              </span>

              {isSelected && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-white text-xs font-bold shadow-sm">
                  {isTarget ? (
                    <span className="bg-emerald-500 h-full w-full rounded-full flex items-center justify-center">✓</span>
                  ) : (
                    <span className="bg-rose-500 h-full w-full rounded-full flex items-center justify-center">✕</span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs font-medium text-muted-foreground">
        Spot the hidden target object in the visual array as swiftly as possible.
      </p>
    </div>
  );
}

export function FindItGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="find-it"
      title="Visual Search Explorer"
      categoryName="Visual Attention"
      instruction="Scan the crowded grid and tap the target cultural item."
      totalRounds={4}
      onExit={onExit}
    >
      {(props) => <FindRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
