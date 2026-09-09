import {
  Accessibility,
  Brain,
  HeartPulse,
  Shield,
  FileText,
  PhoneCall,
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Languages,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { useI18n, LANGUAGES } from "@/lib/i18n";
import { LegalModal, type LegalTab } from "@/components/LegalModal";
import { soundEffects } from "@/lib/audio-effects";

export function SiteHeader({
  onStart,
  onLogoClick,
  ctaLabel,
  simple = false,
  subtitle,
  navigation,
}: {
  onStart?: () => void;
  onLogoClick?: () => void;
  ctaLabel?: string;
  simple?: boolean;
  subtitle?: string;
  navigation?: ReactNode;
}) {
  const { openA11yPanel, session, activePatient, signOut } = useApp();
  const { lang, setLang, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName = activePatient?.name || session?.user?.user_metadata?.["full_name"] || session?.user?.email || "";
  const initials = userName
    ? userName
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
    : "";

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    soundEffects.playClick();
    setMobileMenuOpen(false);
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    } else if (window.location.pathname !== "/") {
      window.location.assign(`/#${targetId}`);
    } else {
      window.location.hash = targetId;
    }
  };

  const handleStart = () => {
    soundEffects.playSuccess();
    setMobileMenuOpen(false);
    onStart?.();
  };

  const resolvedCta = ctaLabel || (activePatient || session ? t("nav.resume") : t("nav.start"));
  const shortCta = ctaLabel || (activePatient || session ? t("nav.resumeShort") : t("nav.startShort"));

  return (
    <header className="glass-surface sticky top-0 z-40 overflow-x-clip border-b transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl min-w-0 items-center gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-2.5">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setMobileMenuOpen(false);
            if (onLogoClick) {
              onLogoClick();
            } else {
              window.location.assign("/");
            }
          }}
          className={`flex min-w-0 items-center gap-2 text-left group ${navigation ? "shrink-0 sm:flex-none" : "flex-1 sm:flex-none"} sm:gap-3`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
            <img src="/logo.png" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className={`font-display truncate text-[15px] font-bold leading-none text-foreground sm:text-lg ${navigation ? "hidden sm:inline" : ""}`}>
                {t("app.name")}
              </p>
              <span className="hidden rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary sm:inline">
                {t("app.badge")}
              </span>
            </div>
            <p className="mt-0.5 hidden truncate text-[11px] font-medium tracking-wide text-muted-foreground md:block">
              {subtitle || t("app.tagline")}
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        {!simple && (
          <nav className="hidden items-center gap-5 text-sm font-semibold text-muted-foreground lg:flex">
            <a
              href="#interactive-demo"
              onClick={(e) => handleNavClick(e, "interactive-demo")}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.demo")}
            </a>
            <Link
              to="/features"
              onClick={() => soundEffects.playClick()}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.features")}
            </Link>
            <a
              href="#regional-culture"
              onClick={(e) => handleNavClick(e, "regional-culture")}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.states")}
            </a>
            <a
              href="#how-we-monitor"
              onClick={(e) => handleNavClick(e, "how-we-monitor")}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.privacy")}
            </a>
            <a
              href="#reviews"
              onClick={(e) => handleNavClick(e, "reviews")}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.stories")}
            </a>
          </nav>
        )}

        {navigation ? (
          <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navigation}
          </div>
        ) : null}

        {/* Action Controls */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <label className={`relative inline-flex items-center ${navigation ? "hidden md:inline-flex" : ""}`}>
            <Languages className="pointer-events-none absolute left-2.5 hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            <select
              value={lang}
              onChange={(e) => {
                soundEffects.playClick();
                setLang(e.target.value as typeof lang);
              }}
              className="h-8 w-[3.35rem] appearance-none rounded-full border border-border/80 bg-muted/50 px-2 text-center text-[11px] font-bold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50 sm:h-9 sm:w-auto sm:pl-7 sm:pr-6 sm:text-left sm:text-xs"
              aria-label="Select language"
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          {(session || activePatient) ? (
            <AvatarMenu
              initials={initials}
              userName={userName}
              photo={activePatient?.patient_photo}
              onDashboard={handleStart}
              onA11y={() => { soundEffects.playClick(); openA11yPanel(); }}
              onSignOut={() => void signOut()}
              hasSession={!!session}
            />
          ) : onStart ? (
            <Button
              onClick={handleStart}
              size="sm"
              className="h-8 rounded-full px-3 font-bold shadow-soft transition-all hover:shadow-lift sm:h-9 sm:px-5"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 sm:mr-1" />
              <span className="text-xs sm:hidden">{shortCta}</span>
              <span className="hidden text-sm sm:inline">{resolvedCta}</span>
            </Button>
          ) : null}

          {!simple && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setMobileMenuOpen((prev) => !prev);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-colors hover:bg-muted lg:hidden sm:h-9 sm:w-9"
              aria-label={mobileMenuOpen ? t("nav.close") : t("nav.menu")}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {!simple && mobileMenuOpen && (
        <div className="glass-surface lg:hidden border-t px-4 py-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-foreground">
            <a
              href="#interactive-demo"
              onClick={(e) => handleNavClick(e, "interactive-demo")}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.demo")}</span>
              <span className="text-xs text-primary font-bold">Try Now →</span>
            </a>
            <Link
              to="/features"
              onClick={() => {
                soundEffects.playClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.features")}</span>
              <span className="text-xs text-muted-foreground">3 Biomarkers</span>
            </Link>
            <a
              href="#regional-culture"
              onClick={(e) => handleNavClick(e, "regional-culture")}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.states")}</span>
              <span className="text-xs text-muted-foreground">NE Culture</span>
            </a>
            <a
              href="#how-we-monitor"
              onClick={(e) => handleNavClick(e, "how-we-monitor")}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.privacy")}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">100% Offline</span>
            </a>
            <a
              href="#reviews"
              onClick={(e) => handleNavClick(e, "reviews")}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.stories")}</span>
              <span className="text-xs text-muted-foreground">Clinics & Families</span>
            </a>
          </nav>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                openA11yPanel();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary py-1 px-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Accessibility className="h-4 w-4" />
              <span>{t("a11y.title")}</span>
            </button>
            <span className="text-[11px] text-muted-foreground">{t("app.tagline")}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
            <span className="mr-1 text-xs font-semibold text-muted-foreground">Language</span>
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setLang(item.code);
                }}
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
                  lang === item.code
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
                title={item.native}
                aria-label={`Switch to ${item.label}`}
              >
                {item.native}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Avatar Dropdown Component ────────────────────────────────────────────────
function AvatarMenu({
  initials,
  userName,
  photo,
  onDashboard,
  onA11y,
  onSignOut,
  hasSession,
}: {
  initials: string;
  userName: string;
  photo?: string | undefined;
  onDashboard?: () => void;
  onA11y?: () => void;
  onSignOut?: () => void;
  hasSession?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2 py-1 shadow-sm hover:bg-muted transition-all"
        aria-label="Profile menu"
      >
        <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-primary text-[11px] font-bold text-primary-foreground shrink-0">
          {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : initials || <User className="h-3.5 w-3.5" />}
        </span>
        <span className="hidden sm:inline max-w-[90px] truncate text-xs font-semibold text-foreground">
          {userName.split(" ")[0]}
        </span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="glass-surface absolute right-0 top-full mt-2 w-52 rounded-2xl border z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          {/* User info header */}
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs font-bold text-foreground truncate">{userName || "Patient"}</p>
            <p className="text-[11px] text-muted-foreground">SmritiMitra Account</p>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <button
              type="button"
              onClick={() => { setOpen(false); onDashboard?.(); }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Brain className="h-4 w-4 text-primary" />
              Go to Dashboard
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); onA11y?.(); }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings & Accessibility
            </button>
          </div>

          {hasSession && (
            <div className="border-t border-border py-1.5">
              <button
                type="button"
                onClick={() => { setOpen(false); onSignOut?.(); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Site Footer ───────────────────────────────────────────────────────────────
export function SiteFooter({ onStart }: { onStart?: () => void }) {
  const { t } = useI18n();
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>("terms");

  const openLegal = (tab: LegalTab) => {
    soundEffects.playClick();
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <>
      <footer className="glass-surface border-t transition-colors duration-300">
        {/* ── Main Footer Row ── */}
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-soft shrink-0">
              <img src="/logo.png" alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-display text-base font-bold text-foreground leading-tight">{t("app.name")}</p>
              <p className="text-[11px] text-muted-foreground">{t("app.tagline")}</p>
            </div>
          </div>

          {/* Emergency helpline */}
          <div className="flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
              <HeartPulse className="h-3.5 w-3.5" />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-bold text-foreground">Mental Health Helpline</p>
              <p className="text-[10px] text-muted-foreground">Tele-MANAS · 24/7 Free</p>
            </div>
            <a
              href="tel:14416"
              className="ml-2 inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-rose-700 transition-colors shrink-0"
            >
              <PhoneCall className="h-3 w-3" /> 14416
            </a>
          </div>

          {/* Quick legal links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => openLegal("terms")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <FileText className="h-3 w-3" /> Terms
            </button>
            <span aria-hidden className="opacity-40">·</span>
            <button
              type="button"
              onClick={() => openLegal("privacy")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Shield className="h-3 w-3" /> Privacy
            </button>
            <span aria-hidden className="opacity-40">·</span>
            <button
              type="button"
              onClick={() => openLegal("disclaimer")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <HeartPulse className="h-3 w-3" /> Disclaimer
            </button>
          </div>
        </div>

        {/* ── Copyright Bar ── */}
        <div className="border-t border-border/60 px-4 py-3 text-center">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} {t("footer.rights")} · Built for NE India with ❤️
          </p>
        </div>
      </footer>

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalTab}
      />
    </>
  );
}

