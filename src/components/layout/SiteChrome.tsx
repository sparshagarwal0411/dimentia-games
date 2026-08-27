import { Accessibility, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";

export function SiteHeader({
  onStart,
  onLogoClick,
  ctaLabel = "Start onboarding",
  simple = false,
}: {
  onStart?: () => void;
  onLogoClick?: () => void;
  ctaLabel?: string;
  simple?: boolean;
}) {
  const { openA11yPanel } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button type="button" onClick={onLogoClick} className="flex items-center gap-3 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-none text-foreground">NeuroTrack NE</p>
            <p className="mt-0.5 text-[11px] font-medium tracking-wide text-muted-foreground">
              Cognitive care for the North East
            </p>
          </div>
        </button>

        {!simple && (
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="/#features" className="hover:text-foreground">
              Features
            </a>
            <a href="/#how-we-monitor" className="hover:text-foreground">
              How we monitor
            </a>
            <a href="/#how-it-works" className="hover:text-foreground">
              How it works
            </a>
            <a href="/#reviews" className="hover:text-foreground">
              Stories
            </a>
          </nav>
        )}

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openA11yPanel}
            className="flex items-center gap-1.5 rounded-full border-border/80 px-3 text-xs font-semibold text-foreground hover:bg-muted"
            title="Open Accessibility Settings"
          >
            <Accessibility className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Accessibility</span>
          </Button>

          {onStart ? (
            <Button onClick={onStart} className="rounded-full px-5">
              {ctaLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-lg font-semibold">NeuroTrack NE</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Early cognitive screening, behavioral biomarkers and daily memory support designed for families
            and clinics across North East India.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Care</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Three-part screening (cognitive, speech, behavior)</li>
            <li>Daily brain games and weekly tournaments</li>
            <li>On-device behavioral monitoring</li>
            <li>Doctor contacts for North East clinics</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Trust</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Records and behavioral telemetry stay on-device when you are offline. This tool supports
            screening, monitoring and education — it is not a medical diagnosis.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NeuroTrack NE · Built for Assam, Meghalaya, Manipur, Mizoram, Nagaland,
        Tripura, Arunachal Pradesh and Sikkim
      </div>
    </footer>
  );
}
