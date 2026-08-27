import { Activity, ArrowRight, Brain, HeartHandshake, Languages, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";

const FEATURES = [
  {
    icon: Brain,
    title: "Guided three-part screening",
    body: "Cognitive, speech, and behavioral pattern tests. Speech answers can be scored on this device. This is a snapshot, not a diagnosis.",
  },
  {
    icon: Sparkles,
    title: "Daily brain games",
    body: "Memory cards, face matching, tricky colours, word fluency, speech echo and find-it games — with XP, streaks and a weekly tournament.",
  },
  {
    icon: HeartHandshake,
    title: "Family caregiver portal",
    body: "When risk is not indicated, families still get a clear record, education, and a place to follow a loved one’s progress.",
  },
  {
    icon: Languages,
    title: "Built for the North East",
    body: "Assamese, Hindi and English, with examples drawn from local life — tea gardens, markets, festivals and daily routines.",
  },
  {
    icon: Smartphone,
    title: "Works with weak internet",
    body: "Screening and games continue offline. Progress syncs when the connection returns.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Profiles and scores stay on this device unless you choose to sign in. No clutter, no clinical jargon dumped on families.",
  },
];

const REVIEWS = [
  {
    quote:
      "The screening felt like a conversation, not a hospital form. My father in Jorhat finished it without getting anxious.",
    name: "Priyanka Sharma",
    role: "Daughter and caregiver, Assam",
  },
  {
    quote:
      "We finally have a simple first step before referring someone to neurology. Families understand the next action.",
    name: "Dr. Lanu Jamir",
    role: "Community physician, Nagaland",
  },
  {
    quote:
      "The games use things we actually know — bamboo baskets, morning tea. That matters more than people think.",
    name: "Roderick Marak",
    role: "ASHA facilitator, Meghalaya",
  },
];

export function LandingPage({
  onStart,
  onResume,
}: {
  onStart: () => void;
  onResume?: (() => void) | undefined;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader onStart={onStart} />

      <section className="surface-hero border-b border-border/60">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Early care, closer to home
            </p>
            <h1 className="mt-4 max-w-xl text-4xl leading-tight text-foreground sm:text-5xl">
              Know sooner. Support memory with calm, local tools.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              NeuroTrack NE helps families in North East India screen for early dementia, then opens the
              right next step: training and a dashboard if support is needed, or a clear family portal if it
              is not.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" className="rounded-full px-6" onClick={onStart}>
                Start onboarding
                <ArrowRight className="h-4 w-4" />
              </Button>
              {onResume ? (
                <Button size="lg" variant="outline" className="rounded-full px-6" onClick={onResume}>
                  Continue where you left off
                </Button>
              ) : (
                <a
                  href="#how-it-works"
                  className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  See how it works
                </a>
              )}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Screening is a guide, not a diagnosis. Please see a clinician for medical advice.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your path</p>
            <ol className="mt-4 space-y-4">
              {[
                ["Onboard", "Create a profile from the landing page — name, age, location, family contact."],
                ["Dashboard", "Land on your home screen. Dementia status is unknown until you take the test."],
                ["Screening", "Three tests — cognitive, speech, and behavioral pattern — plus optional How we monitor."],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Features</p>
          <h2 className="mt-3 text-3xl text-foreground">Built for real homes, not demo dashboards</h2>
          <p className="mt-3 text-muted-foreground">
            Everything after screening is chosen for the person in front of you — not a wall of clinical tabs.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="weave border-y border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl text-foreground">What happens after you start</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Screening and games are both part of the product. Tests give a snapshot; games are daily practice.
            You do not have to choose one over the other.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-sm font-semibold text-clay">Three tests</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Cognitive, speech and behavioral pattern scores combine into one guide. If risk looks higher,
                doctor contacts and family tools sit next to games on the dashboard.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-sm font-semibold text-primary">Games stay open</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Memory, speech and attention games are available after onboarding for daily practice, XP and
                a gentle weekly tournament — whether screening is high or low.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-we-monitor" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Privacy-first</p>
        <h2 className="mt-3 text-3xl text-foreground">How we monitor?</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Optional pattern tracking to support cognitive health assessment. All data stays on your device.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">What we monitor</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Daily activity patterns and movement</li>
              <li>Sleep-wake cycles and screen time</li>
              <li>Typing speed and accuracy patterns</li>
              <li>App usage and interaction frequency</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Privacy guarantees</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>All data processed locally on your device</li>
              <li>No personal content or messages analyzed</li>
              <li>You can disable tracking anytime</li>
              <li>Data automatically deleted after 30 days</li>
            </ul>
          </article>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/behavioral"
            className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Open How we monitor
          </a>
          <p className="self-center text-xs text-muted-foreground">Enable when you are ready — or skip with Maybe later.</p>
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Stories</p>
        <h2 className="mt-3 text-3xl text-foreground">Trusted by families and field clinics</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <blockquote key={review.name} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="flex-1 text-sm leading-relaxed text-foreground">“{review.quote}”</p>
              <footer className="mt-6">
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-2xl text-foreground">Ready when your family is</h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Create a profile, open the dashboard, then take the screening when you are ready.
            </p>
          </div>
          <Button size="lg" className="rounded-full px-6" onClick={onStart}>
            Start onboarding
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
