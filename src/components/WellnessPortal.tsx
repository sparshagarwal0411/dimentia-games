import { BookOpen, HeartHandshake, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { tierLabel, type ScreeningResult } from "@/lib/screening";

export function WellnessPortal({
  result,
  onRetake,
}: {
  result: ScreeningResult | null;
  onRetake: () => void;
}) {
  const { activePatient } = useApp();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Family health portal</p>
        <h1 className="mt-2 text-3xl text-foreground">
          {activePatient?.name ? `${activePatient.name}’s record` : "Your screening record"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This screening did not point to dementia-level concern. Use this space to understand the scores,
          learn the signs of dementia, and keep a family view of the person’s profile.
        </p>

        {result ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overall score</p>
              <p className="mt-1 font-display text-4xl text-foreground">{result.score}</p>
              <p className="text-sm text-muted-foreground">out of 100</p>
            </div>
            <div className="rounded-2xl border border-border p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reading</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{tierLabel(result.tier)}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                If memory worries continue, retake in a few weeks or speak with a local clinician.
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No screening is saved yet.</p>
        )}

        <Button variant="outline" className="mt-6 rounded-full" onClick={onRetake}>
          <RefreshCw className="h-4 w-4" />
          Retake screening
        </Button>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="mt-3 text-lg">What dementia can look like</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Repeating questions, losing the way on known roads, mixing up dates, or struggling with money and
            cooking that used to be easy. One off day is not a diagnosis.
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <HeartHandshake className="h-5 w-5 text-primary" />
          <h2 className="mt-3 text-lg">How families can help</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Keep routines steady, write down medicines, visit in daylight hours, and avoid arguing over
            forgotten details. Warmth reduces distress more than quizzes do.
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <ShieldAlert className="h-5 w-5 text-clay" />
          <h2 className="mt-3 text-lg">When to seek a clinic</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Sudden confusion, falls, fever, or rapid change needs urgent care. Slow change over months should
            be reviewed by a doctor who knows the person.
          </p>
        </article>
      </section>
    </div>
  );
}
