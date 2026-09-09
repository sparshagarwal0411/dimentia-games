import { useEffect, useState, useRef } from "react";
import { Mic, Volume2, Sparkles, Check, CheckCircle2, ArrowRight } from "lucide-react";
import { GameShell, type GameProps } from "@/components/games/GameShell";
import { Button } from "@/components/ui/button";
import { listenOnce, recognitionSupported, speak } from "@/lib/speech";
import { phraseScore } from "@/lib/text-score";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SPOKEN_PHRASES = [
  "Please pour me a warm cup of morning tea.",
  "The green hills look peaceful after the rain.",
  "I am going for a gentle walk with my friends.",
  "The grandchildren are arriving this evening.",
  "Fresh river fish is cooking in the hearth.",
];

function EchoRound({ onRound, roundKey, speakText }: GameProps) {
  const { prefs } = useApp();
  const { locale } = useI18n();
  const line = SPOKEN_PHRASES[roundKey % SPOKEN_PHRASES.length]!;

  const [heard, setHeard] = useState("");
  const [listening, setListening] = useState(false);
  const [typed, setTyped] = useState("");
  const [evaluatedScore, setEvaluatedScore] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    speakText(`Please repeat: ${line}`);
    setHeard("");
    setTyped("");
    setEvaluatedScore(null);
    setLocked(false);
    startTimeRef.current = Date.now();
  }, [roundKey, line, speakText]);

  const evaluateAndFinish = (transcript: string) => {
    if (locked) return;
    setLocked(true);
    const score = phraseScore(line, transcript);
    setEvaluatedScore(score);
    const elapsed = Math.max(1, (Date.now() - startTimeRef.current) / 1000);

    setTimeout(() => {
      onRound({ correct: score >= 55, responseTime: elapsed });
    }, 1200);
  };

  const startListen = () => {
    if (!recognitionSupported() || locked) return;
    setListening(true);
    listenOnce(
      locale,
      (transcript) => {
        setHeard(transcript);
        setListening(false);
        evaluateAndFinish(transcript);
      },
      () => {
        setListening(false);
      },
    );
  };

  return (
    <div className="space-y-6 text-center max-w-lg mx-auto">
      {/* Target Spoken Phrase Banner */}
      <div className="rounded-3xl border-2 border-primary/20 bg-primary/5 p-6 shadow-soft">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block mb-2">
          Phrase to Articulate
        </span>
        <p className="text-xl sm:text-2xl font-black text-foreground leading-relaxed">
          “{line}”
        </p>

        <div className="mt-4 flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => speak(line, locale, prefs.slow_mode)}
            className="rounded-full text-xs font-bold gap-1.5 shadow-sm"
          >
            <Volume2 className="h-3.5 w-3.5 text-primary" /> Hear It Spoken
          </Button>
        </div>
      </div>

      {/* Spoken Audio Input Controls */}
      <div className="space-y-4">
        {recognitionSupported() && (
          <div className="flex flex-col items-center gap-3">
            <Button
              type="button"
              size="lg"
              onClick={startListen}
              disabled={listening || locked}
              className={cn(
                "tap rounded-full px-8 py-6 text-base font-bold shadow-soft transition-all gap-2.5",
                listening
                  ? "bg-rose-500 hover:bg-rose-600 animate-pulse text-white ring-4 ring-rose-500/20"
                  : "bg-primary text-primary-foreground hover:shadow-lift"
              )}
            >
              <Mic className="h-5 w-5" />
              <span>{listening ? "Listening closely... Speak now" : "Tap & Speak Back"}</span>
            </Button>
            <p className="text-xs text-muted-foreground">
              {listening ? "Speak clearly into your microphone" : "Speak the phrase clearly into the microphone"}
            </p>
          </div>
        )}

        {/* Text Input Fallback (always accessible) */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 text-left shadow-soft">
          <p className="text-xs font-bold text-muted-foreground mb-2">
            Keyboard Alternative:
          </p>
          <div className="flex gap-2">
            <input
              value={typed}
              disabled={locked}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && typed.trim() && !locked) {
                  evaluateAndFinish(typed);
                }
              }}
              placeholder="Or type the phrase here..."
              className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              type="button"
              disabled={locked || !typed.trim()}
              onClick={() => evaluateAndFinish(typed)}
              className="rounded-xl px-4 text-xs font-bold shadow-sm"
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Heard Speech & Evaluation Results */}
        {heard && (
          <p className="text-xs font-semibold text-muted-foreground">
            Audio captured: <span className="font-bold text-foreground">“{heard}”</span>
          </p>
        )}

        {evaluatedScore !== null && (
          <div className="rounded-2xl bg-muted/60 p-4 border border-border animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-black text-primary">{evaluatedScore}%</span>
              <span className="text-sm font-bold text-foreground">
                {evaluatedScore >= 55 ? "Great Articulation!" : "Good Effort — Keep Practicing!"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Phonetic and semantic match score against benchmark phrase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SpeechEchoGame({ onExit }: { onExit?: () => void }) {
  return (
    <GameShell
      gameId="speech-echo"
      title="Speech Articulation Echo"
      categoryName="Auditory Language"
      instruction="Listen to the regional phrase, then speak or type it clearly."
      totalRounds={4}
      onExit={onExit}
    >
      {(props) => <EchoRound key={props.roundKey} {...props} />}
    </GameShell>
  );
}
