import { useEffect, useState } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { shuffle } from "@/lib/game-content";
import { cn } from "@/lib/utils";

type Face = { id: string; emoji: string; name: string };

const FACES: Omit<Face, "id">[] = [
  { emoji: "😊", name: "Happy" },
  { emoji: "😌", name: "Calm" },
  { emoji: "😮", name: "Surprised" },
  { emoji: "😢", name: "Sad" },
  { emoji: "😠", name: "Cross" },
  { emoji: "😴", name: "Sleepy" },
];

type Card = Face & { flipped: boolean; matched: boolean };

function FaceRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const pairCount = difficulty <= 2 ? 3 : 4;
    const selected = shuffle(FACES).slice(0, pairCount);
    const doubled: Card[] = [];
    selected.forEach((face, idx) => {
      doubled.push({ ...face, id: `${idx}-a`, flipped: false, matched: false });
      doubled.push({ ...face, id: `${idx}-b`, flipped: false, matched: false });
    });
    setCards(shuffle(doubled));
    setFlippedIds([]);
    setBusy(false);
  }, [difficulty, roundKey]);

  const clickCard = (card: Card) => {
    if (busy || card.flipped || card.matched || flippedIds.length >= 2) return;
    speakText(card.name);
    const next = [...flippedIds, card.id];
    setFlippedIds(next);
    setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c)));

    if (next.length === 2) {
      setBusy(true);
      const [a, b] = next;
      const first = cards.find((c) => c.id === a);
      const second = cards.find((c) => c.id === b);
      if (first && second && first.name === second.name) {
        setTimeout(() => {
          const remaining = cards.filter((c) => !c.matched && c.name !== first.name);
          setCards((prev) => prev.map((c) => (c.name === first.name ? { ...c, matched: true } : c)));
          setFlippedIds([]);
          setBusy(false);
          if (remaining.length === 0) onRound({ correct: true, responseTime: (Date.now() - startTime) / 1000 });
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)),
          );
          setFlippedIds([]);
          setBusy(false);
        }, 900);
      }
    }
  };

  return (
    <div className={cn("grid w-full max-w-lg gap-3 mx-auto", cards.length > 6 ? "grid-cols-4" : "grid-cols-3")}>
      {cards.map((card) => {
        const open = card.flipped || card.matched;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => clickCard(card)}
            className={cn(
              "tap flex h-24 flex-col items-center justify-center rounded-2xl border-2 shadow-soft",
              open ? "border-primary bg-card" : "border-border bg-muted",
            )}
          >
            {open ? (
              <>
                <span className="text-4xl">{card.emoji}</span>
                <span className="mt-1 text-xs font-bold">{card.name}</span>
              </>
            ) : (
              <span className="text-2xl text-muted-foreground">🙂</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function FaceMatchGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="face-match"
      title="Face recognition"
      instruction="Find two matching faces. Names help if you like to say them aloud."
      totalRounds={3}
      onExit={onExit}
    >
      {(props) => <FaceRound {...props} />}
    </GameShell>
  );
}
