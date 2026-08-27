import { useState } from "react";
import { Activity, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type BehavioralTestProps = {
  onComplete: (payload: { behavioralScore: number }) => void;
  onBack?: () => void;
};

const QUESTIONS = [
  { id: "sleep", prompt: "Sleep has been regular this week (similar bedtime and wake time)." },
  { id: "mood", prompt: "Mood has stayed mostly even, without long spells of confusion or agitation." },
  { id: "routine", prompt: "Daily routines (meals, medicine, washing) have been completed with usual help." },
  { id: "social", prompt: "There has been conversation or time with family or neighbours most days." },
  { id: "wandering", prompt: "There has been little wandering or getting lost in familiar places." },
  { id: "appetite", prompt: "Eating and drinking have stayed close to the usual pattern." },
  { id: "interest", prompt: "There is still interest in familiar activities (tea, radio, garden, prayer)." },
  { id: "night", prompt: "Nights have been mostly calm, without long pacing or restlessness." },
];

const OPTIONS = [
  { label: "Often true", value: 100 },
  { label: "Sometimes", value: 60 },
  { label: "Rarely", value: 25 },
];

export function BehavioralTest({ onComplete, onBack }: BehavioralTestProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const done = QUESTIONS.every((q) => answers[q.id] !== undefined);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <Button variant="outline" className="rounded-full" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> All tests
      </Button>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-2">
        <h2 className="text-2xl font-semibold">Behavioral pattern check</h2>
        <p className="text-sm text-muted-foreground">
          A caregiver or the person themselves can answer. This is a snapshot of everyday patterns, not a
          diagnosis. For ongoing device monitoring, see How we monitor.
        </p>
      </div>

      {QUESTIONS.map((q, i) => (
        <div key={q.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <p className="font-medium">
            {i + 1}. {q.prompt}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {OPTIONS.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold ${
                  answers[q.id] === opt.value
                    ? "border-primary bg-secondary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-dashed border-primary/40 bg-secondary/40 p-4 text-sm">
        <p className="font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4" /> Optional: How we monitor
        </p>
        <p className="mt-1 text-muted-foreground">
          Activity, sleep-wake, typing rhythm and app use — processed on this device only.
        </p>
        <Link to="/behavioral" className="mt-2 inline-flex text-sm font-medium text-primary hover:underline">
          Open monitoring page
        </Link>
      </div>

      <Button
        size="lg"
        className="w-full rounded-full"
        disabled={!done}
        onClick={() => {
          const values = QUESTIONS.map((q) => answers[q.id] ?? 0);
          const behavioralScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
          onComplete({ behavioralScore });
        }}
      >
        Save behavioral score
      </Button>
    </div>
  );
}
