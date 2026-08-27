import { useState } from "react";
import {
  Accessibility,
  Contrast,
  Hand,
  Mic,
  Moon,
  Sparkles,
  Sun,
  Turtle,
  Type,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { readScreen, speak, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

type Row = {
  key: string;
  icon: typeof Type;
  label: string;
  active: boolean;
  onToggle: () => void;
};

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const { prefs, setPref, resetPrefs } = useApp();
  const { t, locale } = useI18n();

  const announce = (text: string) => {
    if (prefs.voice_guidance && !prefs.reduce_sounds) speak(text, locale, prefs.slow_mode);
  };

  const rows: Row[] = [
    {
      key: "contrast",
      icon: Contrast,
      label: t("a11y.contrast"),
      active: prefs.high_contrast,
      onToggle: () => setPref("high_contrast", !prefs.high_contrast),
    },
    {
      key: "buttons",
      icon: Hand,
      label: t("a11y.buttons"),
      active: prefs.large_buttons,
      onToggle: () => setPref("large_buttons", !prefs.large_buttons),
    },
    {
      key: "voice",
      icon: Mic,
      label: t("a11y.voice"),
      active: prefs.voice_guidance,
      onToggle: () => setPref("voice_guidance", !prefs.voice_guidance),
    },
    {
      key: "slow",
      icon: Turtle,
      label: t("a11y.slow"),
      active: prefs.slow_mode,
      onToggle: () => setPref("slow_mode", !prefs.slow_mode),
    },
    {
      key: "sounds",
      icon: prefs.reduce_sounds ? VolumeX : Volume2,
      label: t("a11y.sounds"),
      active: prefs.reduce_sounds,
      onToggle: () => setPref("reduce_sounds", !prefs.reduce_sounds),
    },
    {
      key: "theme",
      icon: prefs.dark_mode ? Moon : Sun,
      label: t("a11y.theme"),
      active: prefs.dark_mode,
      onToggle: () => setPref("dark_mode", !prefs.dark_mode),
    },
    {
      key: "simplify",
      icon: Sparkles,
      label: t("a11y.simplify"),
      active: prefs.simplify,
      onToggle: () => setPref("simplify", !prefs.simplify),
    },
  ];

  return (
    <>
      <button
        type="button"
        aria-label={t("a11y.title")}
        onClick={() => {
          setOpen(true);
          announce(t("a11y.title"));
        }}
        className="surface-calm fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full text-primary-foreground shadow-lift transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-ring"
      >
        <Accessibility className="h-8 w-8" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-3 text-3xl">
              <Accessibility className="h-8 w-8 text-primary" />
              {t("a11y.title")}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 px-4 pb-10">
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                readScreen(document.querySelector("main"), locale, prefs.slow_mode);
              }}
              className="surface-warm tap flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-xl font-semibold text-sun-foreground shadow-soft"
            >
              <Volume2 className="h-7 w-7 shrink-0" />
              {t("a11y.read")}
            </button>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-3 text-xl font-semibold">
                <Type className="h-6 w-6 text-primary" />
                {t("a11y.text")}
              </div>
              <div className="flex items-center gap-3">
                {[1, 1.15, 1.3, 1.5].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setPref("text_scale", scale)}
                    className={cn(
                      "tap flex-1 rounded-xl border-2 font-semibold transition-colors",
                      prefs.text_scale === scale
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted",
                    )}
                    style={{ fontSize: `${scale}rem` }}
                  >
                    A
                  </button>
                ))}
              </div>
            </div>

            {rows.map((row) => (
              <button
                key={row.key}
                type="button"
                onClick={() => {
                  row.onToggle();
                  announce(row.label);
                }}
                className={cn(
                  "tap flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left text-xl font-semibold transition-colors",
                  row.active
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <row.icon className="h-7 w-7 shrink-0 text-primary" />
                <span className="flex-1">{row.label}</span>
                <Switch checked={row.active} tabIndex={-1} className="pointer-events-none" />
              </button>
            ))}

            <Button variant="outline" className="tap w-full text-lg" onClick={resetPrefs}>
              Reset to default
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
