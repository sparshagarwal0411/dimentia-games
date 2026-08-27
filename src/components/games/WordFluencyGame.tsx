import { useEffect, useRef, useState } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { label: "Animals", words: ["cow", "dog", "cat", "goat", "hen", "duck", "elephant", "tiger", "fish", "bird", "horse", "pig", "sheep", "monkey", "deer"] },
  { label: "Foods", words: ["rice", "tea", "banana", "apple", "fish", "dal", "bread", "egg", "milk", "roti", "mango", "potato", "tomato", "chicken", "soup"] },
  { label: "Home items", words: ["cup", "chair", "bed", "fan", "lamp", "broom", "key", "clock", "plate", "spoon", "pillow", "door", "window", "bucket", "mat"] },
];

function WordRound({ onRound, roundKey, speakText }: GameProps) {
  const category = CATEGORIES[roundKey % CATEGORIES.length]!;
  const [seconds, setSeconds] = useState(25);
  const [input, setInput] = useState("");
  const [found, setFound] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const startRef = useRef(Date.now());
  const finishedRef = useRef(false);
  const foundRef = useRef<string[]>([]);

  useEffect(() => {
    setSeconds(25);
    setInput("");
    setFound([]);
    foundRef.current = [];
    setDone(false);
    finishedRef.current = false;
    startRef.current = Date.now();
    speakText(`Name ${category.label}. You have 25 seconds.`);
  }, [roundKey, category.label, speakText]);

  useEffect(() => {
    if (done) return;
    if (seconds <= 0) {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setDone(true);
      onRound({
        correct: foundRef.current.length >= 3,
        responseTime: (Date.now() - startRef.current) / 1000,
      });
      return;
    }
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [seconds, done, onRound]);

  const submitWord = () => {
    const word = input.trim().toLowerCase();
    if (!word || found.includes(word)) {
      setInput("");
      return;
    }
    const ok = category.words.some((w) => w === word || word.includes(w) || w.includes(word));
    if (ok) {
      const next = [...found, word];
      foundRef.current = next;
      setFound(next);
    }
    setInput("");
  };

  return (
    <div className="space-y-5 text-center">
      <p className="text-2xl font-semibold">Category: {category.label}</p>
      <p className="text-4xl font-black text-primary">{seconds}s</p>
      <div className="flex gap-2">
        <input
          value={input}
          disabled={done}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitWord();
          }}
          placeholder="Type a word, then Enter"
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-lg"
        />
        <Button type="button" onClick={submitWord} disabled={done}>
          Add
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Accepted words: {found.length} (need 3 to pass this round)</p>
      <div className="flex flex-wrap justify-center gap-2">
        {found.map((w) => (
          <span key={w} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

export function WordFluencyGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="word-fluency"
      title="Word garden"
      instruction="Type as many words as you can in the category."
      totalRounds={3}
      onExit={onExit}
    >
      {(props) => <WordRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
