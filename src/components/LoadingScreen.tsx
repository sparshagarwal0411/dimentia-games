import { useEffect, useState } from "react";
import { Activity, CheckCircle2, ShieldCheck } from "lucide-react";

export function LoadingScreen({ onLoaded }: { onLoaded?: () => void }) {
  const [progress, setProgress] = useState(15);
  const [statusIdx, setStatusIdx] = useState(0);

  const statuses = [
    "Initializing SmritiMitra Clinical Engine...",
    "Securing HIPAA / DISHA Encrypted Local Vault...",
    "Calibrating North Eastern Regional Telemetry...",
    "Syncing Offline Synapse Memory Queues...",
    "Clinical Interface Ready.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoaded?.(), 300);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 25) + 15;
        return next > 100 ? 100 : next;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [onLoaded]);

  useEffect(() => {
    if (progress < 30) setStatusIdx(0);
    else if (progress < 55) setStatusIdx(1);
    else if (progress < 80) setStatusIdx(2);
    else if (progress < 95) setStatusIdx(3);
    else setStatusIdx(4);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-sans">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Animated Brand Logo */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 rounded-3xl bg-emerald-500/20 blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-900 text-emerald-400 shadow-2xl">
            <img src="/logo.png" alt="SmritiMitra logo" className="h-full w-full object-contain p-1 animate-bounce transition-transform duration-700" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-display">
          Smriti<span className="text-emerald-400">Mitra</span>
        </h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          A friend that helps preserve memories.
        </p>

        {/* Progress bar */}
        <div className="mt-8 w-full bg-slate-800/80 rounded-full h-2 p-0.5 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(16,185,129,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic status string */}
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400 min-h-[24px]">
          <Activity className="h-3.5 w-3.5 animate-spin text-emerald-400" />
          <span>{statuses[statusIdx]}</span>
        </div>

        {/* Footer badges */}
        <div className="mt-12 flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> AES-256 Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> DISHA Compliant
          </span>
        </div>
      </div>
    </div>
  );
}
