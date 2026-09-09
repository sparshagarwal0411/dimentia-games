import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
  Flame,
  Award,
  Clock,
  ArrowRight,
  Heart,
  HeartCrack,
  Skull,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
  maxLives?: number;
  categoryName?: string;
  onExit?: (() => void) | undefined;
  children: (props: GameProps) => React.ReactNode;
};

export function GameShell({
  gameId,
  title,
  instruction,
  totalRounds = 5,
  maxLives = 3,
  categoryName,
  onExit,
  children,
}: Props) {
  const { activePatient, prefs } = useApp();
  const { locale } = useI18n();
  const [difficulty, setDifficulty] = useState(activePatient?.base_difficulty ?? 2);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);
  const [livesLeft, setLivesLeft] = useState(maxLives);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const savedRef = useRef(false);

  const speakText = useMemo(
    () => (text: string) => {
      if (!isMuted && prefs.voice_guidance && !prefs.reduce_sounds) {
        speak(text, locale, prefs.slow_mode);
      }
    },
    [isMuted, prefs.voice_guidance, prefs.reduce_sounds, prefs.slow_mode, locale],
  );

  // Load patient level for domain
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
      })
      .catch(() => {
        /* offline safe */
      });
  }, [activePatient, gameId]);

  useEffect(() => {
    speakText(instruction);
  }, [instruction, speakText]);

  const handleRound = (result: RoundResult) => {
    if (result.correct) {
      soundEffects.playSuccess();
    } else {
      soundEffects.playClick();
    }

    const next = [...results, result];
    setResults(next);

    if (!result.correct) {
      const newLives = livesLeft - 1;
      setLivesLeft(newLives);
      if (newLives <= 0) {
        // Game over — ran out of lives
        setFailed(true);
        setFinished(true);
        return;
      }
    }

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
  const scorePercent = Math.round(accuracy * 100);

  // Derived XP based on pass/fail
  const xpEarned = failed
    ? Math.max(0, Math.round(scorePercent * 0.10))
    : Math.max(10, Math.round(scorePercent * 0.35));

  // Save attempt and run adaptive calculation upon finish
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
        try {
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
        } catch {
          /* safe fallback */
        }
      }

      const next = recommendDifficulty(difficulty, history);
      setRecommendation(next);

      // Record to local progress stats — pass `!failed` so XP is penalised on failure
      recordGamePlay(activePatient?.id ?? "guest", gameId, scorePercent, !failed);

      if (activePatient) {
        try {
          await insertRow("game_attempts", {
            patient_id: activePatient.id,
            game_id: gameId,
            difficulty,
            score: scorePercent,
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
        } catch {
          /* safe fallback for offline */
        }
      }
      speakText(failed ? `Game over. You scored ${scorePercent} percent.` : `Session complete. You scored ${scorePercent} percent.`);
    };

    void run();
  }, [finished, failed, accuracy, avgTime, mistakes, difficulty, activePatient, gameId, scorePercent, speakText]);

  const restart = () => {
    savedRef.current = false;
    setResults([]);
    setRound(0);
    setFinished(false);
    setFailed(false);
    setLivesLeft(maxLives);
    setRecommendation(null);
    if (recommendation) setDifficulty(recommendation.level);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-6 py-4 sm:py-6 animate-in fade-in duration-300">
      {/* Top Arcade HUD Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-card/95 p-4 sm:p-5 shadow-soft backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExit}
            className="tap h-10 w-10 rounded-2xl p-0 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
            title="Return to Games Hub"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">{title}</h1>
              {categoryName && (
                <span className="hidden sm:inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  {categoryName}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
              <span>Difficulty Level {difficulty} of 5</span>
              <span>•</span>
              <span className="text-primary font-semibold">Round {Math.min(round + 1, totalRounds)} / {totalRounds}</span>
            </p>
          </div>
        </div>

        {/* Live Round Progress Beads + Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-border/40 sm:border-t-0 pt-3 sm:pt-0">
          {/* Lives (Hearts) */}
          <div className="flex items-center gap-1 bg-rose-500/10 px-2.5 py-1.5 rounded-full border border-rose-500/30" title={`${livesLeft} of ${maxLives} lives remaining`}>
            {Array.from({ length: maxLives }).map((_, idx) => (
              <span key={idx} className={cn(
                "transition-all duration-300",
                idx < livesLeft
                  ? "text-rose-500 scale-100"
                  : "text-muted-foreground/30 scale-75 grayscale"
              )}>
                <Heart className={cn("h-4 w-4", idx < livesLeft ? "fill-rose-500" : "fill-none stroke-muted-foreground/40")} />
              </span>
            ))}
          </div>

          {/* Round Beads */}
          <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full border border-border/60">
            {Array.from({ length: totalRounds }).map((_, idx) => {
              const res = results[idx];
              const isCurrent = idx === round && !finished;
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                    res !== undefined
                      ? res.correct
                        ? "bg-emerald-500 text-white shadow-sm scale-100"
                        : "bg-rose-500 text-white shadow-sm scale-100"
                      : isCurrent
                      ? "border-2 border-primary text-primary animate-pulse scale-110 bg-primary/10"
                      : "bg-muted-foreground/20 text-muted-foreground/50 scale-90"
                  )}
                  title={
                    res !== undefined
                      ? res.correct
                        ? `Round ${idx + 1}: Correct`
                        : `Round ${idx + 1}: Missed`
                      : isCurrent
                      ? `Round ${idx + 1}: Current`
                      : `Round ${idx + 1}`
                  }
                >
                  {res !== undefined ? (
                    res.correct ? "✓" : "✕"
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Sound Toggle & Restart */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleSound}
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-xl border border-border/80 transition-all",
                isMuted ? "bg-destructive/10 text-destructive" : "bg-card text-muted-foreground hover:text-foreground"
              )}
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={restart}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              title="Restart session"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {!finished ? (
        <div className="space-y-6">
          {/* Active instruction card */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-teal-500/5 to-transparent px-5 py-3.5 shadow-sm text-center">
            <p className="text-base sm:text-lg font-bold text-foreground flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>{instruction}</span>
            </p>
          </div>

          {/* Individual Game Board */}
          <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-8 shadow-soft relative overflow-hidden">
            {children({ difficulty, onRound: handleRound, roundKey: round, speakText })}
          </div>
        </div>
      ) : failed ? (
        /* ── Game Over / Failure Screen ── */
        <div className="rounded-3xl border border-rose-500/40 bg-gradient-to-b from-card via-card to-rose-500/5 p-6 sm:p-10 text-center shadow-lift animate-in zoom-in-95 duration-400">
          <div className="relative inline-block mx-auto">
            <div className="absolute -inset-4 rounded-full bg-rose-500/20 blur-xl animate-pulse pointer-events-none" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lift mx-auto">
              <HeartCrack className="h-12 w-12" />
            </div>
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Out of Lives!
          </h2>
          <p className="mt-2 text-base text-muted-foreground max-w-md mx-auto">
            You ran out of lives in <span className="font-bold text-foreground">{title}</span>. Keep practising — your brain is learning!
          </p>

          {/* Performance Triple Badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto text-center">
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-rose-500">{scorePercent}%</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Score</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-foreground">{results.length}/{totalRounds}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Rounds Done</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
              <div className="flex items-center justify-center gap-1 text-2xl sm:text-3xl font-black text-muted-foreground">
                <Zap className="h-5 w-5" />
                <span>+{xpEarned}</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-1">XP (−75%)</p>
            </div>
          </div>

          {/* Tip */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 max-w-lg mx-auto">
            <Skull className="h-4 w-4 shrink-0" />
            <span>Try again to earn full XP and climb the leaderboard!</span>
          </div>

          {/* Navigation Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Button
              size="lg"
              onClick={restart}
              className="tap flex-1 rounded-2xl font-bold shadow-soft gap-2 text-base bg-rose-600 hover:bg-rose-700 text-white"
            >
              <RotateCcw className="h-4 w-4" /> Try Again
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onExit}
              className="tap flex-1 rounded-2xl font-bold border-border/80 hover:bg-muted text-base"
            >
              All 9 Games
            </Button>
          </div>
        </div>
      ) : (
        /* ── Victory / Performance Breakdown Screen ── */
        <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card to-primary/5 p-6 sm:p-10 text-center shadow-lift animate-in zoom-in-95 duration-400">
          <div className="relative inline-block mx-auto">
            <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse pointer-events-none" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lift mx-auto">
              <Trophy className="h-12 w-12" />
            </div>
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            {scorePercent >= 80 ? "Spectacular Workout!" : scorePercent >= 50 ? "Solid Brain Training!" : "Good Practice Session!"}
          </h2>
          <p className="mt-2 text-base text-muted-foreground max-w-md mx-auto">
            You completed all {totalRounds} exercises in <span className="font-bold text-foreground">{title}</span>.
          </p>

          {/* Performance Triple Badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto text-center">
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-primary">{scorePercent}%</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Accuracy</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-foreground">{avgTime.toFixed(1)}s</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Avg Cadence</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
              <div className="flex items-center justify-center gap-1 text-2xl sm:text-3xl font-black text-amber-500">
                <Zap className="h-5 w-5 fill-current" />
                <span>+{xpEarned}</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-1">XP Earned</p>
            </div>
          </div>

          {/* Adaptive Recommendation Pill */}
          {recommendation && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary max-w-lg mx-auto">
              <Award className="h-4 w-4 shrink-0" />
              <span>{recommendation.reason} · Next target: Level {recommendation.level}</span>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Button
              size="lg"
              onClick={restart}
              className="tap flex-1 rounded-2xl font-bold shadow-soft gap-2 text-base"
            >
              <RotateCcw className="h-4 w-4" /> Play Again
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onExit}
              className="tap flex-1 rounded-2xl font-bold border-border/80 hover:bg-muted text-base"
            >
              All 9 Games
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
