import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Accessibility, Brain, LogOut, Phone, Play, Stethoscope, User } from "lucide-react";

import { useApp } from "@/lib/app-state";
import { useI18n, LANGUAGES } from "@/lib/i18n";
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

  return (
    <AppShell
      patientName={activePatient?.name}
      onHome={onHome}
      navigation={(
        <nav className="mx-auto flex max-w-6xl justify-center gap-1 overflow-x-auto border-t border-border/60 px-3 py-2 sm:px-6" aria-label="Dashboard sections">
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
        </nav>
      )}
    >

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
  navigation,
}: {
  children: ReactNode;
  onHome: () => void;
  patientName?: string | undefined;
  navigation?: ReactNode;
}) {
  const { session, signOut, openA11yPanel } = useApp();
  const { lang, setLang, t } = useI18n();
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
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <OfflineBanner />
      <SiteHeader simple onLogoClick={onHome} subtitle={patientName || undefined} navigation={navigation} />
      <header className="hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
          <button type="button" onClick={onHome} className="flex items-center gap-2 sm:gap-3 text-left">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-soft">
              <img src="/logo.png" alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-display text-base sm:text-lg font-bold leading-none">{t("app.name")}</p>
              <p className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground">{patientName || t("nav.dashboard")}</p>
            </div>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Language Toggle */}
            <div className="flex items-center rounded-full border border-border/80 bg-muted/50 p-0.5">
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setLang(item.code);
                  }}
                  className={`rounded-full px-2 py-1 text-[11px] sm:text-xs font-bold transition-all ${
                    lang === item.code
                      ? "bg-card text-foreground shadow-sm scale-100"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                  }`}
                  title={item.native}
                >
                  {item.code.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Accessibility Toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                soundEffects.playClick();
                openA11yPanel();
              }}
              className="flex items-center gap-1 rounded-full border-border/80 px-2 sm:px-3 h-8 sm:h-9 text-xs font-semibold text-foreground hover:bg-muted"
              title={t("a11y.title")}
            >
              <Accessibility className="h-4 w-4 text-primary shrink-0" />
            </Button>

            {session && (
              <>
                {/* User avatar */}
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                  title={userName}
                >
                  {initials || <User className="h-4 w-4" />}
                </div>
                {/* Sign out */}
                <button
                  type="button"
                  onClick={() => void signOut()}
                  title={t("nav.signOut")}
                  className="flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t("nav.signOut")}</span>
                </button>
              </>
            )}
          </div>
        </div>
        {navigation}
      </header>
      <main className="flex-1 pb-12">{children}</main>
      <SiteFooter onStart={onHome} />
    </div>
  );
}

