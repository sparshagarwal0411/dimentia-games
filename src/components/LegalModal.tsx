import { useState } from "react";
import {
  AlertTriangle,
  FileText,
  HeartPulse,
  PhoneCall,
  Shield,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type LegalTab = "terms" | "privacy" | "disclaimer" | "helplines";

export function LegalModal({
  isOpen,
  onClose,
  defaultTab = "terms",
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: LegalTab;
}) {
  const [activeTab, setActiveTab] = useState<LegalTab>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg font-bold text-foreground">
                Legal, Privacy & Clinical Transparency
              </h2>
              <p className="text-xs text-muted-foreground">
                SmritiMitra · Governed under Indian Healthcare Data Guidelines & DPDP Act 2023
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-muted/20 px-6 overflow-x-auto">
          {[
            { id: "terms" as const, label: "Terms of Service", icon: FileText },
            { id: "privacy" as const, label: "Privacy & DPDP", icon: Shield },
            { id: "disclaimer" as const, label: "Clinical Disclaimer", icon: AlertTriangle },
            { id: "helplines" as const, label: "NER 24/7 Helplines", icon: PhoneCall },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-muted-foreground space-y-4">
          {activeTab === "terms" && (
            <div className="space-y-4 text-foreground">
              <h3 className="text-base font-bold text-foreground">1. User Agreement & Acceptable Use</h3>
              <p className="leading-relaxed">
                By accessing or using SmritiMitra ("the Platform"), you acknowledge and agree that this software is an
                assistive cognitive monitoring tool intended for educational screening, habit tracking, and brain exercises.
              </p>
              <h4 className="font-semibold text-foreground">2. Scope of Services</h4>
              <p className="leading-relaxed">
                The platform provides digital cognitive tasks (memory cards, pattern tracking, Stroop attention, verbal fluency),
                passive behavioral biomarker telemetry (sleep, interaction cadence, optional motion metrics), and family reporting dashboards.
              </p>
              <h4 className="font-semibold text-foreground">3. User Responsibility & Elder Consent</h4>
              <p className="leading-relaxed">
                Caregivers and healthcare workers assisting elderly individuals must ensure the participant understands the tasks
                and is comfortable with the digital interface. Participation is entirely voluntary and can be paused or reset at any time.
              </p>
              <h4 className="font-semibold text-foreground">4. Intellectual Property & Regional Adaptation</h4>
              <p className="leading-relaxed">
                All regional translations (Assamese, Hindi), indigenous cultural illustrations, cognitive task formulations, and adaptive AI algorithms are proprietary to SmritiMitra and licensed clinical partners.
              </p>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4 text-foreground">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-300">
                <p className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  Local-First & Offline Privacy Guarantee
                </p>
                <p className="text-xs mt-1">
                  Your cognitive screening scores and behavioral logs reside encrypted in your browser's local sandbox and are only synced when you explicitly authenticate.
                </p>
              </div>

              <h3 className="text-base font-bold text-foreground">Digital Personal Data Protection (DPDP Act 2023) Compliance</h3>
              <p className="leading-relaxed">
                SmritiMitra adheres to the principles of purpose limitation, data minimization, and storage limitation under Indian data protection statutes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>No Commercial Data Brokerage:</strong> We never sell, lease, or monetize cognitive assessment records.</li>
                <li><strong>Zero Keystroke / Message Logging:</strong> Typing speed telemetry records only cadence timing in milliseconds, never the semantic content of messages.</li>
                <li><strong>30-Day Automated Local Purge:</strong> Raw behavioral sensor logs expire and are purged after 30 days.</li>
                <li><strong>Right to Erasure:</strong> You can clear all cached profiles, game attempts, and screening history in 1-click via the Settings/Accessibility panel.</li>
              </ul>
            </div>
          )}

          {activeTab === "disclaimer" && (
            <div className="space-y-4 text-foreground">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-300">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Non-Diagnostic Medical Notice
                </p>
                <p className="text-xs mt-1">
                  SmritiMitra is NOT a certified medical diagnostic device. It does not replace a clinical neurological examination, MRI/PET scan, or formal neuropsychological evaluation.
                </p>
              </div>

              <h3 className="text-base font-bold text-foreground">Clinical Intended Purpose</h3>
              <p className="leading-relaxed">
                The screening scores (Low, Moderate, High Likelihood) indicate statistical patterns compared against age-adjusted normative baselines. A high score suggests seeking a formal evaluation by a certified neurologist or geriatrician.
              </p>
              <h4 className="font-semibold text-foreground">When to Seek Immediate Medical Attention</h4>
              <p className="leading-relaxed">
                If an individual experiences sudden onset confusion, rapid personality changes, severe memory loss within hours/days, facial drooping, or speech slurring, call emergency services immediately (112 / 108) as these are indicators of acute stroke or delirium.
              </p>
            </div>
          )}

          {activeTab === "helplines" && (
            <div className="space-y-4 text-foreground">
              <h3 className="text-base font-bold text-foreground">North-East Regional Emergency & Dementia Helplines</h3>
              <p className="text-xs text-muted-foreground">
                Free 24/7 mental health and neurological support lines verified across North East India:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/40 p-3.5">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <HeartPulse className="h-4 w-4 text-rose-500" /> Tele-MANAS (Govt of India)
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Toll-free 24/7 Multilingual Support</p>
                  <a href="tel:14416" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                    <PhoneCall className="h-3.5 w-3.5" /> 14416 / 1800-891-4416
                  </a>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-3.5">
                  <p className="font-bold text-foreground">AIIMS Guwahati Neurology</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Assam & Regional Referrals</p>
                  <p className="text-xs text-foreground font-semibold mt-2">Changsari, Kamrup, Assam</p>
                  <a href="tel:03612912000" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1">
                    <PhoneCall className="h-3.5 w-3.5" /> 0361-2912000
                  </a>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-3.5">
                  <p className="font-bold text-foreground">NEIGRIHMS Shillong</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Meghalaya & Surrounding Hills</p>
                  <p className="text-xs text-foreground font-semibold mt-2">Mawdiangdiang, Shillong</p>
                  <a href="tel:03642538011" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1">
                    <PhoneCall className="h-3.5 w-3.5" /> 0364-2538011
                  </a>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-3.5">
                  <p className="font-bold text-foreground">RIMS Imphal Neuro-Care</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Manipur & Border Districts</p>
                  <p className="text-xs text-foreground font-semibold mt-2">Lamphelpat, Imphal West</p>
                  <a href="tel:03852414629" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1">
                    <PhoneCall className="h-3.5 w-3.5" /> 0385-2414629
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-border px-6 py-4 bg-muted/40 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Version 2.4 · Updated August 2026
          </p>
          <Button onClick={onClose} className="rounded-full px-6">
            Understood & Close
          </Button>
        </div>
      </div>
    </div>
  );
}
