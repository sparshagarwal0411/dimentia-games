import { useState } from "react";
import {
  Brain,
  ShieldCheck,
  Stethoscope,
  Users,
  Lock,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";

interface AuthGateProps {
  onCancel?: () => void;
}

export function AuthGate({ onCancel }: AuthGateProps) {
  const { signInWithGoogle, authLoading } = useApp();
  const { t } = useI18n();
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setSigning(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Sign-in failed. Please try again.");
      setSigning(false);
    }
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 shadow-lift">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      {/* Unified Site Header */}
      <SiteHeader simple onLogoClick={onCancel} onStart={onCancel} ctaLabel={t("common.back")} />

      {/* Hero / Sign-in Section */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16">
        {/* Ambient Glow */}
        <div
          className="pointer-events-none absolute inset-0 surface-hero opacity-60"
        />

        <div className="relative w-full max-w-md">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary mb-3">
              <Lock className="h-3.5 w-3.5" />
              {t("auth.portalBadge")}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t("auth.title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("auth.subtitle")}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-border bg-card/95 p-6 sm:p-8 shadow-lift backdrop-blur-sm transition-all">
            {/* Trust points */}
            <ul className="mb-6 space-y-3">
              {[
                { icon: Stethoscope, label: t("auth.bullet1") },
                { icon: ShieldCheck, label: t("auth.bullet2") },
                { icon: Users, label: t("auth.bullet3") },
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mt-0.5">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm text-foreground/90 leading-snug">{f.label}</span>
                </li>
              ))}
            </ul>

            {/* Error message */}
            {error && (
              <p className="mb-4 rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-xs sm:text-sm text-destructive text-center font-medium">
                {error}
              </p>
            )}

            {/* Sign-in button */}
            <button
              type="button"
              onClick={handleSignIn}
              disabled={signing}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-foreground text-background px-5 py-3.5 text-sm font-bold shadow-md transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {signing ? (
                <div className="h-5 w-5 rounded-full border-2 border-background/40 border-t-background animate-spin" />
              ) : (
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>{signing ? t("auth.buttonRedirecting") : t("auth.buttonGoogle")}</span>
            </button>

            {/* Back link */}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="mt-4 w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("auth.backHome")}
              </button>
            )}

            {/* Privacy note */}
            <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground/80">
              {t("auth.privacyFooter")}
            </p>
          </div>
        </div>
      </main>

      {/* Unified Site Footer */}
      <SiteFooter onStart={onCancel} />
    </div>
  );
}

