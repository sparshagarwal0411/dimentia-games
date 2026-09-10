import { useEffect, useRef, useState } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { Button } from "@/components/ui/button";
import { CATEGORIES_LEXICON, isWordValid } from "@/lib/game-content";
import { Sparkles, CheckCircle2, ArrowRight, Clock, Plus, Tag } from "lucide-react";
import { soundEffects } from "@/lib/audio-effects";
import { cn } from "@/lib/utils";

const CATEGORY_KEYS = ["animals", "foods", "household", "nature"];

function WordRound({ onRound, roundKey, speakText }: GameProps) {
  const categoryKey = CATEGORY_KEYS[roundKey % CATEGORY_KEYS.length]!;
  const category = CATEGORIES_LEXICON[categoryKey]!;

  const [seconds, setSeconds] = useState(30);
  const [input, setInput] = useState("");
  const [found, setFound] = useState<string[]>([]);
  const [inputError, setInputError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const startRef = useRef(Date.now());
  const finishedRef = useRef(false);
  const foundRef = useRef<string[]>([]);

  useEffect(() => {
    setSeconds(30);
    setInput("");
    setFound([]);
    setInputError(null);
    foundRef.current = [];
    setDone(false);
    finishedRef.current = false;
    startRef.current = Date.now();
    speakText(`Name items in ${category.label}. Type as many as you can.`);
  }, [roundKey, category.label, speakText]);

  // Gentle countdown timer
  useEffect(() => {
    if (done) return;
    if (seconds <= 0) {
      finishRound();
      return;
    }
    const timer = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, done]);

  const finishRound = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setDone(true);
    const elapsed = Math.max(1, (Date.now() - startRef.current) / 1000);
    const success = foundRef.current.length >= 3;
    onRound({ correct: success, responseTime: elapsed });
  };

  const submitWord = () => {
    if (done) return;
    const word = input.trim().toLowerCase();
    setInputError(null);

    if (!word) return;

    if (word.length < 3) {
      setInputError("Word must be at least 3 letters long.");
      return;
    }

    if (found.includes(word)) {
      setInputError(`“${word}” is already added!`);
      setInput("");
      return;
    }

    if (isWordValid(category.id, word)) {
      soundEffects.playSuccess();
      const next = [...found, word];
      foundRef.current = next;
      setFound(next);
      setInput("");
      setInputError(null);
    } else {
      soundEffects.playClick();
      setInputError(`“${word}” not recognized in this category.`);
    }
  };

  return (
    <div className="space-y-6 text-center max-w-lg mx-auto">
      {/* Category Header Banner */}
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-soft">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-0.5 text-xs font-bold text-primary mb-2">
          <Tag className="h-3 w-3" /> Active Lexicon Category
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-foreground">{category.label}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{category.hint}</p>

        {/* Timer Gauge */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className={cn("text-2xl font-black tabular-nums", seconds <= 5 ? "text-rose-500 animate-pulse" : "text-primary")}>
            {seconds}s
          </span>
        </div>
      </div>

      {/* Input Field & Add Button */}
      <div className="space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitWord();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            disabled={done}
            onChange={(e) => {
              setInput(e.target.value);
              setInputError(null);
            }}
            placeholder={`Type a ${category.label.toLowerCase()} word, then press Enter`}
            className="flex-1 rounded-2xl border border-border/80 bg-card px-4 py-3 text-base font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-soft"
            autoFocus
          />
          <Button
            type="submit"
            disabled={done || !input.trim()}
            className="tap rounded-2xl px-5 font-bold shadow-soft gap-1"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>

        {inputError && (
          <p className="text-xs font-bold text-rose-500 text-left px-2">
            {inputError}
          </p>
        )}
      </div>

      {/* Collected Word Garden Chips */}
      <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 min-h-[90px]">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-3 px-1">
          <span>Words Harvested ({found.length})</span>
          <span className={cn(found.length >= 3 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
            {found.length >= 3 ? "Target Met (3+)" : `Need ${3 - found.length} more`}
          </span>
        </div>

        {found.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-3">
            Type valid words above to populate your word garden.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {found.map((w) => (
              <span
                key={w}
                className="inline-flex items-center gap-1.5 rounded-full bg-card border border-primary/30 px-3.5 py-1 text-sm font-bold text-foreground shadow-sm animate-in zoom-in-75 duration-200"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>{w}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Early Complete Action Button */}
      <div className="pt-2 flex justify-center">
        <Button
          type="button"
          onClick={finishRound}
          disabled={done}
          variant={found.length >= 3 ? "default" : "outline"}
          className="tap rounded-2xl px-6 py-3 font-bold gap-2 text-sm shadow-soft"
        >
          <span>I'm Finished / Next Round</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function WordFluencyGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="word-fluency"
      title="Verbal Garden Lexicon"
      categoryName="Language Fluency"
      instruction="Retrieve and enter words fitting the category before the timer runs out."
      totalRounds={3}
      onExit={onExit}
    >
      {(props) => <WordRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
