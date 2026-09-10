import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Languages,
  LockKeyhole,
  Mic2,
  ShieldCheck,
  Sparkles,
  WifiOff,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";

const FEATURE_LANES = [
  {
    number: "01",
    eyebrow: "Clinical triad",
    title: "One calm picture from three signals.",
    description:
      "SmritiMitra brings cognitive tasks, speech rhythm, and everyday behavioral patterns into one gentle screening journey. Each signal adds context without turning the experience into a hospital form.",
    icon: Brain,
    accent: "feature-lane--teal",
    details: [
      "Memory, attention, and orientation tasks",
      "Voice rhythm, pauses, and fluency cues",
      "Behavioral patterns tracked with consent",
    ],
  },
  {
    number: "02",
    eyebrow: "Adaptive cognitive gym",
    title: "Practice that meets the person.",
    description:
      "Nine short activities adjust their challenge from L1 to L5 using response speed and accuracy. Familiar objects and routines make repetition feel useful, not clinical.",
    icon: Sparkles,
    accent: "feature-lane--sun",
    details: [
      "Memory, Stroop, recall, and pattern games",
      "Difficulty responds to the latest session",
      "Large targets designed for older hands",
    ],
  },
  {
    number: "03",
    eyebrow: "Regional voice",
    title: "Care that speaks like home.",
    description:
      "Voice guidance, read-aloud cues, and cultural references are shaped for North Eastern households. The interface keeps language choice close at hand, without hiding it in settings.",
    icon: Languages,
    accent: "feature-lane--clay",
    details: [
      "Assamese, Hindi, and English guidance",
      "Speech-assisted prompts and answers",
      "Stimuli grounded in local life across 8 states",
    ],
  },
  {
    number: "04",
    eyebrow: "Local-first privacy",
    title: "Useful even when the network disappears.",
    description:
      "Screening and game progress stay encrypted on the device first. Offline queues synchronize when a connection returns, while private message contents and keystrokes are never collected.",
    icon: ShieldCheck,
    accent: "feature-lane--leaf",
    details: [
      "Works across low-connectivity districts",
      "Encrypted local vault with offline queues",
      "Clear controls for pausing or deleting data",
    ],
  },
];

