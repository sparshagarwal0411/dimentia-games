import { Activity, ArrowRight, ClipboardList, Phone, Play, Trophy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { needsCognitiveSupport, type ScreeningResult } from "@/lib/screening";
import { getTournamentBoard, loadPlayerStats, totalPlays } from "@/lib/game-progress";

export function HomeDashboard({
  result,
  onStartAssessment,
  onOpenGames,
  onOpenDoctors,
}: {
  result: ScreeningResult | null;
  onStartAssessment: () => void;
  onOpenGames: () => void;
  onOpenDoctors: () => void;
}) {
  const { activePatient } = useApp();
  const name = activePatient?.name || "there";
  const tested = Boolean(result);
  const isYes = needsCognitiveSupport(result?.tier);
  const stats = loadPlayerStats(activePatient?.id ?? "guest");
  const board = getTournamentBoard(activePatient?.id ?? "guest", activePatient?.name || "You");
  const parts = result?.partsCompleted?.length ?? (tested ? 1 : 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <p className="text-sm font-semibold text-primary">Your dashboard</p>
        <h1 className="mt-1 text-3xl text-foreground">Hello, {name}</h1>
        <p className="mt-2 text-muted-foreground">
          Use screening for a snapshot, games for daily practice, and How we monitor for on-device patterns.
          They work together — games do not replace the three tests.
        </p>
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">Three-part assessment</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cognitive, speech, and behavioral pattern. {parts}/3 completed.
            </p>
            {tested && (
              <p className="mt-2 text-sm">
                Combined score {result?.score}/100
                {result?.cognitiveScore != null ? ` · Cognitive ${result.cognitiveScore}` : ""}
                {result?.speechScore != null ? ` · Speech ${result.speechScore}` : ""}
                {result?.behavioralScore != null ? ` · Behavioral ${result.behavioralScore}` : ""}
              </p>
            )}
            {tested && (
              <p className={`mt-2 font-semibold ${isYes ? "text-clay" : "text-primary"}`}>
                {isYes ? "Possible dementia — please also see a clinician." : "Dementia not strongly suggested."}
              </p>
            )}
            <Button className="mt-4 rounded-full" onClick={onStartAssessment}>
              {tested ? "Continue / retake tests" : "Start assessment"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={onOpenGames}
          className="rounded-2xl border border-border bg-card p-5 text-left shadow-soft hover:shadow-lift"
        >
          <Play className="h-5 w-5 text-primary" />
          <h3 className="mt-3 text-lg font-semibold">Brain games</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Memory cards, speech echo, colours, word garden and more.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {stats.xp} XP · {totalPlays(stats)} sessions · streak {stats.streak}
          </p>
        </button>
        <button
          type="button"
          onClick={onOpenDoctors}
          className="rounded-2xl border border-border bg-card p-5 text-left shadow-soft hover:shadow-lift"
        >
          <Phone className="h-5 w-5 text-primary" />
          <h3 className="mt-3 text-lg font-semibold">Contact a doctor</h3>
          <p className="mt-1 text-sm text-muted-foreground">Helplines and neurology centres in the North East.</p>
        </button>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-sun" />
          <h3 className="font-semibold">Weekly tournament</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {board.theme} · You are #{board.yourRank} with {board.yourPoints} pts
        </p>
        <Button variant="outline" className="mt-3 rounded-full" onClick={onOpenGames}>
          Play for points
        </Button>
      </section>

      <Link
        to="/behavioral"
        className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift"
      >
        <Activity className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">How we monitor</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional on-device tracking of activity, sleep-wake, typing rhythm and app use. You can switch it
            off any time.
          </p>
        </div>
      </Link>

      {activePatient && (
        <p className="text-xs text-muted-foreground">
          {activePatient.district}, {activePatient.region}
          {activePatient.age ? ` · Age ${activePatient.age}` : ""}
        </p>
      )}
    </div>
  );
}
