import { useState } from "react";
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  HelpCircle,
  RotateCcw,
  Volume2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { needsCognitiveSupport, type ScreeningResult } from "@/lib/screening";

type CognitiveTestProps = {
  onComplete: (result: Partial<ScreeningResult> & { cognitiveScore: number }) => void;
  onBack?: () => void;
};

const REGIONS = [
  "Assam",
  "Meghalaya",
  "Manipur",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Arunachal Pradesh",
  "Sikkim",
];

const REGISTERED_ITEMS = [
  { id: "tea", label: "Assam Tea Leaf", iconName: "Botanical Specimen" },
  { id: "rhino", label: "Kaziranga Rhino", iconName: "Regional Fauna" },
  { id: "basket", label: "Handwoven Bamboo Basket", iconName: "Household Artifact" },
];

const RECALL_OPTIONS = [
  { id: "tea", label: "Assam Tea Leaf", category: "Nature" },
  { id: "apple", label: "Red Apple", category: "Fruit" },
  { id: "rhino", label: "Kaziranga Rhino", category: "Fauna" },
  { id: "drum", label: "Hand Drum", category: "Instrument" },
  { id: "basket", label: "Handwoven Bamboo Basket", category: "Artifact" },
  { id: "clock", label: "Brass Wall Clock", category: "Appliance" },
];

