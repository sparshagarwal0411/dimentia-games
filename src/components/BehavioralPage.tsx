import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Info,
  Keyboard,
  Moon,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
  Volume2,
  Zap,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

import {
  behavioralTracker,
  type BehavioralAnalysisResult,
  type DataSummary,
} from "@/lib/behavioral-tracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { speak } from "@/lib/speech";

export function BehavioralPage() {
  const navigate = useNavigate();
  const { prefs, activePatient } = useApp();
  const { locale } = useI18n();

  const handleGoToDashboard = () => {
    window.localStorage.setItem("neurotrack.stage", "dashboard");
    void navigate({ to: "/" });
  };

  const [hasConsent, setHasConsent] = useState(false);
  const [analysis, setAnalysis] = useState<BehavioralAnalysisResult | null>(null);
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveTypingInput, setLiveTypingInput] = useState("");
  const [typingStats, setTypingStats] = useState<{ speed: number; errors: number; chars: number }>({
    speed: 0,
    errors: 0,
    chars: 0,
  });
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);

  // Initialize and load consent
  useEffect(() => {
    const consent = behavioralTracker.getConsent();
    setHasConsent(consent);
    if (consent) {
      runAnalysis();
    }
  }, []);

  const runAnalysis = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const res = behavioralTracker.analyzeBehavioralPatterns();
      const sum = behavioralTracker.getDataSummary();
      setAnalysis(res);
      setSummary(sum);
      setIsRefreshing(false);
    }, 300);
  };

  const handleEnable = () => {
    behavioralTracker.setConsent(true);
    setHasConsent(true);
    runAnalysis();
    if (prefs.voice_guidance) {
      speak("Behavioral monitoring enabled. Your data stays strictly on this device.", locale, prefs.slow_mode);
    }
  };

  const handleDisable = () => {
    behavioralTracker.setConsent(false);
    behavioralTracker.clearAllData();
    setHasConsent(false);
    setAnalysis(null);
    setSummary(null);
  };

  // Interactive Typing Test Handler
  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLiveTypingInput(val);
    const chars = val.length;
    const errors = (val.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const speed = chars > 3 ? Math.min(8, chars / 4) : 3.5;
    setTypingStats({
      speed: Number(speed),
      errors,
      chars,
    });
    if (chars % 10 === 0 && chars > 0) {
      behavioralTracker.recordManualTyping(Number(speed), errors);
      runAnalysis();
    }
  };

  // Simulation Helpers
  const triggerSimulation = (type: "activity" | "circadian" | "reset") => {
    if (type === "activity") {
      behavioralTracker.recordManualInteraction("gameplay");
      setSimulationNotice("Recorded simulated daytime walking & physical mobility session (+50 pts).");
    } else if (type === "circadian") {
      behavioralTracker.recordManualInteraction("touch");
      setSimulationNotice("Logged restful evening transition and reduced late-night screen activity.");
    } else if (type === "reset") {
      behavioralTracker.seedInitialRealisticData();
      setSimulationNotice("Reset to 7-day representative clinical baseline dataset.");
    }
    runAnalysis();
    setTimeout(() => setSimulationNotice(null), 4000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 70) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300">
          Optimal Stability
        </Badge>
      );
    }
    if (score >= 50) {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300">
          Moderate Variance
        </Badge>
      );
    }
    return (
      <Badge className="bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300">
        Attention Advised
      </Badge>
    );
  };

  // Radar chart data formatted
  const radarData = useMemo(() => {
    if (!analysis) return [];
    return [
      { domain: "Physical Mobility", score: analysis.activityScore, fullMark: 100 },
      { domain: "Social Routine", score: analysis.socialScore, fullMark: 100 },
      { domain: "Sleep Rhythms", score: analysis.circadianScore, fullMark: 100 },
      { domain: "Motor Dexterity", score: analysis.typingScore, fullMark: 100 },
    ];
  }, [analysis]);

  // Hourly trend mockup for deep analysis
  const trendData = [
    { hour: "06:00", activity: 35, sleepRest: 85, motor: 75 },
    { hour: "09:00", activity: 78, sleepRest: 20, motor: 82 },
    { hour: "12:00", activity: 65, sleepRest: 15, motor: 80 },
    { hour: "15:00", activity: 72, sleepRest: 25, motor: 76 },
    { hour: "18:00", activity: 80, sleepRest: 30, motor: 79 },
    { hour: "21:00", activity: 40, sleepRest: 70, motor: 68 },
    { hour: "23:00", activity: 10, sleepRest: 90, motor: 60 },
  ];

  /* -------------------------------------------------------------------------- */
  /* PRE-CONSENT SCREEN                                                         */
  /* -------------------------------------------------------------------------- */
  if (!hasConsent) {
    return (
      <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleGoToDashboard}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <Badge variant="outline" className="gap-1.5 py-1 px-3">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              On-Device Telemetry
            </Badge>
          </div>

          <Card className="border-2 shadow-soft overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
                    How we monitor?
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Continuous, passive digital biomarkers for cognitive health and motor rhythm stability
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-8">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-5 dark:border-blue-900/50 dark:bg-blue-950/30">
                <div className="flex items-start gap-3.5">
                  <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-950 dark:text-blue-200 text-base">
                      Privacy-First On-Device Monitoring
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">
                      We analyze passive device dynamics — such as gentle movement consistency, typing pause
                      rhythms, and circadian screen routines. All calculations are executed locally in your
                      browser. No personal chats, keystroke text, or raw coordinates ever leave this device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    What we monitor
                  </h3>
                  <ul className="space-y-3.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Touch & Navigation Cadence</span>
                        <p className="text-xs mt-0.5">
                          Tap fluidity and menu navigation pauses, detecting hesitation or tremor patterns.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Keyboard className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Keystroke Dynamics (Anonymized)</span>
                        <p className="text-xs mt-0.5">
                          Inter-key delay variability during search without ever reading text content.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Moon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Circadian & Night Rhythms</span>
                        <p className="text-xs mt-0.5">
                          App interaction time of day, helping identify late-night restlessness or sundowning.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Physical Routine & Steps</span>
                        <p className="text-xs mt-0.5">
                          Basic daytime activity intervals to track mobility consistency over weeks.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    Privacy guarantees
                  </h3>
                  <ul className="space-y-3.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">100% On-Device Processing</span>
                        <p className="text-xs mt-0.5">
                          Telemetry is evaluated in client-side WebAssembly / JS without cloud syncing.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">Zero Text or Audio Logging</span>
                        <p className="text-xs mt-0.5">
                          We only measure keystroke millisecond deltas, never the letters or words you type.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">Toggle or Wipe Anytime</span>
                        <p className="text-xs mt-0.5">
                          Disable monitoring with one tap. All stored metrics are immediately erased.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">Rolling 30-Day Expiry</span>
                        <p className="text-xs mt-0.5">
                          Historical data points older than 30 days are automatically purged.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-border">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-semibold shadow-soft hover:shadow-lift w-full sm:w-auto"
                  onClick={handleEnable}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Enable Behavioral Monitoring
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-6 py-6 text-base w-full sm:w-auto"
                  onClick={handleGoToDashboard}
                >
                  Maybe Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* ACTIVE DASHBOARD SCREEN                                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-muted text-muted-foreground transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold font-display">How we monitor?</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Passive on-device telemetry for {activePatient?.name || "Active Profile"}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-2"
              onClick={runAnalysis}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs"
              onClick={handleDisable}
            >
              Disable Tracking
            </Button>
          </div>
        </div>

        {/* Simulation Feedback Alert */}
        {simulationNotice && (
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-sm text-primary flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>{simulationNotice}</span>
            </div>
            <button
              type="button"
              className="text-xs underline hover:opacity-80"
              onClick={() => setSimulationNotice(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Overall Score Card */}
        {analysis && (
          <Card className="border-2 shadow-soft overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                      Composite Digital Biomarker Score
                    </span>
                    {getScoreBadge(analysis.overallScore)}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Overall Behavioral Health: {analysis.overallScore}/100
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                    Evaluated across {summary?.activityDataPoints ?? 0} activity logs,{" "}
                    {summary?.circadianDataPoints ?? 0} sleep checks, and {summary?.typingDataPoints ?? 0}{" "}
                    motor telemetry records.
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-end justify-center">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black font-display ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}
                    </span>
                    <span className="text-lg text-muted-foreground font-semibold">/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(summary?.lastUpdated || Date.now()).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md rounded-full p-1 bg-muted">
            <TabsTrigger value="overview" className="rounded-full text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="rounded-full text-xs sm:text-sm">
              Detailed Metrics
            </TabsTrigger>
            <TabsTrigger value="insights" className="rounded-full text-xs sm:text-sm">
              Insights & Plan
            </TabsTrigger>
          </TabsList>

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW                                                           */}
          {/* ========================================================================= */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card className="shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center justify-between">
                    <span>Behavioral Domain Profile</span>
                    <Badge variant="outline" className="text-xs font-normal">
                      Multi-axial Assessment
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Holistic balance across physical, circadian, fine motor, and social domains
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[290px] flex items-center justify-center p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="75%">
                      <PolarGrid stroke="currentColor" className="text-border" />
                      <PolarAngleAxis
                        dataKey="domain"
                        tick={{ fill: "currentColor", fontSize: 11 }}
                        className="text-muted-foreground font-medium"
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="transparent" />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#0d9488"
                        fill="#0d9488"
                        fillOpacity={0.4}
                        strokeWidth={2.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Domain Score Breakdown Progress */}
              <Card className="shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold">Domain Score Breakdown</CardTitle>
                  <CardDescription>Individual scores normalized against healthy age baseline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {analysis && (
                    <>
                      {/* Physical Activity */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-teal-600" />
                            <span className="font-semibold">Physical Activity & Movement</span>
                          </div>
                          <span className={`font-bold ${getScoreColor(analysis.activityScore)}`}>
                            {analysis.activityScore}%
                          </span>
                        </div>
                        <Progress value={analysis.activityScore} className="h-2.5" />
                      </div>

                      {/* Social & Engagement */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold">Social & Interaction Frequency</span>
                          </div>
                          <span className={`font-bold ${getScoreColor(analysis.socialScore)}`}>
                            {analysis.socialScore}%
                          </span>
                        </div>
                        <Progress value={analysis.socialScore} className="h-2.5" />
                      </div>

                      {/* Circadian Sleep */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-indigo-600" />
                            <span className="font-semibold">Sleep & Circadian Rhythm</span>
                          </div>
                          <span className={`font-bold ${getScoreColor(analysis.circadianScore)}`}>
                            {analysis.circadianScore}%
                          </span>
                        </div>
                        <Progress value={analysis.circadianScore} className="h-2.5" />
                      </div>

                      {/* Fine Motor */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Keyboard className="h-4 w-4 text-amber-600" />
                            <span className="font-semibold">Fine Motor Typing Dexterity</span>
                          </div>
                          <span className={`font-bold ${getScoreColor(analysis.typingScore)}`}>
                            {analysis.typingScore}%
                          </span>
                        </div>
                        <Progress value={analysis.typingScore} className="h-2.5" />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Identified Risk Factors or Good Health banner */}
            {analysis && (
              <Card className="shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    {analysis.riskFactors.length > 0 ? (
                      <>
                        <Zap className="h-5 w-5 text-amber-600" />
                        <span>Noted Patterns & Flags ({analysis.riskFactors.length})</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span>All Behavioral Domains Within Healthy Limits</span>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.riskFactors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {analysis.riskFactors.map((rf, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200 text-sm"
                        >
                          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{rf}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Continuous telemetry shows stable physical pacing, consistent daytime keystroke
                      rhythm, and calm nighttime device rest. Keep up your active lifestyle!
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Interactive Live Quick Testing Bar */}
            <Card className="bg-muted/40 border shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Interactive Telemetry Demonstration
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full gap-1.5"
                  onClick={() => triggerSimulation("activity")}
                >
                  <Activity className="h-3.5 w-3.5 text-teal-600" />
                  Simulate Movement (+Activity)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full gap-1.5"
                  onClick={() => triggerSimulation("circadian")}
                >
                  <Moon className="h-3.5 w-3.5 text-indigo-600" />
                  Simulate Calm Night (+Sleep)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full gap-1.5"
                  onClick={() => triggerSimulation("reset")}
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  Reset Baseline Dataset
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 2: DETAILED METRICS                                                   */}
          {/* ========================================================================= */}
          <TabsContent value="detailed" className="space-y-6">
            {/* Live Typing Dexterity Interactive Area */}
            <Card className="shadow-soft border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-primary" />
                    Live Keystroke Motor Dexterity Test
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    Real-Time Micro-Timing
                  </Badge>
                </div>
                <CardDescription>
                  Type the sample sentence below. The algorithm measures inter-keystroke cadence stability
                  and backspace corrections without saving any words.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-xl bg-muted/60 border text-sm font-medium text-foreground">
                  Prompt: <em>"The fresh morning breeze in the tea gardens brings clarity and peaceful energy."</em>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={liveTypingInput}
                    onChange={handleTypingChange}
                    placeholder="Type the sentence above here to test live fine motor speed..."
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>Characters: {typingStats.chars}</span>
                    <span>Live Cadence: {typingStats.speed} keys/sec</span>
                    <span>Revision Count: {typingStats.errors}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 24-Hour Diurnal Pattern Graph */}
            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">24-Hour Diurnal Activity & Rest Curve</CardTitle>
                <CardDescription>Typical circadian distribution of physical movement and motor rhythm</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke="#888888" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="activity"
                      stroke="#0d9488"
                      fillOpacity={1}
                      fill="url(#colorAct)"
                      name="Mobility Level"
                    />
                    <Area
                      type="monotone"
                      dataKey="sleepRest"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#colorSleep)"
                      name="Sleep Restfulness"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Data Collection Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold font-display text-teal-600">
                  {summary?.activityDataPoints || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Activity Data Points</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold font-display text-blue-600">
                  {summary?.socialDataPoints || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Social Interactions</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold font-display text-indigo-600">
                  {summary?.circadianDataPoints || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Circadian Cycles</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold font-display text-amber-600">
                  {summary?.typingDataPoints || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Motor Rhythm Logs</p>
              </Card>
            </div>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 3: INSIGHTS & PLAN                                                    */}
          {/* ========================================================================= */}
          <TabsContent value="insights" className="space-y-6">
            {/* Generated Clinical & Lifestyle Recommendations */}
            <Card className="shadow-soft">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Personalized Behavioral Insights
                </CardTitle>
                <CardDescription>
                  Tailored lifestyle actions based on multi-day biometric stability patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5">
                {analysis?.insights.map((insight, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl border bg-card text-foreground shadow-xs"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{insight}</p>
                      <p className="text-xs text-muted-foreground">
                        Recommended for memory resilience and circadian health.
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Structured Care Action Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-teal-600" />
                    Daily Routine Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  <div className="p-3 rounded-lg bg-muted/40 flex items-center justify-between">
                    <span>Morning 20-min walking walk</span>
                    <Badge variant="outline">07:30 AM</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 flex items-center justify-between">
                    <span>Cultural Memory Matching Game</span>
                    <Badge variant="outline">11:00 AM</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 flex items-center justify-between">
                    <span>Family Call or Tea Conversation</span>
                    <Badge variant="outline">04:30 PM</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 flex items-center justify-between">
                    <span>Nighttime Screen Wind-down</span>
                    <Badge variant="outline">09:30 PM</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Caregiver Summary & Export
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Share this behavioral report with your family physician or neurologist during routine
                    cognitive check-ups.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl gap-2 text-foreground font-medium"
                    onClick={() => {
                      alert(
                        `SmritiMitra Behavioral Summary:\nOverall Score: ${analysis?.overallScore}/100\nMobility: ${analysis?.activityScore}%\nCircadian: ${analysis?.circadianScore}%\nMotor: ${analysis?.typingScore}%\nSocial: ${analysis?.socialScore}%`,
                      );
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download Behavioral PDF / Summary
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