const SESSION_STEPS = [
  { number: "01", title: "Choose a language", icon: Languages },
  { number: "02", title: "Complete a short check-in", icon: Brain },
  { number: "03", title: "See clear next steps", icon: Zap },
];

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SiteHeader />

      <main>
        <section className="feature-hero relative overflow-hidden border-b border-border/80 py-20 sm:py-28">
          <div className="feature-hero-grid pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-4xl">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
                  <img src="/logo.png" alt="SmritiMitra logo" className="h-full w-full object-contain p-1" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-foreground">SmritiMitra</p>
                  <p className="text-xs text-muted-foreground">A friend that helps preserve memories.</p>
                </div>
              </div>
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                <span className="h-px w-10 bg-primary" /> The care suite
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.94] tracking-tight text-foreground sm:text-7xl">
                Designed around the person, not the diagnosis.
              </h1>
              <p className="mt-7 max-w-2xl border-l-2 border-primary/50 pl-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Explore the tools behind a calmer screening experience, from adaptive brain activities to local-first privacy and familiar regional cues.
              </p>
            </div>

            <div className="mt-14 grid gap-px border-y border-border/80 bg-border/80 sm:grid-cols-3">
              <div className="bg-background/90 p-5 sm:p-6">
                <p className="text-3xl font-black text-primary">3</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Biomarkers, one view</p>
              </div>
              <div className="bg-background/90 p-5 sm:p-6">
                <p className="text-3xl font-black text-primary">9</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Adaptive activities</p>
              </div>
              <div className="bg-background/90 p-5 sm:p-6">
                <p className="text-3xl font-black text-primary">0</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Cloud dependency</p>
              </div>
            </div>
          </div>
        </section>

        {/* Relatable Family Spotlight */}
        <section className="border-b border-border/80 bg-card/40 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft">
              <div className="grid md:grid-cols-12 items-center">
                <div className="relative md:col-span-6 h-64 sm:h-80 md:h-full min-h-[280px] overflow-hidden bg-muted">
                  <img
                    src="/images/family_care_northeast.jpg"
                    alt="Elderly father and daughter practicing brain exercises together in North East India"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                  <div className="absolute bottom-3 left-3 text-white md:hidden">
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold">Dibrugarh, Assam</span>
                  </div>
                </div>
                <div className="md:col-span-6 p-6 sm:p-10 space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    👵🏼 Made for Elders & Caregivers
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Care that brings generations closer together.
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Instead of stressful hospital clinical checklists, SmritiMitra encourages gentle daily practice. A daughter guiding her father through memory tiles or an ASHA worker testing voice fluency in a village courtyard.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-2xl border border-border/80 bg-muted/40 p-3">
                      <p className="text-xs font-bold text-foreground">Native Voice Prompts</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Assamese, Hindi, and English guidance</p>
                    </div>
                    <div className="rounded-2xl border border-border/80 bg-muted/40 p-3">
                      <p className="text-xs font-bold text-foreground">Elder Mode Controls</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">High contrast, large font, relaxed timer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">The system</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Four parts. One gentler rhythm.</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Every layer is built to reduce friction for families, clinicians, and community workers.
            </p>
          </div>

          <div className="divide-y divide-border/80 border-y border-border/80">
            {FEATURE_LANES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.number} className={`feature-lane ${feature.accent} group grid gap-8 py-10 md:grid-cols-12 md:gap-10 md:py-14`}>
                  <div className="md:col-span-2">
                    <span className="font-mono text-sm font-bold text-primary">{feature.number}</span>
                    <div className="mt-6 flex h-12 w-12 items-center justify-center border border-current/25 text-current transition-transform duration-300 group-hover:translate-x-1">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-current">{feature.eyebrow}</p>
                    <h3 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-4xl">{feature.title}</h3>
                  </div>
                  <div className="md:col-span-5">
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{feature.description}</p>
                    <ul className="mt-5 space-y-2">
                      {feature.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-xs font-semibold text-foreground sm:text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-current" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border/80 bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">A session in three moves</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Simple enough to return to.</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                  The system keeps the next action visible, so a family member can guide without taking over.
                </p>
              </div>
              <div className="lg:col-span-7">
                <div className="grid gap-px border-y border-border/80 bg-border/80 sm:grid-cols-3">
                  {SESSION_STEPS.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.number} className="bg-background/80 p-5 sm:p-6">
                        <div className="flex items-center justify-between text-primary">
                          <Icon className="h-5 w-5" />
                          <span className="font-mono text-xs font-bold">{step.number}</span>
                        </div>
                        <p className="mt-10 text-sm font-bold text-foreground">{step.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Built for real conditions</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">The signal can drop. Care does not.</h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                From tea estates to hill districts, the experience is designed for imperfect connectivity, shared devices, and the dignity of moving at your own pace.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold text-foreground">
                <span className="inline-flex items-center gap-2 border border-border px-3 py-2"><WifiOff className="h-4 w-4 text-primary" /> Offline ready</span>
                <span className="inline-flex items-center gap-2 border border-border px-3 py-2"><LockKeyhole className="h-4 w-4 text-primary" /> Device-first privacy</span>
                <span className="inline-flex items-center gap-2 border border-border px-3 py-2"><Mic2 className="h-4 w-4 text-primary" /> Voice assisted</span>
              </div>
            </div>
            <div className="relative border-y border-primary/40 px-6 py-10 sm:px-10">
              <div className="absolute left-0 top-0 h-14 w-14 border-l-2 border-t-2 border-primary" />
              <div className="absolute bottom-0 right-0 h-14 w-14 border-b-2 border-r-2 border-primary/50" />
              <LockKeyhole className="h-8 w-8 text-primary" />
              <p className="mt-6 text-2xl font-black leading-tight text-foreground sm:text-3xl">Your data should support care, not become the product.</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Encrypted local storage, transparent controls, and no cloud requirement for everyday use.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-primary py-16 text-primary-foreground sm:py-20">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-4 sm:flex-row sm:items-center sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/70">Start with the experience</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">See how SmritiMitra feels.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/" hash="interactive-demo">
                <Button className="rounded-md bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Try the live demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/" className="inline-flex items-center px-3 text-sm font-bold text-primary-foreground/80 hover:text-primary-foreground">
                Back home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
