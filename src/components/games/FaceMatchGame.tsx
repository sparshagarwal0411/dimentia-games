import { useState, useRef } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { shuffle } from "@/lib/game-content";
import { cn } from "@/lib/utils";
import { Smile, Check, X, Sparkles, UserCheck } from "lucide-react";

type FaceCue = {
  id: string;
  avatar: string;
  expression: string;
  description: string;
  character: string;
};

const CHARACTER_CUES: FaceCue[] = [
  { id: "c1", avatar: "😊", expression: "Warm & Welcoming Smile", description: "Soft eyes and broad cheerful grin", character: "Grandmother Lakshmi" },
  { id: "c2", avatar: "😌", expression: "Peaceful & Serene", description: "Gently closed eyes and tranquil relaxed brow", character: "Elder Biren" },
  { id: "c3", avatar: "😲", expression: "Wide-Eyed Wonder", description: "Raised eyebrows and open mouth in delight", character: "Uncle Pranab" },
  { id: "c4", avatar: "🤔", expression: "Thoughtful & Reflective", description: "Slight head tilt with chin resting on hand", character: "Auntie Maya" },
  { id: "c5", avatar: "😄", expression: "Radiant Laughter", description: "Crows-feet crinkles and joyful chuckle", character: "Grandpa Aosen" },
  { id: "c6", avatar: "🥺", expression: "Deeply Touched & Grateful", description: "Moist kind eyes and touched hand on heart", character: "Elder Tashi" },
];

function FaceRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const target = CHARACTER_CUES[roundKey % CHARACTER_CUES.length]!;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const [choices] = useState(() => {
    const others = CHARACTER_CUES.filter((c) => c.id !== target.id);
    const count = difficulty <= 2 ? 3 : 4;
    return shuffle([target, ...shuffle(others).slice(0, count - 1)]);
  });

  const handleSelect = (choice: FaceCue) => {
    if (selectedId) return;
    setSelectedId(choice.id);
    speakText(choice.expression);
    const isCorrect = choice.id === target.id;
    const elapsed = Math.max(0.5, (Date.now() - startTimeRef.current) / 1000);

    setTimeout(() => {
      onRound({ correct: isCorrect, responseTime: elapsed });
    }, 700);
  };

  return (
    <div className="flex flex-col items-center space-y-6 max-w-lg mx-auto text-center">
      {/* Target Expression Prompt Card */}
      <div className="w-full rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 shadow-soft">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-0.5 text-xs font-bold text-primary mb-2">
          <UserCheck className="h-3.5 w-3.5" /> Target Social Cue
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-foreground">
          Find: “{target.expression}”
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
          {target.description} · Associated with {target.character}
        </p>
      </div>

      <p className="text-xs font-bold text-muted-foreground">
        Select the character face demonstrating this facial cue:
      </p>

      {/* Candidate Facial Avatars */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
        {choices.map((choice) => {
          const isSelected = selectedId === choice.id;
          const isTarget = choice.id === target.id;

          let cardClass = "border-border/80 bg-card hover:bg-muted/60 hover:border-primary/40 hover:-translate-y-0.5";
          if (selectedId) {
            if (isSelected) {
              cardClass = isTarget
                ? "border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30"
                : "border-rose-500 bg-rose-500/15 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30";
            } else if (isTarget) {
              cardClass = "border-emerald-500/60 bg-emerald-500/10";
            } else {
              cardClass = "opacity-40 border-border bg-muted";
            }
          }

          return (
            <button
              key={choice.id}
              type="button"
              disabled={Boolean(selectedId)}
              onClick={() => handleSelect(choice)}
              className={cn(
                "tap group relative flex flex-col items-center justify-center rounded-3xl border-2 p-5 text-center transition-all duration-200 shadow-soft",
                cardClass
              )}
            >
              <span className="text-5xl sm:text-6xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                {choice.avatar}
              </span>
              <span className="mt-3 text-sm font-bold text-foreground">
                {choice.character}
              </span>
              <span className="mt-0.5 text-[11px] text-muted-foreground font-medium line-clamp-1">
                {choice.expression}
              </span>

              {isSelected && (
                <span className="absolute top-3 right-3">
                  {isTarget ? (
                    <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <X className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FaceMatchGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="face-match"
      title="Face & Expression Match"
      categoryName="Social Recognition"
      instruction="Examine the target facial expression and identify the matching character."
      totalRounds={4}
      onExit={onExit}
    >
      {(props) => <FaceRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
