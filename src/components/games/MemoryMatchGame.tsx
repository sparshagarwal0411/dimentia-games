import { useEffect, useState, useRef } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { itemsForRegion, shuffle, type CultureItem } from "@/lib/game-content";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import { Sparkles, Eye } from "lucide-react";

type Card = CultureItem & {
  id: string;
  pairKey: string;
  flipped: boolean;
  matched: boolean;
};

function MemoryMatchRound({ difficulty, onRound, speakText }: GameProps) {
  const { activePatient } = useApp();
  const region = activePatient?.region || "Assam";

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());
  const initialMountRef = useRef<boolean>(false);

  useEffect(() => {
    // Number of pairs scales from 2 (easy) to 4 (expert)
    const pairCount = difficulty <= 1 ? 2 : difficulty <= 3 ? 3 : 4;
    const pool = itemsForRegion(region);
    const selected = shuffle(pool).slice(0, pairCount);

    const deck: Card[] = [];
    selected.forEach((item, idx) => {
      deck.push({
        ...item,
        id: `${idx}-a`,
        pairKey: item.title,
        flipped: false,
        matched: false,
      });
      deck.push({
        ...item,
        id: `${idx}-b`,
        pairKey: item.title,
        flipped: false,
        matched: false,
      });
    });

    setCards(shuffle(deck));
    setFlippedIds([]);
    setMoves(0);
    setIsBusy(false);
    startTimeRef.current = Date.now();
    initialMountRef.current = true;
  }, [difficulty, region]);

  const handleCardClick = (card: Card) => {
    if (isBusy || card.flipped || card.matched || flippedIds.length >= 2) return;

    speakText(card.title);
    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c)),
    );

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsBusy(true);
      const [firstId, secondId] = nextFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairKey === secondCard.pairKey) {
        // Matched!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairKey === firstCard.pairKey ? { ...c, matched: true } : c,
            ),
          );
          setFlippedIds([]);
          setIsBusy(false);

          // Check if round complete
          const remaining = cards.filter(
            (c) => !c.matched && c.pairKey !== firstCard.pairKey,
          );
          if (remaining.length === 0) {
            const elapsed = Math.max(1, (Date.now() - startTimeRef.current) / 1000);
            const optimalMoves = cards.length / 2;
            const accuracyScore = Math.min(1, optimalMoves / Math.max(optimalMoves, moves + 1));
            onRound({ correct: accuracyScore >= 0.5, responseTime: elapsed });
          }
        }, 500);
      } else {
        // Mismatch
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, flipped: false }
                : c,
            ),
          );
          setFlippedIds([]);
          setIsBusy(false);
        }, 850);
      }
    }
  };

  const matchedCount = cards.filter((c) => c.matched).length / 2;
  const totalPairs = cards.length / 2;

  const gridCols =
    cards.length <= 4
      ? "grid-cols-2 max-w-sm"
      : cards.length <= 6
      ? "grid-cols-3 max-w-md"
      : "grid-cols-2 sm:grid-cols-4 max-w-lg";

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Session mini stats bar */}
      <div className="flex items-center justify-between w-full max-w-lg px-2 text-xs font-bold text-muted-foreground">
        <span className="flex items-center gap-1.5 text-primary">
          <Eye className="h-4 w-4" />
          <span>Matched: {matchedCount} / {totalPairs} pairs</span>
        </span>
        <span className="bg-muted px-2.5 py-1 rounded-full">
          Flips: {moves} moves
        </span>
      </div>

      {/* 3D Interactive Card Grid */}
      <div className={cn("grid gap-3 sm:gap-4 w-full mx-auto", gridCols)}>
        {cards.map((card) => {
          const isOpen = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card)}
              disabled={card.matched || isBusy}
              aria-label={isOpen ? card.title : "Unrevealed card"}
              className={cn(
                "group relative h-28 sm:h-32 rounded-3xl border-2 p-2 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-soft select-none",
                isOpen
                  ? card.matched
                    ? "border-emerald-500/60 bg-emerald-500/10 scale-[0.98]"
                    : "border-primary bg-card scale-100 shadow-lift ring-2 ring-primary/20"
                  : "border-border/80 bg-gradient-to-br from-muted via-card to-muted/80 hover:border-primary/50 hover:shadow-lift hover:-translate-y-0.5 active:scale-95"
              )}
            >
              {isOpen ? (
                <div className="flex flex-col items-center animate-in zoom-in-75 duration-200">
                  <span className="text-4xl sm:text-5xl filter drop-shadow-sm">{card.emoji}</span>
                  <span className="mt-1.5 text-xs font-black text-foreground tracking-tight line-clamp-1">
                    {card.title}
                  </span>
                  {card.matched && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-0.5">
                      <Sparkles className="h-2.5 w-2.5" /> Matched
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-base">
                    🌿
                  </div>
                  <span className="mt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Tap
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs font-medium text-muted-foreground text-center">
        Memorize positions and match pairs of authentic North Eastern artifacts and foods.
      </p>
    </div>
  );
}

export function MemoryMatchGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="memory-match"
      title="Cultural Memory Match"
      categoryName="Visual Memory"
      instruction="Tap any card to reveal, then find its matching cultural partner."
      totalRounds={3}
      onExit={onExit}
    >
      {(props) => <MemoryMatchRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
