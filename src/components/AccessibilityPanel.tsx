import {
  Accessibility,
  Check,
  Contrast,
  Eye,
  Hand,
  Mic,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  Turtle,
  Type,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { readScreen, speak, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

const handleToggleRowKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.currentTarget.click();
  }
};

export function AccessibilityPanel() {
  const { prefs, setPref, resetPrefs, a11yPanelOpen, setA11yPanelOpen } = useApp();
  const { t, locale } = useI18n();

  const announce = (text: string) => {
    if (prefs.voice_guidance && !prefs.reduce_sounds) speak(text, locale, prefs.slow_mode);
  };

  const handleTextSizeChange = (scale: number, label: string) => {
    setPref("text_scale", scale);
    announce(`Text size set to ${label}`);
  };

  const handleContrastPreset = (type: "normal" | "high" | "extra-high") => {
    if (type === "normal") {
      setPref("high_contrast", false);
      setPref("extra_high_contrast", false);
      announce("Contrast set to normal");
    } else if (type === "high") {
      setPref("high_contrast", true);
      setPref("extra_high_contrast", false);
      announce("High contrast enabled");
    } else {
      setPref("high_contrast", true);
      setPref("extra_high_contrast", true);
      announce("Extra high contrast enabled");
    }
  };

  const activeContrast = prefs.extra_high_contrast
    ? "extra-high"
    : prefs.high_contrast
      ? "high"
      : "normal";

  return (
    <>
      {/* Floating Accessibility Action Button */}
      <button
        type="button"
        id="floating-accessibility-btn"
        aria-label="Open accessibility settings and controls"
        title="Accessibility Settings"
        onClick={() => {
          setA11yPanelOpen(true);
          announce("Accessibility controls opened");
        }}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-all hover:scale-105 hover:shadow-2xl focus-visible:outline-4 focus-visible:outline-ring"
      >
        <Accessibility className="h-7 w-7" />
        <span className="sr-only">Accessibility Settings</span>
      </button>

      {/* Accessibility Settings Sheet Modal */}
      <Sheet open={a11yPanelOpen} onOpenChange={setA11yPanelOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader className="text-left pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Accessibility className="h-6 w-6" />
              </div>
              <div>
                <span>{t("a11y.title")}</span>
                <p className="text-xs font-normal text-muted-foreground mt-0.5">
                  Customize text, contrast, voice, and motion for your comfort
                </p>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-5 px-1 py-5">
            {/* Screen Reader & Speak Page */}
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                readScreen(document.querySelector("main"), locale, prefs.slow_mode);
              }}
              className="surface-warm tap flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left text-lg font-semibold text-sun-foreground shadow-soft transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <Volume2 className="h-6 w-6 shrink-0" />
                <span>{t("a11y.read")}</span>
              </div>
              <span className="rounded-full bg-white/30 px-3 py-1 text-xs font-medium uppercase tracking-wider">
                Listen
              </span>
            </button>

            {/* Text Size Control */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-base font-semibold">
                <Type className="h-5 w-5 text-primary" />
                <span>{t("a11y.text")}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { scale: 0.9, label: "Small", short: "S" },
                  { scale: 1.0, label: "Default", short: "M" },
                  { scale: 1.2, label: "Large", short: "L" },
                  { scale: 1.4, label: "Extra", short: "XL" },
                ].map((item) => (
                  <button
                    key={item.scale}
                    type="button"
                    onClick={() => handleTextSizeChange(item.scale, item.label)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border-2 py-2.5 font-semibold transition-all",
                      Math.abs(prefs.text_scale - item.scale) < 0.05
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background hover:bg-muted text-foreground",
                    )}
                  >
                    <span className="text-base leading-none">{item.short}</span>
                    <span className="text-[10px] mt-1 opacity-80">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Presets */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-base font-semibold">
                <Contrast className="h-5 w-5 text-primary" />
                <span>Contrast & Display Mode</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "normal" as const, label: "Standard" },
                  { id: "high" as const, label: "High Contrast" },
                  { id: "extra-high" as const, label: "Max (OLED)" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleContrastPreset(opt.id)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-xl border-2 p-2.5 text-xs font-semibold transition-all text-center",
                      activeContrast === opt.id
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background hover:bg-muted text-foreground",
                    )}
                  >
                    {activeContrast === opt.id && <Check className="h-3.5 w-3.5" />}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles List */}
            <div className="space-y-2.5">
              {/* Dark mode */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={handleToggleRowKeyDown}
                onClick={() => {
                  setPref("dark_mode", !prefs.dark_mode);
                  announce(prefs.dark_mode ? "Light mode enabled" : "Dark mode enabled");
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-colors",
                  prefs.dark_mode
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <div className="flex items-center gap-3">
                  {prefs.dark_mode ? (
                    <Moon className="h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="font-semibold">{t("a11y.theme")}</p>
                    <p className="text-xs text-muted-foreground">Dark background with soft text</p>
                  </div>
                </div>
                <Switch checked={prefs.dark_mode} tabIndex={-1} className="pointer-events-none" />
              </div>

              {/* Large Buttons */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={handleToggleRowKeyDown}
                onClick={() => {
                  setPref("large_buttons", !prefs.large_buttons);
                  announce(
                    prefs.large_buttons ? "Standard buttons enabled" : "Large touch targets enabled",
                  );
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-colors",
                  prefs.large_buttons
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <div className="flex items-center gap-3">
                  <Hand className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{t("a11y.buttons")}</p>
                    <p className="text-xs text-muted-foreground">Enlarge touch targets for tremor relief</p>
                  </div>
                </div>
                <Switch checked={prefs.large_buttons} tabIndex={-1} className="pointer-events-none" />
              </div>

              {/* Voice Guidance */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={handleToggleRowKeyDown}
                onClick={() => {
                  const nextVal = !prefs.voice_guidance;
                  setPref("voice_guidance", nextVal);
                  if (!nextVal) {
                    stopSpeaking();
                  } else {
                    speak("Voice guidance enabled", locale, prefs.slow_mode, true);
                  }
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-colors",
                  prefs.voice_guidance
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <div className="flex items-center gap-3">
                  <Mic className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{t("a11y.voice")}</p>
                    <p className="text-xs text-muted-foreground">Spoken prompts and step instructions</p>
                  </div>
                </div>
                <Switch checked={prefs.voice_guidance} tabIndex={-1} className="pointer-events-none" />
              </div>

              {/* Reduce Motion */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={handleToggleRowKeyDown}
                onClick={() => {
                  setPref("reduce_motion", !prefs.reduce_motion);
                  announce(prefs.reduce_motion ? "Motion enabled" : "Motion reduced");
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-colors",
                  prefs.reduce_motion
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Reduce Motion</p>
                    <p className="text-xs text-muted-foreground">Minimize visual motion & animations</p>
                  </div>
                </div>
                <Switch checked={prefs.reduce_motion} tabIndex={-1} className="pointer-events-none" />
              </div>

              {/* Slow Pace Mode */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={handleToggleRowKeyDown}
                onClick={() => {
                  setPref("slow_mode", !prefs.slow_mode);
                  announce(prefs.slow_mode ? "Normal pace enabled" : "Slow pace enabled");
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-colors",
                  prefs.slow_mode
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <div className="flex items-center gap-3">
                  <Turtle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{t("a11y.slow")}</p>
                    <p className="text-xs text-muted-foreground">Generous timers and slow speech</p>
                  </div>
                </div>
                <Switch checked={prefs.slow_mode} tabIndex={-1} className="pointer-events-none" />
              </div>

              {/* Enhanced Focus Indicators */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={handleToggleRowKeyDown}
                onClick={() => {
                  setPref("enhanced_focus", !prefs.enhanced_focus);
                  announce(
                    prefs.enhanced_focus
                      ? "Standard focus indicators"
                      : "Enhanced focus rings enabled",
                  );
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-colors",
                  prefs.enhanced_focus
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Enhanced Focus Rings</p>
                    <p className="text-xs text-muted-foreground">High visibility outlines for keyboard/switch nav</p>
                  </div>
                </div>
                <Switch checked={prefs.enhanced_focus} tabIndex={-1} className="pointer-events-none" />
              </div>

              {/* Sound Effects */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={handleToggleRowKeyDown}
                onClick={() => {
                  const nextVal = !prefs.reduce_sounds;
                  setPref("reduce_sounds", nextVal);
                  soundEffects.setMuted(nextVal);
                  announce(nextVal ? "Sounds muted" : "Sound effects enabled");
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-colors",
                  prefs.reduce_sounds
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <div className="flex items-center gap-3">
                  {prefs.reduce_sounds ? (
                    <VolumeX className="h-5 w-5 text-primary" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="font-semibold">{t("a11y.sounds")}</p>
                    <p className="text-xs text-muted-foreground">Mute background chimes and tone feedback</p>
                  </div>
                </div>
                <Switch checked={prefs.reduce_sounds} tabIndex={-1} className="pointer-events-none" />
              </div>

              {/* Simplified UI */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={handleToggleRowKeyDown}
                onClick={() => {
                  setPref("simplify", !prefs.simplify);
                  announce(prefs.simplify ? "Standard layout enabled" : "Simplified layout enabled");
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-colors",
                  prefs.simplify
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{t("a11y.simplify")}</p>
                    <p className="text-xs text-muted-foreground">Hides secondary cards and reduces clutter</p>
                  </div>
                </div>
                <Switch checked={prefs.simplify} tabIndex={-1} className="pointer-events-none" />
              </div>
            </div>

            {/* Reset Defaults */}
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 rounded-xl text-muted-foreground hover:text-foreground"
                onClick={() => {
                  resetPrefs();
                  announce("Accessibility settings reset to default");
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset all to default
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
