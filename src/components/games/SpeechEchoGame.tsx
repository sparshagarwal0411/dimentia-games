import { useEffect, useState } from "react";
import { Mic, Volume2 } from "lucide-react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { Button } from "@/components/ui/button";
import { listenOnce, recognitionSupported, speak } from "@/lib/speech";
import { phraseScore } from "@/lib/text-score";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

const LINES = [
  "Please pass the tea.",
  "The garden looks green today.",
  "I will walk in the morning.",
  "The children are coming home.",
  "It is a calm evening.",
];

function EchoRound({ onRound, roundKey, speakText }: GameProps) {
  const { prefs } = useApp();
  const { locale } = useI18n();
  const line = LINES[roundKey % LINES.length]!;
  const [heard, setHeard] = useState("");
  const [listening, setListening] = useState(false);
  const [typed, setTyped] = useState("");
  const [startTime] = useState(Date.now());
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    speakText(`Please repeat: ${line}`);
    setHeard("");
    setTyped("");
    setLocked(false);
  }, [roundKey, line, speakText]);

  const finish = (text: string) => {
    if (locked) return;
    setLocked(true);
    const score = phraseScore(line, text);
    onRound({ correct: score >= 55, responseTime: (Date.now() - startTime) / 1000 });
  };

  const startListen = () => {
    if (!recognitionSupported()) return;
    setListening(true);
    listenOnce(
      locale,
      (transcript) => {
        setHeard(transcript);
        setListening(false);
        finish(transcript);
      },
      () => setListening(false),
    );
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-sm text-muted-foreground">Listen, then say the sentence — or type it if the mic is unavailable.</p>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <p className="text-2xl font-semibold leading-relaxed">{line}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" variant="outline" onClick={() => speak(line, locale, prefs.slow_mode)}>
          <Volume2 className="mr-2 h-4 w-4" /> Hear it
        </Button>
        <Button type="button" onClick={startListen} disabled={listening || locked || !recognitionSupported()}>
          <Mic className="mr-2 h-4 w-4" /> {listening ? "Listening…" : "Say it back"}
        </Button>
      </div>
      {heard ? <p className="text-sm">Heard: “{heard}”</p> : null}
      {!recognitionSupported() || heard === "" ? (
        <div className="flex gap-2">
          <input
            value={typed}
            disabled={locked}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type the sentence"
            className="flex-1 rounded-xl border border-input px-4 py-3"
          />
          <Button type="button" disabled={locked || !typed.trim()} onClick={() => finish(typed)}>
            Check
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function SpeechEchoGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="speech-echo"
      title="Speech echo"
      instruction="Repeat the sentence clearly. On-device scoring compares your words."
      totalRounds={4}
      onExit={onExit}
    >
      {(props) => <EchoRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
