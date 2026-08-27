import { useMemo, useState } from "react";
import { Activity, ArrowRight, Brain, CheckCircle2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CognitiveTest } from "@/components/CognitiveTest";
import { SpeechTest } from "@/components/SpeechTest";
import { BehavioralTest } from "@/components/BehavioralTest";
import {
  emptyScreening,
  finalizeScreening,
  needsCognitiveSupport,
  type AssessmentPart,
  type ScreeningResult,
} from "@/lib/screening";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

type AssessmentPageProps = {
  onComplete?: (result: ScreeningResult) => void;
  onGoToDashboard?: () => void;
  onOpenRegister?: () => void;
};

type View = "hub" | AssessmentPart | "summary";

const PARTS: {
  id: AssessmentPart;
  title: string;
  body: string;
  icon: typeof Brain;
}[] = [
  {
    id: "cognitive",
    title: "Cognitive",
    body: "Orientation, memory, attention and a simple clock task.",
    icon: Brain,
  },
  {
    id: "speech",
    title: "Speech",
    body: "Naming, repeating a sentence, and a short word-fluency round. Answers are scored on this device.",
    icon: Mic,
  },
  {
    id: "behavioral",
    title: "Behavioral pattern",
    body: "Everyday sleep, mood, routine and social questions. Optional device monitoring is separate.",
    icon: Activity,
  },
];

export function AssessmentPage({ onComplete, onGoToDashboard }: AssessmentPageProps) {
  const { activePatient } = useApp();
  const [view, setView] = useState<View>("hub");
  const [draft, setDraft] = useState<ScreeningResult>(() => emptyScreening());

  const completed = draft.partsCompleted ?? [];
  const allDone = PARTS.every((p) => completed.includes(p.id));

  const mergePart = (patch: Partial<ScreeningResult>, part: AssessmentPart) => {
    const partsCompleted = Array.from(new Set([...(draft.partsCompleted ?? []), part]));
    const next = finalizeScreening({
      ...draft,
      ...patch,
      partsCompleted,
    });
    setDraft(next);
    setView("hub");
    if (partsCompleted.length === 3) {
      onComplete?.(next);
    }
  };

  const summary = useMemo(() => finalizeScreening(draft), [draft]);

  if (view === "cognitive") {
    return (
      <CognitiveTest
        onBack={() => setView("hub")}
        onComplete={(result) => mergePart(result, "cognitive")}
      />
    );
  }
  if (view === "speech") {
    return (
      <SpeechTest
        onBack={() => setView("hub")}
        onComplete={(result) => mergePart(result, "speech")}
      />
    );
  }
  if (view === "behavioral") {
    return (
      <BehavioralTest
        onBack={() => setView("hub")}
        onComplete={(result) => mergePart(result, "behavioral")}
      />
    );
  }

  if (view === "summary" && allDone) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-sm font-semibold text-primary">Three-part screening</p>
          <h1 className="mt-1 text-3xl">{activePatient?.name || "Your results"}</h1>
          <p className="mt-2 text-4xl font-bold text-primary">{summary.score}/100</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Combined from cognitive, speech and behavioral scores. This is a guide, not a hospital diagnosis.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <ScoreChip label="Cognitive" value={summary.cognitiveScore} />
            <ScoreChip label="Speech" value={summary.speechScore} />
            <ScoreChip label="Behavioral" value={summary.behavioralScore} />
          </div>
          <p className="mt-6 text-sm">
            {needsCognitiveSupport(summary.tier)
              ? "These scores suggest extra memory support may help. Games, doctor contacts and family tools stay available."
              : "These scores do not strongly suggest dementia. You can still play games for daily practice."}
          </p>
          <Button size="lg" className="mt-6 w-full rounded-full" onClick={onGoToDashboard}>
            Back to dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Screening</p>
        <h1 className="mt-1 text-3xl">Three short tests</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Games are for daily practice. These tests are a separate snapshot: cognitive skill, speech, and
          everyday behavior. Complete all three for a combined score.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PARTS.map((part) => {
          const Icon = part.icon;
          const done = completed.includes(part.id);
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => setView(part.id)}
              className={cn(
                "rounded-2xl border bg-card p-5 text-left shadow-soft hover:shadow-lift",
                done ? "border-primary" : "border-border",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="h-5 w-5" />
                </div>
                {done ? <CheckCircle2 className="h-5 w-5 text-primary" /> : null}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{part.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{part.body}</p>
              <p className="mt-4 text-sm font-medium text-primary">{done ? "Retake" : "Start"}</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          className="rounded-full"
          disabled={!allDone}
          onClick={() => {
            onComplete?.(summary);
            setView("summary");
          }}
        >
          See combined result
        </Button>
        <Button size="lg" variant="outline" className="rounded-full" onClick={onGoToDashboard}>
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}

function ScoreChip({ label, value }: { label: string; value?: number | undefined }) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold">{value ?? "—"}</p>
    </div>
  );
}
