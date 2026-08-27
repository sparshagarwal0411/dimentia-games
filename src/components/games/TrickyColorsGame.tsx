import { useEffect, useState } from "react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { shuffle } from "@/lib/game-content";

const COLOURS = [
  { name: "Red", ink: "#dc2626" },
  { name: "Blue", ink: "#2563eb" },
  { name: "Green", ink: "#16a34a" },
  { name: "Yellow", ink: "#ca8a04" },
  { name: "Purple", ink: "#7c3aed" },
];

function ColorsRound({ difficulty, onRound, roundKey, speakText }: GameProps) {
  const [prompt, setPrompt] = useState<(typeof COLOURS)[number]>(COLOURS[0]!);
  const [ink, setInk] = useState<(typeof COLOURS)[number]>(COLOURS[1]!);
  const [options, setOptions] = useState<typeof COLOURS>(COLOURS);
  const [picked, setPicked] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const word = COLOURS[Math.floor(Math.random() * COLOURS.length)]!;
    let colour = COLOURS[Math.floor(Math.random() * COLOURS.length)]!;
    if (colour.name === word.name) colour = COLOURS[(COLOURS.indexOf(word) + 1) % COLOURS.length]!;
    const count = difficulty <= 2 ? 3 : 4;
    const rest = shuffle(COLOURS.filter((c) => c.name !== colour.name)).slice(0, count - 1);
    setPrompt(word);
    setInk(colour);
    setOptions(shuffle([colour, ...rest]));
    setPicked(null);
    setStartTime(Date.now());
    speakText(`The word is ${word.name}. Tap the colour of the ink.`);
  }, [difficulty, roundKey, speakText]);

  const choose = (name: string) => {
    if (picked) return;
    setPicked(name);
    const correct = name === ink.name;
    setTimeout(() => onRound({ correct, responseTime: (Date.now() - startTime) / 1000 }), 600);
  };

  return (
    <div className="space-y-8 text-center">
      <p className="text-sm text-muted-foreground">Ignore the written word. Tap the colour of the letters.</p>
      <div className="rounded-3xl border border-border bg-card py-10 shadow-soft">
        <p className="text-6xl font-black tracking-wide" style={{ color: ink.ink }}>
          {prompt.name.toUpperCase()}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => choose(c.name)}
            className="tap rounded-2xl border-2 border-border bg-card py-4 text-lg font-bold shadow-soft"
            style={{ color: c.ink, borderColor: picked === c.name ? c.ink : undefined }}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TrickyColorsGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="tricky-colors"
      title="Tricky colours"
      instruction="Tap the ink colour, not the word."
      totalRounds={5}
      onExit={onExit}
    >
      {(props) => <ColorsRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