export function CognitiveTest({ onComplete, onBack }: CognitiveTestProps) {
  const { activePatient, prefs } = useApp();
  const { locale } = useI18n();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  const [orientationDay, setOrientationDay] = useState<string>("");
  const [orientationRegion, setOrientationRegion] = useState<string>(activePatient?.region || "Assam");
  const [registeredConfirmed, setRegisteredConfirmed] = useState<boolean>(false);
  const [calcAnswers, setCalcAnswers] = useState<Record<number, number>>({});
  const [clockHour, setClockHour] = useState<number>(3);
  const [selectedRecall, setSelectedRecall] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<ScreeningResult | null>(null);

  const announce = (text: string) => {
    if (prefs.voice_guidance && !prefs.reduce_sounds) {
      speak(text, locale, prefs.slow_mode);
    }
  };

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
      announce(`Clinical Assessment: Step ${step + 1} of ${totalSteps}`);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    let orientationScore = 0;
    if (orientationDay) orientationScore += 10;
    if (orientationRegion) orientationScore += 10;

    let registrationScore = registeredConfirmed ? 20 : 0;

    let attentionScore = 0;
    if (calcAnswers[1] === 17) attentionScore += 10;
    if (calcAnswers[2] === 14) attentionScore += 10;

    let spatialScore = clockHour === 10 ? 20 : 10;

    let recallScore = 0;
    if (selectedRecall.includes("tea")) recallScore += 7;
    if (selectedRecall.includes("rhino")) recallScore += 7;
    if (selectedRecall.includes("basket")) recallScore += 6;

    const totalScore = orientationScore + registrationScore + attentionScore + spatialScore + recallScore;

    let tier: ScreeningResult["tier"] = "green";
    if (totalScore < 50) {
      tier = "red";
    } else if (totalScore < 75) {
      tier = "amber";
    }

    const resultObj: ScreeningResult = {
      score: totalScore,
      tier,
      orientationScore,
      registrationScore,
      attentionScore,
      spatialScore,
      recallScore,
      cognitiveScore: totalScore,
      timestamp: new Date().toISOString(),
    };

    setFinalResult(resultObj);
    setIsCompleted(true);
    announce(`Cognitive test complete. Score is ${totalScore} of 100.`);
  };

  const resetAssessment = () => {
    setStep(1);
    setOrientationDay("");
    setRegisteredConfirmed(false);
    setCalcAnswers({});
    setClockHour(3);
    setSelectedRecall([]);
    setIsCompleted(false);
    setFinalResult(null);
  };

  const patientDisplayName = activePatient?.name || "Patient Evaluation";
  const patientLocation = activePatient ? `${activePatient.district}, ${activePatient.region}` : "North East Region";

  if (isCompleted && finalResult) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-10 text-card-foreground">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-4 text-left">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  NeuroTrack™ Clinical Screening Record
                </p>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {patientDisplayName}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Age: {activePatient?.age || "—"} · Sex: {activePatient?.sex || "—"} · Location: {patientLocation}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-4xl font-extrabold text-primary">
                {finalResult.score} <span className="text-base font-normal text-muted-foreground">/ 100 CPI</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {new Date().toLocaleDateString()} · ID: {activePatient?.id || "REC-01"}
              </span>
            </div>
          </div>

          {/* Clinical Classification Box */}
          <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Diagnostic Stratification:
              </span>
              {needsCognitiveSupport(finalResult.tier) ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/30 px-3.5 py-1 text-xs font-bold text-rose-500">
                  <AlertTriangle className="h-4 w-4" /> Yes — possible cognitive support recommended
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Normal range — cognitive support not indicated
                </span>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-foreground/90">
              {needsCognitiveSupport(finalResult.tier)
                ? "This screening score indicates potential cognitive impairment. Targeted daily cognitive exercises, memory reminders, and consultation with a registered clinical neurologist are strongly recommended."
                : "This screening score is within expected cognitive baselines. Continue preventive brain-wellness routines and retake quarterly to establish long-term cognitive trends."}
            </p>
          </div>

          {/* Sub-Domain Breakdown */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <ClinicalScoreTile title="Orientation" score={finalResult.orientationScore} max={20} />
            <ClinicalScoreTile title="Registration" score={finalResult.registrationScore} max={20} />
            <ClinicalScoreTile title="Attention (Math)" score={finalResult.attentionScore} max={20} />
            <ClinicalScoreTile title="Spatial (Clock)" score={finalResult.spatialScore} max={20} />
            <ClinicalScoreTile title="Delayed Recall" score={finalResult.recallScore} max={20} />
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Button
              size="lg"
              className="tap w-full sm:flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base shadow-lg"
              onClick={() => {
                onComplete({ ...finalResult, cognitiveScore: finalResult.score });
              }}
            >
              Save & Continue to Dashboard
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="tap w-full sm:w-auto gap-2 border-border font-semibold text-base"
              onClick={resetAssessment}
            >
              <RotateCcw className="h-5 w-5" /> Retake Screening
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Patient header info bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-md text-foreground">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/30">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {patientDisplayName} {activePatient?.age ? `(${activePatient.age}y, ${activePatient.sex})` : ""}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" /> {patientLocation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="tap border-border text-xs font-bold"
            >
              Back to Tests
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => announce("Standardized cognitive screening protocol. 5 clinical domain steps.")}
            className="text-primary text-xs font-semibold"
          >
            <Volume2 className="h-4 w-4 mr-1" /> Audio Guide
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
          <span>Clinical Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
        </div>
        <Progress value={(step / totalSteps) * 100} className="h-2.5 bg-muted" />
      </div>

      {/* Question Cards */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl text-foreground">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/30">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Step 1: Temporal & Regional Orientation
                </h2>
                <p className="text-xs text-muted-foreground">
                  Assess patient orientation to current day and administrative state.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Select the current day of the week:
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setOrientationDay(day)}
                      className={cn(
                        "tap rounded-xl border-2 p-3 text-center text-sm font-bold transition-all",
                        orientationDay === day
                          ? "border-primary bg-primary/15 text-primary shadow-sm"
                          : "border-border bg-background hover:bg-muted/60 text-foreground",
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Confirm the patient's North Eastern state location:
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setOrientationRegion(r)}
                      className={cn(
                        "tap rounded-xl border-2 p-3 text-center text-xs font-bold transition-all",
                        orientationRegion === r
                          ? "border-primary bg-primary/15 text-primary shadow-sm"
                          : "border-border bg-background hover:bg-muted/60 text-foreground",
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/30">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Step 2: 3-Item Word Registration (Encoding)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Read these 3 culturally familiar North Eastern items aloud to the patient.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {REGISTERED_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/30 p-6 text-center shadow-sm"
                >
                  <span className="text-xs font-mono uppercase text-primary font-bold tracking-wider">
                    {item.iconName}
                  </span>
                  <p className="mt-2 text-lg font-bold text-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setRegisteredConfirmed(true);
                announce("Assam Tea Leaf, Kaziranga Rhino, Handwoven Bamboo Basket");
              }}
              className={cn(
                "tap flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all border",
                registeredConfirmed
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-muted/50 text-foreground hover:bg-muted",
              )}
            >
              <CheckCircle2 className="h-5 w-5" />
              {registeredConfirmed ? "Patient has registered & repeated all 3 items" : "Confirm patient registered items"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/30">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Step 3: Attention & Serial Mental Calculation
                </h2>
                <p className="text-xs text-muted-foreground">
                  Assess working memory and mental focus via serial arithmetic subtraction.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-muted/30 p-5">
                <label className="block text-base font-bold text-foreground mb-2">
                  Question 1: Starting at 20, subtract 3 (20 – 3):
                </label>
                <div className="flex flex-wrap gap-3">
                  {[15, 17, 18, 16].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCalcAnswers((prev) => ({ ...prev, 1: num }))}
                      className={cn(
                        "tap flex-1 min-w-[70px] rounded-xl border-2 py-3 text-center text-lg font-bold transition-all",
                        calcAnswers[1] === num
                          ? "border-primary bg-primary/15 text-primary shadow-sm"
                          : "border-border bg-background hover:bg-muted/60 text-foreground",
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-5">
                <label className="block text-base font-bold text-foreground mb-2">
                  Question 2: Subtract 3 again from 17 (17 – 3):
                </label>
                <div className="flex flex-wrap gap-3">
                  {[12, 13, 14, 15].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCalcAnswers((prev) => ({ ...prev, 2: num }))}
                      className={cn(
                        "tap flex-1 min-w-[70px] rounded-xl border-2 py-3 text-center text-lg font-bold transition-all",
                        calcAnswers[2] === num
                          ? "border-primary bg-primary/15 text-primary shadow-sm"
                          : "border-border bg-background hover:bg-muted/60 text-foreground",
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/30">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Step 4: Spatial Executive Clock Orientation
                </h2>
                <p className="text-xs text-muted-foreground">
                  Direct the clock hour hand to point to <strong>10:00</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-3xl bg-muted/30 p-6 text-center border border-border">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-primary bg-card shadow-lg">
                <div className="absolute top-2 text-sm font-bold text-muted-foreground">12</div>
                <div className="absolute right-3 text-sm font-bold text-muted-foreground">3</div>
                <div className="absolute bottom-2 text-sm font-bold text-muted-foreground">6</div>
                <div className="absolute left-3 text-sm font-bold text-muted-foreground">9</div>

                <div className="h-3 w-3 rounded-full bg-primary z-10 shadow-md" />
                <div
                  className="absolute h-16 w-1.5 origin-bottom rounded-full bg-primary transition-transform duration-300"
                  style={{
                    transform: `rotate(${clockHour * 30}deg) translateY(-50%)`,
                  }}
                />
              </div>

              <p className="mt-4 text-sm font-bold text-foreground font-mono">
                Current Position: <span className="text-primary">{clockHour}:00</span>
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[8, 9, 10, 11, 12, 1, 2, 3].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setClockHour(h)}
                    className={cn(
                      "tap h-11 w-11 rounded-xl border-2 text-xs font-bold transition-all",
                      clockHour === h
                        ? "border-primary bg-primary text-primary-foreground shadow-md font-extrabold"
                        : "border-border bg-background hover:bg-muted text-foreground",
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/30">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Step 5: Delayed Episodic Memory Recall
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select the 3 items registered in Step 2 from the distractor pool:
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {RECALL_OPTIONS.map((item) => {
                const isSelected = selectedRecall.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedRecall((prev) => prev.filter((id) => id !== item.id));
                      } else {
                        if (selectedRecall.length < 3) {
                          setSelectedRecall((prev) => [...prev, item.id]);
                        }
                      }
                    }}
                    className={cn(
                      "tap flex flex-col items-center justify-center rounded-2xl border-2 p-5 text-center transition-all",
                      isSelected
                        ? "border-primary bg-primary/15 text-primary font-bold shadow-md"
                        : "border-border bg-background hover:bg-muted/60 text-foreground",
                    )}
                  >
                    <span className="text-xs font-mono uppercase text-muted-foreground">{item.category}</span>
                    <span className="mt-1 text-sm font-bold text-foreground">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-center text-muted-foreground font-mono">
              Selected: {selectedRecall.length} of 3 target items
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border pt-6">
          <Button
            variant="outline"
            size="lg"
            disabled={step === 1}
            onClick={() => setStep((prev) => prev - 1)}
            className="tap border-border font-semibold text-sm"
          >
            Previous Domain
          </Button>

          <Button
            size="lg"
            onClick={handleNextStep}
            className="tap gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 text-sm shadow-md"
          >
            {step === totalSteps ? "Generate Clinical Diagnostic" : "Proceed to Next Domain"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ClinicalScoreTile({ title, score, max }: { title: string; score: number; max: number }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3 text-center">
      <p className="text-[11px] text-muted-foreground font-medium">{title}</p>
      <p className="mt-1 text-base font-bold text-primary font-mono">
        {score} / {max}
      </p>
    </div>
  );
}
