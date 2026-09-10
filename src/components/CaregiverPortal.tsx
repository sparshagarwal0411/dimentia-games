import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Lock,
  PhoneCall,
  Plus,
  ShieldAlert,
  User,
  Users,
  MessageSquare,
  Sparkles,
  HeartPulse,
  MapPin,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { speak } from "@/lib/speech";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type AlertItem = {
  id: string;
  patientName: string;
  type: "high" | "medium" | "low";
  title: string;
  time: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  /** Short label for what action the caregiver is confirming */
  actionLabel: string;
  /** Auto-note inserted into the log when acknowledged */
  autoNote: string;
};

export function CaregiverPortal({ onOpenRegister }: { onOpenRegister?: () => void }) {
  const { patients, activePatient, setActivePatientId, prefs } = useApp();
  const { locale } = useI18n();

  const [pin, setPin] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [pinError, setPinError] = useState<string | null>(null);

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "a1",
      patientName: activePatient?.name || "Active Patient",
      type: "medium",
      title: "Daily Cognitive Baseline screening due for evaluation",
      time: "1 hour ago",
      acknowledged: false,
      actionLabel: "Schedule Review",
      autoNote: "Cognitive baseline review scheduled. Caregiver notified.",
    },
    {
      id: "a2",
      patientName: activePatient?.name || "Active Patient",
      type: "low",
      title: "Adaptive cultural memory training completed at 92% accuracy",
      time: "Today",
      acknowledged: true,
      acknowledgedAt: "Earlier today",
      actionLabel: "Mark Seen",
      autoNote: "Memory training result reviewed by caregiver.",
    },
  ]);

  const [noteText, setNoteText] = useState<string>("");
  const [notesList, setNotesList] = useState<Array<{ text: string; time: string }>>([
    { text: "Patient showed high engagement during cultural memory exercises. Sleep stability normal.", time: "Today" },
  ]);

  const [sosActive, setSosActive] = useState<boolean>(false);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234" || pin === "0000") {
      setIsUnlocked(true);
      setPinError(null);
    } else {
      setPinError("Invalid PIN. Enter 1234");
    }
  };

  const acknowledgeAlert = (id: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, acknowledged: true, acknowledgedAt: `Today at ${timeStr}` }
          : a,
      ),
    );
    // Auto-insert a note into the caregiver log
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      setNotesList((prev) => [
        { text: `[Auto] ${alert.autoNote}`, time: `Today at ${timeStr}` },
        ...prev,
      ]);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNotesList((prev) => [
      { text: noteText.trim(), time: "Just now" },
      ...prev,
    ]);
    setNoteText("");
  };

  const triggerEmergencySos = () => {
    setSosActive(true);
    const caregiverContact = activePatient?.caregiver_phone || "+91 94350 12345";
    if (prefs.voice_guidance) {
      speak(
        `Emergency telemetry alert dispatched to caregiver at ${caregiverContact} and local ASHA health worker.`,
        locale,
        prefs.slow_mode,
      );
    }
    setTimeout(() => {
      setSosActive(false);
    }, 4000);
  };

  if (!isUnlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-slate-100">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">Caregiver Security Portal</h2>
          <p className="mt-1 text-xs text-slate-400">
            Enter 4-digit clinical PIN to access patient monitoring and emergency alerts.
          </p>

          <form onSubmit={handleUnlockPin} className="mt-6 space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (Demo: 1234)"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-2xl tracking-[0.4em] font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {pinError && <p className="text-xs font-bold text-rose-500">{pinError}</p>}
            <Button type="submit" size="lg" className="tap w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold">
              Unlock Portal
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="family-portal mx-auto max-w-6xl px-4 py-6 space-y-8 text-foreground">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Caregiver & Clinical Supervision
              </span>
              <h1 className="mt-0.5 text-2xl font-extrabold text-white sm:text-3xl">
                Caregiver Monitoring & SOS
              </h1>
              <p className="text-xs text-slate-400">
                Monitoring: <span className="font-semibold text-white">{activePatient?.name || "Active Patient"}</span> · Emergency Contact: {activePatient?.caregiver_phone || "+91 94350 12345"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              size="lg"
              onClick={triggerEmergencySos}
              className="tap gap-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 shadow-xl"
            >
              <PhoneCall className="h-4 w-4" /> Trigger Emergency SOS
            </Button>
          </div>
        </div>

        {sosActive && (
          <div className="mt-4 rounded-xl bg-rose-500/20 border border-rose-500/40 p-4 text-rose-300 font-bold text-xs text-center animate-pulse">
            🚨 Emergency Alert Sent! SMS & automated voice notification dispatched to primary caregiver ({activePatient?.caregiver_name || "Caregiver"}) and nearest North East ASHA clinic.
          </div>
        )}
      </div>

      {/* Patient Caseload List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Registered Patient Caseload</h2>
          {onOpenRegister && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenRegister}
              className="tap gap-1 text-xs font-bold border-slate-700 text-emerald-400 hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" /> Add Patient Profile
            </Button>
          )}
        </div>

        {patients.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
            <User className="h-10 w-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-semibold">No patient registered under this caregiver node.</p>
            <p className="text-xs text-slate-500 mt-1">Register a patient to begin clinical tracking and telemetry monitoring.</p>
            {onOpenRegister && (
              <Button
                onClick={onOpenRegister}
                size="sm"
                className="mt-4 bg-emerald-500 text-slate-950 font-bold text-xs tap"
              >
                Register First Patient
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {patients.map((p) => {
              const isSelected = activePatient?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePatientId(p.id)}
                  className={cn(
                    "tap rounded-2xl border-2 p-5 text-left transition-all shadow-xl",
                    isSelected
                      ? "border-emerald-500 bg-slate-900 ring-2 ring-emerald-500/20"
                      : "border-slate-800 bg-slate-900/60 hover:bg-slate-800",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {p.patient_photo ? (
                        <img src={p.patient_photo} alt={p.name} className="h-10 w-10 rounded-xl object-cover ring-2 ring-emerald-500/40" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-bold">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                      {p.family_members && p.family_members.length > 0 && (
                        <div className="flex -space-x-2 overflow-hidden">
                          {p.family_members.slice(0, 3).map((fm, idx) => (
                            <img
                              key={fm.id || idx}
                              src={fm.photo}
                              alt={fm.name}
                              className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                              title={`${fm.name} (${fm.relation})`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      Active Telemetry
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400">
                    {p.age} yrs · {p.sex} · {p.district}, {p.region}
                  </p>
                  {p.family_members && p.family_members.length > 0 ? (
                    <p className="text-[11px] text-emerald-400 mt-1.5 font-medium">
                      👨‍👩‍👧‍👦 {p.family_members.length} Family Member{p.family_members.length > 1 ? "s" : ""} Linked
                    </p>
                  ) : p.caregiver_phone ? (
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      Kin: {p.caregiver_phone}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Patient Family Circle Showcase */}
      {activePatient && activePatient.family_members && activePatient.family_members.length > 0 && (
        <div className="rounded-3xl border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{activePatient.name}’s Family Circle</h2>
                <p className="text-xs text-slate-400">Linked family members for recognition exercises & emergency care</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
              {activePatient.family_members.length} Members
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activePatient.family_members.map((fm) => (
              <div key={fm.id} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-3.5 shadow-md hover:border-emerald-500/40 transition-colors">
                <img src={fm.photo} alt={fm.name} className="h-14 w-14 rounded-xl object-cover ring-2 ring-emerald-500/30 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">{fm.name}</p>
                  <span className="inline-block mt-0.5 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    {fm.relation}
                  </span>
                  {fm.phone && (
                    <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">{fm.phone}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts & Notes Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Alerts */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Bell className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Live Clinical Alerts</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              {alerts.filter((a) => !a.acknowledged).length} Pending Alerts
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all",
                  alert.type === "high"
                    ? "border-rose-500/30 bg-rose-500/10"
                    : alert.type === "medium"
                    ? "border-amber-500/30 bg-amber-500/10"
                    : "border-emerald-500/30 bg-emerald-500/10",
                )}
              >
                <div className="flex items-start gap-3">
                  {alert.type === "high" ? (
                    <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  ) : alert.type === "medium" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{alert.patientName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">• {alert.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-300">{alert.title}</p>
                  </div>
                </div>

                {!alert.acknowledged ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeAlert(alert.id)}
                    className={cn(
                      "tap shrink-0 text-xs font-bold",
                      alert.type === "high"
                        ? "border-rose-500/50 text-rose-400 hover:bg-rose-500/20"
                        : alert.type === "medium"
                        ? "border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
                        : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20",
                    )}
                  >
                    {alert.actionLabel}
                  </Button>
                ) : (
                  <span className="text-[11px] font-bold text-slate-400 shrink-0 flex flex-col items-end gap-0.5">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      {alert.actionLabel} · Done
                    </span>
                    {alert.acknowledgedAt && (
                      <span className="text-[10px] text-slate-500 font-mono">{alert.acknowledgedAt}</span>
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Caregiver Observation Log */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Caregiver Log</h2>
          </div>

          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Log daily observations, mood changes, or sleep quality..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <Button type="submit" size="sm" className="tap w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs">
              Save Clinical Note
            </Button>
          </form>

          <div className="space-y-2 pt-2">
            {notesList.map((note, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
                <p className="text-slate-300">{note.text}</p>
                <p className="mt-1 text-[10px] text-slate-500 font-mono">{note.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
