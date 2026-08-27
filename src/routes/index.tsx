import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Brain, LogOut, Phone, Play, Stethoscope, User } from "lucide-react";

import { useApp } from "@/lib/app-state";
import { persistAssessment, type ScreeningResult } from "@/lib/screening";
import { AssessmentPage } from "@/components/AssessmentPage";
import { AuthGate } from "@/components/AuthGate";
import { CaregiverPortal } from "@/components/CaregiverPortal";
import { OfflineBanner } from "@/components/OfflineBanner";
import { LandingPage } from "@/components/LandingPage";
import { OnboardingPage } from "@/components/OnboardingPage";
import { HomeDashboard } from "@/components/HomeDashboard";
import { DoctorsPage } from "@/components/DoctorsPage";
import { GamesHub } from "@/components/games/GamesHub";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/SiteChrome";
import type { GameId } from "@/lib/games-catalog";

export const Route = createFileRoute("/")({
  component: Index,
});

type Stage = "landing" | "auth" | "onboarding" | "dashboard" | "assessment";
type TabType = "home" | "games" | "doctors" | "family";

const STAGE_KEY = "neurotrack.stage";

function readScreening(patientScreening?: ScreeningResult): ScreeningResult | null {
  if (patientScreening) return patientScreening;
  try {
    const raw = window.localStorage.getItem("neurotrack.lastScreening");
    return raw ? (JSON.parse(raw) as ScreeningResult) : null;
  } catch {
    return null;
  }
}

function Index() {
  const { activePatient, patientsLoading, updatePatient, session, authLoading } = useApp();
  const [stage, setStage] = useState<Stage>("landing");
  const [pendingStage, setPendingStage] = useState<Stage | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (patientsLoading || authLoading) return;
    const stored = window.localStorage.getItem(STAGE_KEY);
    // If user is authenticated, resume their in-progress journey
    if (session) {
      if (stored === "onboarding" || stored === "assessment") {
        setStage(stored);
      } else if (stored === "dashboard" || activePatient) {
        setStage("dashboard");
      } else {
        setStage("landing");
      }
    } else {
      // Not authenticated — always start from landing
      setStage("landing");
    }
    setReady(true);
  }, [patientsLoading, authLoading, session, activePatient]);

  // After a successful OAuth redirect, proceed to the pending destination
  useEffect(() => {
    if (session && pendingStage && pendingStage !== "auth") {
      setStage(pendingStage);
      window.localStorage.setItem(STAGE_KEY, pendingStage);
      setPendingStage(null);
    }
  }, [session, pendingStage]);

  const setJourney = (next: Stage) => {
    // Require auth before proceeding past landing
    if (!session && next !== "landing" && next !== "auth") {
      setPendingStage(next);
      setStage("auth");
      return;
    }
    setStage(next);
    window.localStorage.setItem(STAGE_KEY, next);
  };

  if (authLoading || patientsLoading || !ready) {
    return <div className="min-h-screen bg-background" />;
  }

  if (stage === "auth") {
    return (
      <AuthGate
        onCancel={() => setStage("landing")}
      />
    );
  }

  if (stage === "landing") {
    return (
      <LandingPage
        onStart={() => setJourney("onboarding")}
        onResume={activePatient ? () => setJourney("dashboard") : undefined}
      />
    );
  }

  if (stage === "onboarding") {
    return (
      <OnboardingPage
        onBack={() => setJourney("landing")}
        onComplete={() => setJourney("dashboard")}
      />
    );
  }

  if (stage === "assessment") {
    return (
      <AppShell patientName={activePatient?.name} onHome={() => setJourney("landing")}>
        <div className="mx-auto max-w-4xl px-4 pt-6">
          <Button variant="outline" className="rounded-full" onClick={() => setJourney("dashboard")}>
            Back to dashboard
          </Button>
        </div>
        <AssessmentPage
          onComplete={(result) => {
            window.localStorage.setItem("neurotrack.lastScreening", JSON.stringify(result));
            if (activePatient) {
              void updatePatient(activePatient.id, { last_screening: result });
              void persistAssessment(activePatient.id, result);
            }
          }}
          onGoToDashboard={() => setJourney("dashboard")}
        />
      </AppShell>
    );
  }

  return (
    <Platform
      onTakeAssessment={() => setJourney("assessment")}
      onHome={() => setJourney("landing")}
    />
  );
}

function Platform({
  onTakeAssessment,
  onHome,
}: {
  onTakeAssessment: () => void;
  onHome: () => void;
}) {
  const { activePatient } = useApp();
  const [tab, setTab] = useState<TabType>("home");
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

  const screening = useMemo(
    () => readScreening(activePatient?.last_screening),
    [activePatient?.last_screening],
  );

  return (
    <AppShell patientName={activePatient?.name} onHome={onHome}>
      <div className="border-b border-border bg-card/80">
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {(
            [
              { id: "home" as const, label: "Home", icon: Brain },
              { id: "games" as const, label: "Games", icon: Play },
              { id: "doctors" as const, label: "Doctors", icon: Phone },
              { id: "family" as const, label: "Family", icon: Stethoscope },
            ]
          ).map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id);
                  setSelectedGame(null);
                }}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "home" && (
        <HomeDashboard
          result={screening}
          onStartAssessment={onTakeAssessment}
          onOpenGames={() => setTab("games")}
          onOpenDoctors={() => setTab("doctors")}
        />
      )}

      {tab === "games" && (
        <GamesHub selectedGame={selectedGame} onSelect={setSelectedGame} />
      )}

      {tab === "doctors" && <DoctorsPage />}
      {tab === "family" && <CaregiverPortal />}
    </AppShell>
  );
}

function AppShell({
  children,
  onHome,
  patientName,
}: {
  children: ReactNode;
  onHome: () => void;
  patientName?: string | undefined;
}) {
  const { session, signOut } = useApp();
  const userName = session?.user?.user_metadata?.["full_name"] || session?.user?.email || "";
  const initials = userName
    ? userName
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <OfflineBanner />
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <button type="button" onClick={onHome} className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold leading-none">NeuroTrack NE</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{patientName || "Dashboard"}</p>
            </div>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {session && (
              <>
                {/* User avatar */}
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400"
                  title={userName}
                >
                  {initials || <User className="h-4 w-4" />}
                </div>
                {/* Sign out */}
                <button
                  type="button"
                  onClick={() => void signOut()}
                  title="Sign out"
                  className="flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 pb-12">{children}</main>
      <SiteFooter />
    </div>
  );
}
