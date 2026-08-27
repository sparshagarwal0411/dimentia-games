import { useEffect, useState } from "react";
import { ArrowLeft, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { listenOnce, recognitionSupported, speak } from "@/lib/speech";
import { containsTarget, phraseScore } from "@/lib/text-score";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

type SpeechTestProps = {
  onComplete: (payload: { speechScore: number }) => void;
  onBack?: () => void;
};

const NAME_ITEMS = [
  { emoji: "🫖", word: "teapot" },
  { emoji: "🐘", word: "elephant" },
  { emoji: "☂️", word: "umbrella" },
];

export function SpeechTest({ onComplete, onBack }: SpeechTestProps) {
  const { prefs } = useApp();
  const { locale } = useI18n();
  const [step, setStep] = useState(0);
  const [nameScores, setNameScores] = useState<number[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [repeatInput, setRepeatInput] = useState("");
  const [repeatScore, setRepeatScore] = useState<number | null>(null);
  const [fluencyWords, setFluencyWords] = useState<string[]>([]);
  const [fluencyInput, setFluencyInput] = useState("");
  const [seconds, setSeconds] = useState(20);
  const [fluencyStarted, setFluencyStarted] = useState(false);
  const [listening, setListening] = useState(false);

  const sentence = "The morning tea is ready in the kitchen.";
  const nameItem = NAME_ITEMS[Math.min(nameScores.length, NAME_ITEMS.length - 1)]!;

  const capture = (onText: (text: string) => void) => {
    if (!recognitionSupported()) return;
    setListening(true);
    listenOnce(
      locale,
      (text) => {
        setListening(false);
        onText(text);
      },
      () => setListening(false),
    );
  };

  const scoreNaming = (text: string) => {
    const score = containsTarget(text, nameItem.word) ? 100 : phraseScore(nameItem.word, text);
    const next = [...nameScores, score];
    setNameScores(next);
    setNameInput("");
    if (next.length >= NAME_ITEMS.length) setStep(1);
  };

  const finish = () => {
    const naming = nameScores.length
      ? Math.round(nameScores.reduce((a, b) => a + b, 0) / nameScores.length)
      : 0;
    const repeat = repeatScore ?? 0;
    const fluency = Math.min(100, fluencyWords.length * 12);
    const speechScore = Math.round(naming * 0.4 + repeat * 0.35 + fluency * 0.25);
    onComplete({ speechScore });
  };

  useEffect(() => {
    if (step !== 2 || !fluencyStarted || seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [step, fluencyStarted, seconds]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Button variant="outline" className="mb-4 rounded-full" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> All tests
      </Button>
      <Progress value={((step + 1) / 3) * 100} className="mb-6 h-2.5" />

      {step === 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="text-2xl font-semibold">Name this object</h2>
          <p className="text-sm text-muted-foreground">
            Say or type the name. On-device scoring compares your answer — no audio is uploaded.
          </p>
          <p className="text-7xl text-center py-6">{nameItem.emoji}</p>
          <p className="text-center text-sm">Item {nameScores.length + 1} of {NAME_ITEMS.length}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => speak(nameItem.word, locale, prefs.slow_mode)}>
              <Volume2 className="mr-2 h-4 w-4" /> Hint (hear word)
            </Button>
            <Button type="button" onClick={() => capture(scoreNaming)} disabled={!recognitionSupported() || listening}>
              <Mic className="mr-2 h-4 w-4" /> {listening ? "Listening…" : "Speak"}
            </Button>
          </div>
          <div className="flex gap-2">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Or type the name"
              className="flex-1 rounded-xl border border-input px-4 py-3"
            />
            <Button type="button" disabled={!nameInput.trim()} onClick={() => scoreNaming(nameInput)}>
              Check
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="text-2xl font-semibold">Repeat the sentence</h2>
          <p className="rounded-2xl bg-muted p-4 text-lg font-medium">{sentence}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => speak(sentence, locale, prefs.slow_mode)}>
              <Volume2 className="mr-2 h-4 w-4" /> Hear it
            </Button>
            <Button
              type="button"
              onClick={() =>
                capture((text) => {
                  setRepeatInput(text);
                  setRepeatScore(phraseScore(sentence, text));
                })
              }
              disabled={!recognitionSupported() || listening}
            >
              <Mic className="mr-2 h-4 w-4" /> {listening ? "Listening…" : "Say it back"}
            </Button>
          </div>
          <div className="flex gap-2">
            <input
              value={repeatInput}
              onChange={(e) => setRepeatInput(e.target.value)}
              placeholder="Or type the sentence"
              className="flex-1 rounded-xl border border-input px-4 py-3"
            />
            <Button
              type="button"
              disabled={!repeatInput.trim()}
              onClick={() => setRepeatScore(phraseScore(sentence, repeatInput))}
            >
              Score
            </Button>
          </div>
          {repeatScore !== null && <p className="text-sm font-medium">Match score: {repeatScore}/100</p>}
          <Button className="w-full rounded-full" disabled={repeatScore === null} onClick={() => setStep(2)}>
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="text-2xl font-semibold">Word fluency</h2>
          <p className="text-sm text-muted-foreground">Name animals. Aim for at least 4 words.</p>
          {!fluencyStarted ? (
            <Button
              className="rounded-full"
              onClick={() => {
                setFluencyStarted(true);
                setSeconds(20);
              }}
            >
              Start 20-second round
            </Button>
          ) : (
            <>
              <p className="text-4xl font-black text-primary text-center">{seconds}s</p>
              <div className="flex gap-2">
                <input
                  value={fluencyInput}
                  disabled={seconds <= 0}
                  onChange={(e) => setFluencyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && fluencyInput.trim()) {
                      const w = fluencyInput.trim().toLowerCase();
                      if (!fluencyWords.includes(w)) setFluencyWords((prev) => [...prev, w]);
                      setFluencyInput("");
                    }
                  }}
                  placeholder="Type an animal, then Enter"
                  className="flex-1 rounded-xl border border-input px-4 py-3"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {fluencyWords.map((w) => (
                  <span key={w} className="rounded-full bg-secondary px-3 py-1 text-sm">
                    {w}
                  </span>
                ))}
              </div>
              <Button className="w-full rounded-full" disabled={seconds > 0} onClick={finish}>
                Save speech score
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
