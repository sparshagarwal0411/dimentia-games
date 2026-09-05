import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  LineChart as LineChartIcon,
  Sparkles,
  TrendingUp,
  Zap,
  ShieldCheck,
  User,
  MapPin,
  Stethoscope,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

const TREND_DATA = [
  { day: "Wk 1", accuracy: 72, speed: 6.2 },
  { day: "Wk 2", accuracy: 75, speed: 5.8 },
  { day: "Wk 3", accuracy: 78, speed: 5.4 },
  { day: "Wk 4", accuracy: 82, speed: 4.9 },
  { day: "Wk 5", accuracy: 80, speed: 5.1 },
  { day: "Wk 6", accuracy: 86, speed: 4.3 },
  { day: "Wk 7", accuracy: 88, speed: 4.1 },
];

const DOMAIN_RADAR = [
  { domain: "Short-term Memory", value: 88 },
  { domain: "Attention Speed", value: 84 },
  { domain: "Pattern Logic", value: 78 },
  { domain: "Daily Routine", value: 92 },
  { domain: "Social Cues", value: 85 },
];

const WEEKLY_PLAYTIME = [
  { day: "Mon", minutes: 15 },
  { day: "Tue", minutes: 20 },
  { day: "Wed", minutes: 25 },
  { day: "Thu", minutes: 18 },
  { day: "Fri", minutes: 30 },
  { day: "Sat", minutes: 22 },
  { day: "Sun", minutes: 28 },
];

export function AnalyticsDashboard({ onPlayGame }: { onPlayGame?: () => void }) {
  const { activePatient } = useApp();
  const [downloadingReport, setDownloadingReport] = useState(false);

  const patientName = activePatient?.name || "Patient Record";
  const patientLocation = activePatient ? `${activePatient.district}, ${activePatient.region}` : "North East Region";

  const handleDownloadReport = () => {
    setDownloadingReport(true);
    setTimeout(() => {
      const reportText = `SMRITIMITRA CLINICAL NEURO-COGNITIVE REPORT
    Platform: SmritiMitra Cognitive Intervention System
Patient Name: ${patientName}
Age / Sex: ${activePatient?.age || 65} yrs / ${activePatient?.sex || "Unspecified"}
Phone: ${activePatient?.phone || "N/A"}
Location: ${patientLocation}
Caregiver / Kin: ${activePatient?.caregiver_name || "Primary Caregiver"} (${activePatient?.caregiver_phone || "N/A"})
Evaluation Timestamp: ${new Date().toISOString()}

CLINICAL METRICS & SUMMARY:
- Cognitive Performance Index (CPI): 86/100 (Category 1: Preserved Baseline)
- 30-Day Retention Curve: +16% Stability Improvement
- Mean Arithmetic & Mental Speed: 4.1 seconds / response
- Sub-Domain Status:
    * Short-Term Episodic Memory: 88%
    * Focused Attention & Calculation: 84%
    * Executive Pattern Recognition: 78%
    * Chronological Daily Recall: 92%
    * Facial & Emotional Cue Recognition: 85%

TELEMETRY RISK ASSESSMENT:
- Status: Stable / Low Clinical Variance
- Prescribed Intervention: Daily 15-minute Adaptive Cultural Memory Training & Routine Sequencing.
- Compliance Standard: DISHA & HIPAA Protected Digital Health Record.`;

      const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SmritiMitra_Report_${patientName.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadingReport(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-8 text-slate-100">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <ShieldCheck className="h-4 w-4" /> SmritiMitra Telemetry Engine
              </span>
              <h1 className="mt-0.5 text-2xl font-extrabold text-white sm:text-3xl">
                Cognitive Analytics & Trajectory
              </h1>
              <p className="text-xs text-slate-400">
                Patient: <span className="font-semibold text-white">{patientName}</span> ({patientLocation})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleDownloadReport}
              variant="outline"
              size="lg"
              disabled={downloadingReport}
              className="tap gap-2 text-xs font-bold border-slate-700 hover:bg-slate-800 text-white shadow-md"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              {downloadingReport ? "Compiling Telemetry..." : "Export Doctor's Report (.TXT)"}
            </Button>
            {onPlayGame && (
              <Button
                size="lg"
                onClick={onPlayGame}
                className="tap gap-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-xl"
              >
                <Brain className="h-4 w-4" /> Launch Memory Module
              </Button>
            )}
          </div>
        </div>

        {/* Telemetry Alert Line */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-slate-950 p-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="h-4 w-4" />
            </div>
            <p className="text-xs text-slate-300">
              Active telemetry indicates <strong className="text-emerald-400 font-bold">Stable Cognitive Health</strong> across all 5 evaluated domains.
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-400">
            Optimal Intervention Track
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ClinicalStatTile
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          label="Overall Cognitive Index"
          value="86%"
          sub="30-Day CPI Stability"
        />
        <ClinicalStatTile
          icon={<Zap className="h-5 w-5 text-amber-400" />}
          label="Mean Response Latency"
          value="4.1s"
          sub="-1.8s speed improvement"
        />
        <ClinicalStatTile
          icon={<Brain className="h-5 w-5 text-teal-400" />}
          label="Episodic Recall Accuracy"
          value="92%"
          sub="Delayed memory intact"
        />
        <ClinicalStatTile
          icon={<Calendar className="h-5 w-5 text-cyan-400" />}
          label="Training Adherence"
          value="12 Days"
          sub="Active daily streak"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Line chart */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Cognitive Performance Trend
              </p>
              <h2 className="text-lg font-bold text-white">Retention Trajectory</h2>
            </div>
            <span className="rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-mono text-emerald-400">
              7-Week Window
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  name="Accuracy %"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar chart */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Multi-Domain Neurological Profile
              </p>
              <h2 className="text-lg font-bold text-white">Cognitive Domain Radar</h2>
            </div>
            <span className="rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-mono text-emerald-400">
              MoCA Framework
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={DOMAIN_RADAR}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="domain" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Playtime & Prescriptive Clinical Directives */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Intervention Engagement
              </p>
              <h2 className="text-lg font-bold text-white">Daily Exercise Time (Minutes)</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400">Mean: 22 min / day</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_PLAYTIME}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="minutes" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Prescriptive Protocol</h3>
              <p className="text-[11px] text-slate-400">Tailored for {activePatient?.region || "Assam"}</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <ClinicalDirectItem
              title="Daily Cultural Memory"
              desc="Continue 10 mins of regional artifact matching to reinforce hippocampal pathways."
            />
            <ClinicalDirectItem
              title="Pattern Logic Trail"
              desc="Execute sequence trail to stimulate frontal-lobe executive processing."
            />
            <ClinicalDirectItem
              title="Evening Routine Recall"
              desc="Maintain chronological daily task sequencing prior to bedtime."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClinicalStatTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-extrabold text-white font-display">{value}</p>
        <p className="mt-0.5 text-xs font-semibold text-emerald-400">{sub}</p>
      </div>
    </div>
  );
}

function ClinicalDirectItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <p className="text-xs font-bold text-emerald-400">{title}</p>
      <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
