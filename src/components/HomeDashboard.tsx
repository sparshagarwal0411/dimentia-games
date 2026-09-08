import { useMemo } from "react";
import {
  Activity,
  ArrowRight,
  Award,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  HeartPulse,
  Info,
  MapPin,
  Mic,
  Phone,
  Play,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { needsCognitiveSupport, type ScreeningResult } from "@/lib/screening";
import { getTournamentBoard, loadPlayerStats, totalPlays } from "@/lib/game-progress";
import { GAMES, type GameId } from "@/lib/games-catalog";
import { soundEffects } from "@/lib/audio-effects";
import { cn } from "@/lib/utils";

export function HomeDashboard({
  result,
  onStartAssessment,
  onOpenGames,
  onOpenDoctors,
  onOpenFamily,
  onSelectGame,
}: {
  result: ScreeningResult | null;
  onStartAssessment: () => void;
  onOpenGames: () => void;
  onOpenDoctors: () => void;
  onOpenFamily?: () => void;
  onSelectGame?: (id: GameId) => void;
}) {
  const { activePatient } = useApp();
  const { t } = useI18n();
  const name = activePatient?.name || "Friend";
  const tested = Boolean(result);
  const isYes = needsCognitiveSupport(result?.tier);
  const stats = loadPlayerStats(activePatient?.id ?? "guest");
  const board = getTournamentBoard(activePatient?.id ?? "guest", activePatient?.name || "You");
  const parts = result?.partsCompleted?.length ?? (tested ? 3 : 0);

  // Time of day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Today's recommended game (picks from GAMES based on play history or default)
  const recommendedGame = useMemo(() => {
    const unplayed = GAMES.find((g) => !stats.games[g.id]);
    return unplayed || GAMES[0];
  }, [stats.games]);

  const playerLevel = Math.floor(stats.xp / 120) + 1;
  const xpInCurrentLevel = stats.xp % 120;
  const levelProgress = Math.min(100, Math.round((xpInCurrentLevel / 120) * 100));

  const handleStartWorkout = () => {
    soundEffects.playSuccess();
    if (onSelectGame) {
      onSelectGame(recommendedGame.id);
    } else {
      onOpenGames();
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-soft">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {greeting}, {name}
              </span>
              {activePatient?.region && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  <MapPin className="h-3 w-3 text-primary" />
                  {activePatient.district ? `${activePatient.district}, ` : ""}
                  {activePatient.region}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t("dash.shield")}
              </span>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              {t("dash.overview")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t("dash.overviewDesc")}
            </p>
          </div>

          {/* Quick Assessment CTA */}
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <Button
              size="lg"
              onClick={() => {
                soundEffects.playClick();
                onStartAssessment();
              }}
              className="tap rounded-full px-6 py-3 font-bold shadow-soft hover:shadow-lift transition-all group"
            >
              <span>{tested ? t("dash.retake") : t("dash.startFull")}</span>
              <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {t("dash.mins")}
            </p>
          </div>
        </div>
      </div>

      {/* Gamification & Habit Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-soft hover:shadow-lift transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("dash.streak")}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Flame className="h-4 w-4 fill-current animate-pulse" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-foreground">
            {stats.streak} <span className="text-sm font-semibold text-muted-foreground">{t("dash.streakDays")}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.streak > 0 ? t("dash.streakActive") : t("dash.streakInactive")}
          </p>
        </div>

        {/* Total XP & Level */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-soft hover:shadow-lift transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("dash.levelXp")}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
              <Zap className="h-4 w-4 fill-current" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-foreground">{t("dash.lvl")} {playerLevel}</p>
            <span className="text-xs font-bold text-muted-foreground">{stats.xp} XP</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* Sessions Completed */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-soft hover:shadow-lift transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("dash.practice")}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <Brain className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-foreground">
            {totalPlays(stats)} <span className="text-sm font-semibold text-muted-foreground">{t("dash.rounds")}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("dash.practiceDesc")}
          </p>
        </div>

        {/* Tournament Position */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-soft hover:shadow-lift transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("dash.community")}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-foreground">
            #{board.yourRank} <span className="text-sm font-semibold text-muted-foreground">({board.yourPoints} {t("dash.pts")})</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground truncate" title={board.theme}>
            {board.theme}
          </p>
        </div>
      </div>

      {/* Main Grid: Cognitive Health Index + Daily Brain Workout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Cognitive Health Index Card (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-soft">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Three-Part Clinical Assessment</h2>
                  <p className="text-xs text-muted-foreground">Cognitive, Speech & Behavioral composite index</p>
                </div>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                {parts}/3 Completed
              </span>
            </div>

            {tested ? (
              <div className="mt-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-muted/40 p-4 border border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-2xl shadow-soft">
                      {result?.score ?? 0}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overall Composite Score</p>
                      <p className="text-base font-extrabold text-foreground">
                        {result?.score != null && result.score >= 70
                          ? "Normal Baseline Function"
                          : result?.score != null && result.score >= 50
                          ? "Mild Support Recommended"
                          : "Clinical Attention Advised"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "self-start sm:self-center inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                      isYes
                        ? "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                        : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                    )}
                  >
                    {isYes ? (
                      <>
                        <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                        Possible Support Needed
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        Stable Cognitive Range
                      </>
                    )}
                  </span>
                </div>

                {/* Sub-score Pills */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-3 text-center">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase">Cognitive</p>
                    <p className="mt-1 text-xl font-black text-foreground">
                      {result?.cognitiveScore != null ? result.cognitiveScore : "--"}
                      <span className="text-xs font-normal text-muted-foreground">/100</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Memory & Clock</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-3 text-center">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase">Speech</p>
                    <p className="mt-1 text-xl font-black text-foreground">
                      {result?.speechScore != null ? result.speechScore : "--"}
                      <span className="text-xs font-normal text-muted-foreground">/100</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Fluency & Pitch</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-3 text-center">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase">Behavioral</p>
                    <p className="mt-1 text-xl font-black text-foreground">
                      {result?.behavioralScore != null ? result.behavioralScore : "--"}
                      <span className="text-xs font-normal text-muted-foreground">/100</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Sleep & Routine</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isYes
                    ? "Your responses suggest mild cognitive differences. This tool is a screening aid, not a formal diagnosis. We recommend consulting a specialist or community health worker."
                    : "Your scores reflect steady cognitive functioning. Continue daily brain workouts and healthy routines to support neurological resilience."}
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-muted/40 border border-border/60 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">No Assessment Recorded Yet</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Take the three short exercises (orientation & clock drawing, speech repetition, and behavioral check) to establish your personalized baseline.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {tested ? "Periodic re-testing recommended every 14 days" : "Takes ~5 minutes on this device"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                soundEffects.playClick();
                onStartAssessment();
              }}
              className="rounded-full text-xs font-bold gap-1"
            >
              {tested ? "Retake Tests" : "Start Screening"} <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Today's Recommended Brain Workout (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 sm:p-7 shadow-soft">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Award className="h-3.5 w-3.5" /> Daily Adaptive Workout
              </span>
              <span className="text-xs font-semibold text-muted-foreground">2 mins</span>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-soft", recommendedGame.accent)}>
                <recommendedGame.icon className="h-7 w-7" />
              </div>
              <div>
                <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {recommendedGame.category}
                </span>
                <h3 className="mt-1 text-xl font-bold text-foreground">{recommendedGame.title}</h3>
                <p className="text-xs font-semibold text-primary">{recommendedGame.skill}</p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {recommendedGame.desc}
            </p>

            <div className="mt-4 rounded-2xl bg-muted/40 p-3.5 border border-border/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-muted-foreground">Difficulty: Level 1–5 Adaptive</span>
              </div>
              <span className="font-bold text-foreground">
                {stats.games[recommendedGame.id]
                  ? `Best: ${stats.games[recommendedGame.id].best}%`
                  : "Unplayed"}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-3">
            <Button
              onClick={handleStartWorkout}
              className="tap flex-1 rounded-full font-bold shadow-soft hover:shadow-lift transition-all gap-1.5"
            >
              <Play className="h-4 w-4 fill-current" /> Play Workout Now
            </Button>
            <Button
              variant="outline"
              onClick={onOpenGames}
              className="rounded-full text-xs font-semibold"
            >
              All 9 Games
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Quick-Action Quad Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Connected Health Modules</h2>
          <span className="text-xs text-muted-foreground">All features work offline</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Games Hub */}
          <button
            type="button"
            onClick={onOpenGames}
            className="group rounded-3xl border border-border/80 bg-card p-5 text-left shadow-soft hover:shadow-lift hover:border-primary/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform">
                <Play className="h-6 w-6 fill-current" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                Brain Games Gym
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Memory cards, routine recall, pattern logic, Stroop colors, and word fluency.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary">
              <span>9 Cultural Games</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Contact a Doctor */}
          <button
            type="button"
            onClick={onOpenDoctors}
            className="group rounded-3xl border border-border/80 bg-card p-5 text-left shadow-soft hover:shadow-lift hover:border-primary/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                Doctor & Helplines
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                24×7 KIRAN helpline, emergency 112, and North East medical college neurology centres.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>24/7 Clinical Directory</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Family & Caregiver */}
          <button
            type="button"
            onClick={onOpenFamily ? onOpenFamily : onOpenDoctors}
            className="group rounded-3xl border border-border/80 bg-card p-5 text-left shadow-soft hover:shadow-lift hover:border-primary/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                Family & Caregivers
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Patient caseload monitoring, live clinical alerts, daily observation logs, and SOS telemetry.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Supervision Portal</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Continuous Passive Monitoring */}
          <Link
            to="/behavioral"
            className="group rounded-3xl border border-border/80 bg-card p-5 text-left shadow-soft hover:shadow-lift hover:border-primary/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                Passive Telemetry
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                On-device rhythm analysis: keystroke dynamics, circadian sleep-wake stability, and voice markers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>100% On-Device Privacy</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Community Tournament Spotlight Snippet */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">Weekly Community Brain Cup</h3>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                Active Week
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {board.theme} · You hold <span className="font-bold text-foreground">Rank #{board.yourRank}</span> with {board.yourPoints} points
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onOpenGames}
          className="rounded-full text-xs font-bold shrink-0 self-start sm:self-center"
        >
          View Tournament Leaderboard →
        </Button>
      </div>

      {/* Patient Profile Footer Info */}
      {activePatient && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1 border-t border-border/40 pt-4">
          <span>
            Active Patient: <span className="font-semibold text-foreground">{activePatient.name}</span> ({activePatient.age || "Age not specified"} yrs) · {activePatient.region}
          </span>
          <span>NeuroTrack Clinical V2.4</span>
        </div>
      )}
    </div>
  );
}
