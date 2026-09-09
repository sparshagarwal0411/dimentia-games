import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Brain, Phone, Play, Stethoscope, Bell, X } from "lucide-react";

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
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { soundEffects } from "@/lib/audio-effects";
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
  const stageInitialized = useRef(false);

  useEffect(() => {
    if (patientsLoading || authLoading || stageInitialized.current) return;
    stageInitialized.current = true;
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

  const [isGuest, setIsGuest] = useState(() => {
    return typeof window !== "undefined" && window.localStorage.getItem("neurotrack.guest_mode") === "true";
  });

  const setJourney = (next: Stage) => {
    // If not authenticated and not in guest mode, ask for auth
    if (!session && !isGuest && next !== "landing" && next !== "auth") {
      setPendingStage(next);
      setStage("auth");
      return;
    }
    setStage(next);
    window.localStorage.setItem(STAGE_KEY, next);
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    window.localStorage.setItem("neurotrack.guest_mode", "true");
    const target = pendingStage || "dashboard";
    setStage(target);
    window.localStorage.setItem(STAGE_KEY, target);
    setPendingStage(null);
  };

  if (authLoading || patientsLoading || !ready) {
    return <div className="min-h-screen bg-background" />;
  }

  if (stage === "auth") {
    return (
      <AuthGate
        onCancel={() => setStage("landing")}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  if (stage === "landing") {
    return (
      <LandingPage
        onStart={() => {
          if (activePatient) {
            setJourney("dashboard");
          } else {
            setJourney("onboarding");
          }
        }}
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

  const navItems = [
    { id: "home" as const, label: "Home", icon: Brain },
    { id: "games" as const, label: "Games", icon: Play },
    { id: "doctors" as const, label: "Doctors", icon: Phone },
    { id: "family" as const, label: "Family", icon: Stethoscope },
  ];

  return (
    <AppShell
      patientName={activePatient?.name}
      onHome={onHome}
      navigation={(
        <nav
          className="mx-auto flex w-fit max-w-full items-center gap-0.5 rounded-full bg-muted/70 p-0.5"
          aria-label="Dashboard sections"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setTab(item.id);
                  setSelectedGame(null);
                }}
                className={`flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-3 ${
                  active
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
                <span className="sr-only sm:not-sr-only sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    >
      {tab === "home" && (
        <HomeDashboard
          result={screening}
          onStartAssessment={onTakeAssessment}
          onOpenGames={() => {
            soundEffects.playClick();
            setTab("games");
            setSelectedGame(null);
          }}
          onOpenDoctors={() => {
            soundEffects.playClick();
            setTab("doctors");
          }}
          onOpenFamily={() => {
            soundEffects.playClick();
            setTab("family");
          }}
          onSelectGame={(id) => {
            soundEffects.playClick();
            setTab("games");
            setSelectedGame(id);
          }}
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
  navigation,
}: {
  children: ReactNode;
  onHome: () => void;
  patientName?: string | undefined;
  navigation?: ReactNode;
}) {
  const [familyReminderOpen, setFamilyReminderOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const reminderKey = "neurotrack.familyReminderDate";
    if (window.localStorage.getItem(reminderKey) === today) return;

    window.localStorage.setItem(reminderKey, today);
    setFamilyReminderOpen(true);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Family check-in reminder", {
        body: "Take a moment to connect with your family member or caregiver today.",
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-foreground transition-colors duration-300">
      <OfflineBanner />
      <SiteHeader simple onLogoClick={onHome} subtitle={patientName || undefined} navigation={navigation} />
      {familyReminderOpen && (
        <div className="fixed inset-x-3 top-[4.75rem] z-30 mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-primary/20 bg-card p-4 shadow-lift sm:right-6 sm:left-auto sm:top-20">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">Daily family check-in</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Take a moment to connect with your family member or caregiver today.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFamilyReminderOpen(false)}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Dismiss family reminder"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <main className="flex-1 pb-24 sm:pb-12">{children}</main>
      <SiteFooter onStart={onHome} />
    </div>
  );
}

