import { useEffect, useState } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { itemsForRegion, shuffle, type CultureItem } from "@/lib/game-content";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

type Card = CultureItem & { id: string; flipped: boolean; matched: boolean };

function MemoryMatchRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const { activePatient } = useApp();
  const region = activePatient?.region || "Assam";

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [isBusy, setIsBusy] = useState<boolean>(false);

  useEffect(() => {
    // Determine pair count based on difficulty
    const pairCount = difficulty <= 1 ? 2 : difficulty <= 3 ? 3 : 4;
    const pool = itemsForRegion(region);
    const selected = shuffle(pool).slice(0, pairCount);

    const doubled: Card[] = [];
    selected.forEach((item, idx) => {
      doubled.push({ ...item, id: `${idx}-a`, flipped: false, matched: false });
      doubled.push({ ...item, id: `${idx}-b`, flipped: false, matched: false });
    });

    setCards(shuffle(doubled));
    setFlippedIds([]);
    setIsBusy(false);
  }, [difficulty, roundKey, region]);

  const handleCardClick = (card: Card) => {
    if (isBusy || card.flipped || card.matched || flippedIds.length >= 2) return;

    speakText(card.title);
    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c)),
    );

    if (nextFlipped.length === 2) {
      setIsBusy(true);
      const [firstId, secondId] = nextFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.title === secondCard.title) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.title === firstCard.title ? { ...c, matched: true } : c,
            ),
          );
          setFlippedIds([]);
          setIsBusy(false);

          // Check if round complete
          const remaining = cards.filter(
            (c) => !c.matched && c.title !== firstCard.title,
          );
          if (remaining.length === 0) {
            const elapsed = (Date.now() - startTime) / 1000;
            onRound({ correct: true, responseTime: elapsed });
          }
        }, 600);
      } else {
        // Not a match
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
        }, 1000);
      }
    }
  };

  const gridCols =
    cards.length <= 4
      ? "grid-cols-2"
      : cards.length <= 6
      ? "grid-cols-3"
      : "grid-cols-4";

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className={cn("grid gap-4 w-full max-w-lg", gridCols)}>
        {cards.map((card) => {
          const isOpen = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card)}
              disabled={card.matched || isBusy}
              className={cn(
                "tap flex h-28 flex-col items-center justify-center rounded-2xl border-2 text-center transition-all duration-300 shadow-soft",
                isOpen
                  ? "border-primary bg-card"
                  : "border-border bg-muted hover:bg-secondary/40",
              )}
            >
              {isOpen ? (
                <>
                  <span className="text-4xl">{card.emoji}</span>
                  <span className="mt-1 text-xs font-bold text-foreground">
                    {card.title}
                  </span>
                </>
              ) : (
                <span className="text-3xl text-muted-foreground opacity-60">
                  🌿
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-sm font-semibold text-muted-foreground">
        Match pairs of North Eastern everyday objects
      </p>
    </div>
  );
}

export function MemoryMatchGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="memory-match"
      title="Cultural Memory Match"
      instruction="Tap a card to reveal, then find its matching pair."
      totalRounds={3}
      onExit={onExit}
    >
      {(props) => <MemoryMatchRound {...props} />}
    </GameShell>
  );
}
