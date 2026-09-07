import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { speak } from "@/lib/speech";
import { insertRow } from "@/lib/offline";
import { recordGamePlay } from "@/lib/game-progress";
import { soundEffects } from "@/lib/audio-effects";
import {
  GAME_DOMAIN,
  recommendDifficulty,
  type AttemptSignal,
  type Recommendation,
} from "@/lib/adaptive";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export type RoundResult = { correct: boolean; responseTime: number };

export type GameProps = {
  difficulty: number;
  onRound: (result: RoundResult) => void;
  roundKey: number;
  speakText: (text: string) => void;
};

type Props = {
  gameId: string;
  title: string;
  instruction: string;
  totalRounds?: number;
  onExit?: (() => void) | undefined;
  children: (props: GameProps) => React.ReactNode;
};

export function GameShell({ gameId, title, instruction, totalRounds = 5, onExit, children }: Props) {
  const { activePatient, prefs } = useApp();
  const { locale } = useI18n();
  const [difficulty, setDifficulty] = useState(activePatient?.base_difficulty ?? 2);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const savedRef = useRef(false);

  const speakText = useMemo(
    () => (text: string) => {
      if (prefs.voice_guidance && !prefs.reduce_sounds) speak(text, locale, prefs.slow_mode);
    },
    [prefs.voice_guidance, prefs.reduce_sounds, prefs.slow_mode, locale],
  );

  // Load the patient's level for this game's cognitive domain.
  useEffect(() => {
    if (!activePatient) return;
    const domain = GAME_DOMAIN[gameId];
    if (!domain) return;
    void supabase
      .from("cognitive_profiles")
      .select("level")
      .eq("patient_id", activePatient.id)
      .eq("domain", domain)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.level) setDifficulty(data.level);
      });
  }, [activePatient, gameId]);

  useEffect(() => {
    speakText(instruction);
  }, [instruction, speakText]);

  const handleRound = (result: RoundResult) => {
    const next = [...results, result];
    setResults(next);
    speakText(result.correct ? "Correct" : "Not this one, let us try the next");
    if (next.length >= totalRounds) {
      setFinished(true);
    } else {
      setRound((r) => r + 1);
    }
  };

  const accuracy = results.length
    ? results.filter((r) => r.correct).length / results.length
    : 0;
  const avgTime = results.length
    ? results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
    : 0;
  const mistakes = results.filter((r) => !r.correct).length;

  // Save the attempt and run the adaptive engine once the session ends.
  useEffect(() => {
    if (!finished || savedRef.current) return;
    savedRef.current = true;

    const signal: AttemptSignal = {
      accuracy,
      response_time: avgTime,
      mistakes,
      difficulty,
    };

    const run = async () => {
      let history: AttemptSignal[] = [signal];
      if (activePatient) {
        const { data } = await supabase
          .from("game_attempts")
          .select("accuracy, response_time, mistakes, difficulty")
          .eq("patient_id", activePatient.id)
          .eq("game_id", gameId)
          .order("created_at", { ascending: false })
          .limit(2);
        if (data) {
          history = [
            signal,
            ...data.map((row) => ({
              accuracy: Number(row.accuracy),
              response_time: Number(row.response_time),
              mistakes: row.mistakes,
              difficulty: row.difficulty,
            })),
          ];
        }
      }

        const next = recommendDifficulty(difficulty, history);
      setRecommendation(next);

      recordGamePlay(activePatient?.id ?? "guest", gameId, Math.round(accuracy * 100));

      if (activePatient) {
        await insertRow("game_attempts", {
          patient_id: activePatient.id,
          game_id: gameId,
          difficulty,
          score: Math.round(accuracy * 100),
          accuracy: Number(accuracy.toFixed(2)),
          response_time: Number(avgTime.toFixed(1)),
          mistakes,
        });
        const domain = GAME_DOMAIN[gameId];
        if (domain) {
          await supabase.from("cognitive_profiles").upsert(
            {
              patient_id: activePatient.id,
              domain,
              level: next.level,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "patient_id,domain" },
          );
        }
      }
      speakText(`Well done. You got ${Math.round(accuracy * 100)} percent.`);
    };

    void run();
  }, [finished, accuracy, avgTime, mistakes, difficulty, activePatient, gameId, speakText]);

  const restart = () => {
    savedRef.current = false;
    setResults([]);
    setRound(0);
    setFinished(false);
    setRecommendation(null);
    if (recommendation) setDifficulty(recommendation.level);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="lg" className="tap gap-2 text-lg" onClick={onExit}>
          <ArrowLeft className="h-6 w-6" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
          <p className="text-base text-muted-foreground" data-optional="true">
            Level {difficulty} of 5
          </p>
        </div>
      </div>

      {!finished ? (
        <>
          <Progress value={(results.length / totalRounds) * 100} className="mb-6 h-4" />
          <p className="mb-6 text-center text-xl font-medium sm:text-2xl">{instruction}</p>
          {children({ difficulty, onRound: handleRound, roundKey: round, speakText })}
        </>
      ) : (
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
          <Trophy className="mx-auto h-16 w-16 text-sun" />
          <h2 className="mt-4 text-3xl font-semibold">Well done!</h2>
          <p className="mt-2 text-2xl">
            You got{" "}
            <span className="font-bold text-primary">{results.filter((r) => r.correct).length}</span>{" "}
            out of {totalRounds}
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center" data-optional="true">
            <Stat label="Accuracy" value={`${Math.round(accuracy * 100)}%`} />
            <Stat label="Avg. time" value={`${avgTime.toFixed(1)}s`} />
            <Stat label="Mistakes" value={String(mistakes)} />
          </div>
          {recommendation ? (
            <p
              className={cn(
                "mt-6 rounded-2xl px-4 py-3 text-lg",
                recommendation.direction === "up"
                  ? "bg-secondary text-secondary-foreground"
                  : recommendation.direction === "down"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground",
              )}
              data-optional="true"
            >
              {recommendation.reason} · next level {recommendation.level}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="tap flex-1 text-xl" onClick={restart}>
              Play again
            </Button>
            <Button size="lg" variant="outline" className="tap flex-1 text-xl" onClick={onExit}>
              All games
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted px-3 py-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
