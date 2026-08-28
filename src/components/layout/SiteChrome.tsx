import { useState } from "react";
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
  Languages,
} from "lucide-react";
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
}: {
  onStart?: () => void;
  onLogoClick?: () => void;
  ctaLabel?: string;
  simple?: boolean;
}) {
  const { openA11yPanel } = useApp();
  const { lang, setLang, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    soundEffects.playClick();
    setMobileMenuOpen(false);
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = targetId;
    }
  };

  const handleStart = () => {
    soundEffects.playSuccess();
    setMobileMenuOpen(false);
    onStart?.();
  };

  const resolvedCta = ctaLabel || t("nav.start");

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setMobileMenuOpen(false);
            onLogoClick?.();
          }}
          className="flex items-center gap-2 sm:gap-3 text-left group shrink-0"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <p className="font-display text-base sm:text-lg font-bold leading-none text-foreground">
                {t("app.name")}
              </p>
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-primary">
                {t("app.badge")}
              </span>
            </div>
            <p className="hidden sm:block mt-0.5 text-[11px] font-medium tracking-wide text-muted-foreground">
              {t("app.tagline")}
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
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.features")}
            </a>
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

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Language Toggle */}
          <div className="hidden items-center rounded-full border border-border/80 bg-muted/50 p-0.5 sm:flex">
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
                aria-label={`Switch to ${item.label}`}
              >
                {item.code.toUpperCase()}
              </button>
            ))}
          </div>
          <select
            value={lang}
            onChange={(event) => {
              soundEffects.playClick();
              setLang(event.target.value as typeof lang);
            }}
            className="h-8 w-12 rounded-full border border-border/80 bg-muted/50 px-1 text-center text-[11px] font-bold text-foreground sm:hidden"
            aria-label="Language"
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Accessibility Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              soundEffects.playClick();
              openA11yPanel();
            }}
            className="flex h-8 w-8 items-center justify-center gap-1 rounded-full border-border/80 px-0 text-xs font-semibold text-foreground hover:bg-muted sm:h-9 sm:w-auto sm:px-3"
            title={t("a11y.title")}
          >
            <Accessibility className="h-4 w-4 text-primary shrink-0" />
            <span className="hidden xl:inline">{t("a11y.title")}</span>
          </Button>

          {/* CTA Button */}
          {onStart ? (
            <Button
              onClick={handleStart}
              size="sm"
              className="h-8 w-8 rounded-full px-0 font-bold shadow-soft transition-all hover:shadow-lift sm:h-9 sm:w-auto sm:px-5"
            >
              <Sparkles className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden truncate text-xs sm:inline sm:max-w-none sm:text-sm">{resolvedCta}</span>
            </Button>
          ) : null}

          {/* Mobile Hamburger Menu Toggle */}
          {!simple && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setMobileMenuOpen((prev) => !prev);
              }}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border/80 bg-card text-foreground lg:hidden hover:bg-muted transition-colors"
              aria-label={mobileMenuOpen ? t("nav.close") : t("nav.menu")}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {!simple && mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-xl px-4 py-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-foreground">
            <a
              href="#interactive-demo"
              onClick={(e) => handleNavClick(e, "interactive-demo")}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.demo")}</span>
              <span className="text-xs text-primary font-bold">Try Now →</span>
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.features")}</span>
              <span className="text-xs text-muted-foreground">3 Biomarkers</span>
            </a>
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

          <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 sm:hidden">
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
                {item.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

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
      <footer className="border-t border-border bg-card transition-colors duration-300">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 sm:px-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Brain className="h-4 w-4" />
              </div>
              <p className="font-display text-lg font-bold text-foreground">{t("app.name")}</p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("hero.subhead")}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t("hero.metric1Label")}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">{t("nav.features")}</p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>
                <button
                  type="button"
                  onClick={onStart}
                  className="hover:text-primary transition-colors text-left"
                >
                  {t("features.title")}
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  9 AI Adaptive Brain Games
                </a>
              </li>
              <li>
                <a href="#how-we-monitor" className="hover:text-primary transition-colors">
                  {t("nav.privacy")}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal("helplines")}
                  className="hover:text-primary transition-colors text-left"
                >
                  North East Neuro-Clinic Network
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Legal & Privacy</p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>
                <button
                  type="button"
                  onClick={() => openLegal("terms")}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1.5"
                >
                  <FileText className="h-3 w-3" />
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal("privacy")}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1.5"
                >
                  <Shield className="h-3 w-3" />
                  Privacy Policy (DPDP Act 2023)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal("disclaimer")}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1.5"
                >
                  <HeartPulse className="h-3 w-3" />
                  Clinical & AI Disclaimer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal("helplines")}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1.5 font-bold text-primary"
                >
                  <PhoneCall className="h-3 w-3" />
                  {t("nav.emergency")}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">{t("nav.states")}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Culturally adapted for Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Assamese", "Hindi", "English", "Khasi", "Meiteilon", "Mizo", "Nagamese"].map((langName) => (
                <span
                  key={langName}
                  className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                >
                  {langName}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/80 px-4 py-4 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-2 sm:px-6">
          <p>© {new Date().getFullYear()} {t("app.name")} · Built with clinical respect for North East India</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => openLegal("terms")}
              className="hover:text-foreground transition-colors underline"
            >
              Legal
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => openLegal("privacy")}
              className="hover:text-foreground transition-colors underline"
            >
              Privacy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => openLegal("disclaimer")}
              className="hover:text-foreground transition-colors underline"
            >
              Disclaimer
            </button>
          </div>
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

