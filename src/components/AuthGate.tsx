import { useState } from "react";
import {
  Brain,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useApp } from "@/lib/app-state";

interface AuthGateProps {
  onCancel?: () => void;
}

export function AuthGate({ onCancel }: AuthGateProps) {
  const { signInWithGoogle, authLoading } = useApp();
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <Brain className="h-6 w-6 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-slate-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button type="button" onClick={onCancel} className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <Brain className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-base leading-none text-white">NeuroTrack NE</p>
              <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-400">
                Cognitive care for the North East
              </p>
            </div>
          </button>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-400 md:flex">
            <a href="/#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="/#how-we-monitor" className="hover:text-white transition-colors">Privacy</a>
          </nav>
        </div>
      </header>

      {/* ─── Hero / Sign-in card ─── */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 10%, rgba(16,185,129,0.09) 0%, transparent 70%)",
          }}
        />

        <div className="relative w-full max-w-md">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Clinical Portal
          </p>

          <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sign in to NeuroTrack NE
          </h1>
          <p className="mb-8 text-center text-sm text-slate-400">
            Securely manage patient records and cognitive care data for North East India.
          </p>

          {/* Card */}
          <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">
            {/* Trust badges */}
            <ul className="mb-6 space-y-2.5">
              {[
                { icon: Stethoscope, label: "Clinical patient records synced securely" },
                { icon: ShieldCheck, label: "End-to-end encrypted, HIPAA-aligned storage" },
                { icon: Users, label: "Multi-caregiver access across NE India nodes" },
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <f.icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300">{f.label}</span>
                </li>
              ))}
            </ul>

            {/* Error */}
            {error && (
              <p className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 text-center">
                {error}
              </p>
            )}

            {/* Sign-in button */}
            <button
              type="button"
              onClick={handleSignIn}
              disabled={signing}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-600 bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 shadow-md transition-all hover:bg-slate-100 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {signing ? (
                <div className="h-5 w-5 rounded-full border-2 border-slate-400 border-t-slate-900 animate-spin" />
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
              {signing ? "Redirecting to Google…" : "Continue with Google"}
            </button>

            {/* Back link */}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Back to home
              </button>
            )}

            {/* Privacy note */}
            <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-600">
              Patient data is stored in Supabase under your account.
              <br />
              Data stays on-device when offline and syncs automatically on reconnect.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="font-semibold text-base text-white">NeuroTrack NE</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
              Early cognitive screening, behavioural biomarkers and daily memory support designed for
              families and clinics across North East India.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Care</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Profile onboarding</li>
              <li>5-minute dementia screening</li>
              <li>Memory games &amp; cognitive exercises</li>
              <li>Doctor contacts for NE clinics</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Privacy &amp; Trust</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Records and behavioural telemetry stay on-device when offline. This tool supports
              screening, monitoring and education — it is not a medical diagnosis.
            </p>
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} NeuroTrack NE · Built for Assam, Meghalaya, Manipur,
          Mizoram, Nagaland, Tripura, Arunachal Pradesh and Sikkim
        </div>
      </footer>
    </div>
  );
}
