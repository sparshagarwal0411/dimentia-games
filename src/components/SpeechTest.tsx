import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Mic, RotateCcw, Volume2 } from "lucide-react";
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
  const [step, setStep] = useState<number>(0);
  const [nameScores, setNameScores] = useState<number[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [repeatInput, setRepeatInput] = useState("");
  const [repeatScore, setRepeatScore] = useState<number | null>(null);
  const [fluencyWords, setFluencyWords] = useState<string[]>([]);
  const [fluencyInput, setFluencyInput] = useState("");
  const [seconds, setSeconds] = useState(20);
  const [fluencyStarted, setFluencyStarted] = useState(false);
  const [listening, setListening] = useState(false);
  const [fluencyListening, setFluencyListening] = useState(false);

  const sentence = "The morning tea is ready in the kitchen.";
  const nameIndex = Math.min(nameScores.length, NAME_ITEMS.length - 1);
  const nameItem = NAME_ITEMS[nameIndex]!;

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

  const captureFluency = () => {
    if (!recognitionSupported()) return;
    setFluencyListening(true);
    listenOnce(
      locale,
      (text) => {
        setFluencyListening(false);
        const tokens = text.toLowerCase().split(/[\s,]+/);
        tokens.forEach((t) => {
          const clean = t.trim();
          if (clean.length > 2 && !fluencyWords.includes(clean)) {
            setFluencyWords((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
          }
        });
      },
      () => setFluencyListening(false),
    );
  };

  const scoreNaming = (text: string) => {
    const score = containsTarget(text, nameItem.word) ? 100 : phraseScore(nameItem.word, text);
    const next = [...nameScores, score];
    setNameScores(next);
    setNameInput("");
    if (next.length >= NAME_ITEMS.length) {
      setStep(1);
    }
  };

  const namingAvg = nameScores.length
    ? Math.round(nameScores.reduce((a, b) => a + b, 0) / nameScores.length)
    : 0;
  const repeatAvg = repeatScore ?? 0;
  const fluencyAvg = Math.min(100, fluencyWords.length * 20);
  const calculatedSpeechScore = Math.round(namingAvg * 0.4 + repeatAvg * 0.35 + fluencyAvg * 0.25);

  const goToSummary = () => {
    setStep(3);
    if (prefs.voice_guidance && !prefs.reduce_sounds) {
      speak(`Speech assessment complete. Your overall score is ${calculatedSpeechScore} out of 100.`, locale, prefs.slow_mode);
    }
  };

  useEffect(() => {
    if (step !== 2 || !fluencyStarted || seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [step, fluencyStarted, seconds]);

  const addFluencyWord = (word: string) => {
    const clean = word.trim().toLowerCase();
    if (clean && !fluencyWords.includes(clean)) {
      setFluencyWords((prev) => [...prev, clean]);
      setFluencyInput("");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" className="rounded-full tap" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> All Tests
        </Button>
        <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
          Speech & Language Biomarker {step < 3 ? `(Step ${step + 1} of 3)` : "(Completed)"}
        </span>
      </div>

      <Progress value={step === 3 ? 100 : ((step + 1) / 3) * 100} className="mb-6 h-2.5" />

      {step === 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lg space-y-5 text-card-foreground">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold text-foreground">Step 1: Confrontational Object Naming</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Say aloud or type the name of the visual object below.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-6 bg-muted/20 rounded-2xl border border-border">
            <p className="text-8xl select-none py-2">{nameItem.emoji}</p>
            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              Item {nameScores.length + 1} of {NAME_ITEMS.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="tap"
              onClick={() => speak(nameItem.word, locale, prefs.slow_mode)}
            >
              <Volume2 className="mr-2 h-4 w-4" /> Hear Hint
            </Button>
            <Button
              type="button"
              className="tap bg-primary text-primary-foreground"
              onClick={() => capture(scoreNaming)}
              disabled={!recognitionSupported() || listening}
            >
              <Mic className="mr-2 h-4 w-4" /> {listening ? "Listening…" : "Speak Answer"}
            </Button>
          </div>

          <div className="flex gap-2">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nameInput.trim()) {
                  scoreNaming(nameInput);
                }
              }}
              placeholder="Or type the name here..."
              className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-foreground"
            />
            <Button
              type="button"
              className="tap"
              disabled={!nameInput.trim()}
              onClick={() => scoreNaming(nameInput)}
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lg space-y-5 text-card-foreground">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold text-foreground">Step 2: Sentence Articulation & Repetition</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Listen to the sentence, then speak or type it back accurately.
            </p>
          </div>

          <div className="rounded-2xl bg-muted/40 border border-border p-5 text-lg font-medium text-foreground text-center">
            "{sentence}"
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="tap"
              onClick={() => speak(sentence, locale, prefs.slow_mode)}
            >
              <Volume2 className="mr-2 h-4 w-4" /> Hear Sentence
            </Button>
            <Button
              type="button"
              className="tap bg-primary text-primary-foreground"
              onClick={() =>
                capture((text) => {
                  setRepeatInput(text);
                  setRepeatScore(phraseScore(sentence, text));
                })
              }
              disabled={!recognitionSupported() || listening}
            >
              <Mic className="mr-2 h-4 w-4" /> {listening ? "Listening…" : "Say It Back"}
            </Button>
          </div>

          <div className="flex gap-2">
            <input
              value={repeatInput}
              onChange={(e) => setRepeatInput(e.target.value)}
              placeholder="Or type what you heard..."
              className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-foreground"
            />
            <Button
              type="button"
              className="tap"
              disabled={!repeatInput.trim()}
              onClick={() => setRepeatScore(phraseScore(sentence, repeatInput))}
            >
              Score
            </Button>
          </div>

          {repeatScore !== null && (
            <div className="rounded-xl border border-border bg-primary/10 p-3 text-center">
              <span className="text-sm font-bold text-primary">Repetition Accuracy: {repeatScore}%</span>
            </div>
          )}

          <Button
            className="w-full rounded-xl tap bg-primary text-primary-foreground font-bold py-3"
            disabled={repeatScore === null}
            onClick={() => setStep(2)}
          >
            Continue to Word Fluency
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lg space-y-5 text-card-foreground">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold text-foreground">Step 3: Semantic Category Word Fluency</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Name as many animals as you can (e.g., cat, dog, elephant, cow, deer). Speak aloud or type.
            </p>
          </div>

          {!fluencyStarted ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-4">
                You can speak or type. Aim for at least 3-5 unique animal names.
              </p>
              <Button
                size="lg"
                className="rounded-xl tap px-8 py-3 bg-primary text-primary-foreground font-bold"
                onClick={() => {
                  setFluencyStarted(true);
                  setSeconds(30);
                }}
              >
                Start Word Fluency Round
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3 border border-border">
                <span className="text-sm font-medium text-muted-foreground">Time Remaining:</span>
                <span className={`text-2xl font-black font-mono ${seconds <= 5 ? "text-rose-500" : "text-primary"}`}>
                  {seconds}s
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="tap bg-primary text-primary-foreground"
                  onClick={captureFluency}
                  disabled={!recognitionSupported() || fluencyListening}
                >
                  <Mic className="mr-2 h-4 w-4" /> {fluencyListening ? "Listening…" : "Speak Animal Names"}
                </Button>
              </div>

              <div className="flex gap-2">
                <input
                  value={fluencyInput}
                  onChange={(e) => setFluencyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && fluencyInput.trim()) {
                      addFluencyWord(fluencyInput);
                    }
                  }}
                  placeholder="Type animal name & hit Enter or Add"
                  className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-foreground"
                />
                <Button
                  type="button"
                  className="tap"
                  disabled={!fluencyInput.trim()}
                  onClick={() => addFluencyWord(fluencyInput)}
                >
                  Add
                </Button>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Recorded Animals ({fluencyWords.length}):
                </p>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-muted/20 rounded-xl border border-border">
                  {fluencyWords.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">No words added yet. Speak or type above!</span>
                  ) : (
                    fluencyWords.map((w) => (
                      <span
                        key={w}
                        className="inline-flex items-center rounded-lg bg-primary/15 border border-primary/30 px-3 py-1 text-sm font-medium text-primary capitalize"
                      >
                        {w}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3">
                <Button
                  className="w-full rounded-xl tap bg-primary text-primary-foreground font-bold py-3.5 shadow-md"
                  onClick={goToSummary}
                >
                  Complete & View Speech Score
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-2xl space-y-6 text-card-foreground">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Speech Evaluation Summary</h2>
                <p className="text-xs text-muted-foreground">Digital Speech & Phonemic Biomarker Profile</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-extrabold text-primary font-mono">{calculatedSpeechScore}</span>
              <span className="text-xs text-muted-foreground block">/ 100 Points</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Naming</span>
              <p className="mt-1 text-2xl font-black text-foreground">{namingAvg}%</p>
              <span className="text-[11px] text-muted-foreground">{NAME_ITEMS.length} Objects Tested</span>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Repetition</span>
              <p className="mt-1 text-2xl font-black text-foreground">{repeatAvg}%</p>
              <span className="text-[11px] text-muted-foreground">Sentence Articulation</span>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Fluency</span>
              <p className="mt-1 text-2xl font-black text-foreground">{fluencyAvg}%</p>
              <span className="text-[11px] text-muted-foreground">{fluencyWords.length} Animal Words</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-5">
            <h3 className="text-sm font-bold text-foreground mb-1">Clinical Speech Insight</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {calculatedSpeechScore >= 75
                ? "Excellent phonemic retrieval and articulatory accuracy. Speech patterns reflect preserved semantic memory pathways."
                : "Mild word finding or articulatory variability detected. Continuing vocal repetition drills and word recall exercises is recommended."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              size="lg"
              className="w-full sm:flex-1 rounded-xl tap bg-primary text-primary-foreground font-bold text-base shadow-lg"
              onClick={() => onComplete({ speechScore: calculatedSpeechScore })}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Save Speech Score & Return
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-xl tap border-border font-semibold text-base"
              onClick={() => {
                setStep(0);
                setNameScores([]);
                setNameInput("");
                setRepeatInput("");
                setRepeatScore(null);
                setFluencyWords([]);
                setFluencyInput("");
                setFluencyStarted(false);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Retake Test
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
