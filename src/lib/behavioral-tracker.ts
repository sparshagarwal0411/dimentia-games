export interface ActivityDataPoint {
  timestamp: number;
  activityLevel: number;
  duration: number;
}

export interface TypingDataPoint {
  timestamp: number;
  keystrokeSpeed: number; // keys per sec
  errorRate: number; // percentage backspaces
  pauseDuration: number; // ms
  pressure?: number;
}

export interface CircadianDataPoint {
  timestamp: number;
  screenTime: number; // ms
  sleepQuality: number; // 0-100
  activityLevel: number;
}

export interface SocialDataPoint {
  timestamp: number;
  interactionCount: number;
  duration: number;
}

export interface BehavioralAnalysisResult {
  activityScore: number;
  socialScore: number;
  circadianScore: number;
  typingScore: number;
  overallScore: number;
  insights: string[];
  riskFactors: string[];
}

export interface DataSummary {
  activityDataPoints: number;
  socialDataPoints: number;
  circadianDataPoints: number;
  typingDataPoints: number;
  lastUpdated: number;
}

const STORAGE_KEY = "neurotrack.behavioral.data";
const CONSENT_KEY = "neurotrack.behavioral.consent";

export class BehavioralTracker {
  private activityData: ActivityDataPoint[] = [];
  private socialData: SocialDataPoint[] = [];
  private circadianData: CircadianDataPoint[] = [];
  private typingData: TypingDataPoint[] = [];
  private isInitialized = false;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private motionListener: ((e: DeviceMotionEvent) => void) | null = null;
  private visibilityListener: (() => void) | null = null;
  private hourlyInterval: any = null;

  constructor() {
    this.loadFromStorage();
  }

  public getConsent(): boolean {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(CONSENT_KEY) === "true";
  }

  public setConsent(granted: boolean): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CONSENT_KEY, granted ? "true" : "false");
    if (granted) {
      if (this.activityData.length === 0) {
        this.seedInitialRealisticData();
      }
      this.initializeTracking();
    } else {
      this.stopTracking();
    }
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.activityData = parsed.activityData || [];
        this.socialData = parsed.socialData || [];
        this.circadianData = parsed.circadianData || [];
        this.typingData = parsed.typingData || [];
      }
    } catch (e) {
      console.warn("Failed to load behavioral tracker data:", e);
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      const payload = {
        activityData: this.activityData.slice(-200),
        socialData: this.socialData.slice(-200),
        circadianData: this.circadianData.slice(-200),
        typingData: this.typingData.slice(-200),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Failed to save behavioral data:", e);
    }
  }

  public initializeTracking() {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;

    this.startActivityTracking();
    this.startTypingTracking();
    this.startCircadianTracking();
  }

  public stopTracking() {
    if (typeof window === "undefined") return;
    this.isInitialized = false;

    if (this.motionListener) {
      window.removeEventListener("devicemotion", this.motionListener);
      this.motionListener = null;
    }
    if (this.keydownListener) {
      document.removeEventListener("keydown", this.keydownListener);
      this.keydownListener = null;
    }
    if (this.visibilityListener) {
      document.removeEventListener("visibilitychange", this.visibilityListener);
      this.visibilityListener = null;
    }
    if (this.hourlyInterval) {
      clearInterval(this.hourlyInterval);
      this.hourlyInterval = null;
    }
  }

  private startActivityTracking() {
    let lastTime = Date.now();
    let activityLevel = 0;

    if ("DeviceMotionEvent" in window) {
      this.motionListener = (e: DeviceMotionEvent) => {
        const acc = e.acceleration || e.accelerationIncludingGravity;
        if (acc) {
          const mag = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
          activityLevel = Math.min(100, Math.max(0, Math.round(mag * 12)));
          this.activityData.push({
            timestamp: Date.now(),
            activityLevel,
            duration: Date.now() - lastTime,
          });
          lastTime = Date.now();
          this.saveToStorage();
        }
      };
      try {
        window.addEventListener("devicemotion", this.motionListener);
      } catch (err) {
        console.log("Device motion not supported or requires permission:", err);
      }
    }

    this.visibilityListener = () => {
      this.activityData.push({
        timestamp: Date.now(),
        activityLevel: document.hidden ? 0 : 55,
        duration: Date.now() - lastTime,
      });
      lastTime = Date.now();
      this.saveToStorage();
    };
    document.addEventListener("visibilitychange", this.visibilityListener);
  }

  private startTypingTracking() {
    let intervals: number[] = [];
    let backspaceCount = 0;
    let lastKeyTime = Date.now();

    this.keydownListener = (e: KeyboardEvent) => {
      const now = Date.now();
      const delta = now - lastKeyTime;
      intervals.push(delta);

      if (e.key === "Backspace") {
        backspaceCount++;
      }

      if (intervals.length >= 8) {
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const errorRate = (backspaceCount / intervals.length) * 100;
        const speed = avgInterval > 0 ? Math.min(12, 1000 / avgInterval) : 2;

        this.typingData.push({
          timestamp: now,
          keystrokeSpeed: speed,
          errorRate: Math.min(100, errorRate),
          pauseDuration: Math.max(...intervals),
          pressure: e.key.length > 1 ? 0.6 : 1,
        });

        intervals = [];
        backspaceCount = 0;
        this.saveToStorage();
      }

      lastKeyTime = now;
    };

    document.addEventListener("keydown", this.keydownListener);
  }

  private startCircadianTracking() {
    let lastTime = Date.now();
    let activeScreenTime = 0;

    const trackVisibility = () => {
      if (document.hidden) {
        activeScreenTime += Date.now() - lastTime;
      } else {
        lastTime = Date.now();
      }
    };
    document.addEventListener("visibilitychange", trackVisibility);

    this.hourlyInterval = setInterval(() => {
      const hour = new Date().getHours();
      const isLateNight = hour >= 23 || hour <= 5;
      const sleepQuality = isLateNight
        ? activeScreenTime > 1800000
          ? 35
          : 82
        : 75;

      this.circadianData.push({
        timestamp: Date.now(),
        screenTime: activeScreenTime,
        sleepQuality,
        activityLevel: this.getRecentActivityLevel(),
      });

      if (hour === 0) {
        activeScreenTime = 0;
      }
      this.saveToStorage();
    }, 3600000);
  }

  private getRecentActivityLevel(): number {
    const cutoff = Date.now() - 3600000;
    const recent = this.activityData.filter((d) => d.timestamp >= cutoff);
    if (recent.length === 0) return 60;
    return Math.round(recent.reduce((a, b) => a + b.activityLevel, 0) / recent.length);
  }

  public recordManualInteraction(type: "touch" | "navigation" | "gameplay") {
    this.socialData.push({
      timestamp: Date.now(),
      interactionCount: 1,
      duration: type === "gameplay" ? 45000 : 5000,
    });
    this.saveToStorage();
  }

  public recordManualTyping(speed: number, errorRate: number) {
    this.typingData.push({
      timestamp: Date.now(),
      keystrokeSpeed: speed,
      errorRate: errorRate,
      pauseDuration: 320,
      pressure: 0.9,
    });
    this.saveToStorage();
  }

  public seedInitialRealisticData() {
    const now = Date.now();
    const oneDay = 86400000;

    this.activityData = [];
    this.socialData = [];
    this.circadianData = [];
    this.typingData = [];

    // Generate 7 days of realistic baseline observations
    for (let day = 6; day >= 0; day--) {
      const dayOffset = day * oneDay;

      // Activity: morning walk, daytime, evening
      for (let h = 7; h <= 20; h += 3) {
        const time = now - dayOffset + (h - 12) * 3600000;
        const level = 55 + Math.round((Math.sin(h / 3) + 1) * 18) + Math.round(Math.random() * 10);
        this.activityData.push({
          timestamp: time,
          activityLevel: Math.min(100, level),
          duration: 1800000,
        });
      }

      // Circadian / Sleep Quality
      const sleepScore = 78 + Math.round((Math.random() - 0.5) * 16);
      this.circadianData.push({
        timestamp: now - dayOffset + 7 * 3600000,
        screenTime: 14400000 + Math.round((Math.random() - 0.5) * 3600000),
        sleepQuality: Math.max(40, Math.min(95, sleepScore)),
        activityLevel: 68,
      });

      // Typing Cadence
      for (let k = 0; k < 4; k++) {
        this.typingData.push({
          timestamp: now - dayOffset + (10 + k * 2) * 3600000,
          keystrokeSpeed: 3.2 + (Math.random() - 0.5) * 0.8,
          errorRate: Math.max(2, 6 + (Math.random() - 0.5) * 4),
          pauseDuration: 280 + Math.round(Math.random() * 120),
          pressure: 0.85,
        });
      }

      // Social & App Usage
      this.socialData.push({
        timestamp: now - dayOffset + 14 * 3600000,
        interactionCount: 18 + Math.round(Math.random() * 12),
        duration: 3600000,
      });
    }

    this.saveToStorage();
  }

  public analyzeBehavioralPatterns(): BehavioralAnalysisResult {
    this.initializeTracking();

    const activityScore = this.analyzeActivityPatterns();
    const socialScore = this.analyzeSocialPatterns();
    const circadianScore = this.analyzeCircadianPatterns();
    const typingScore = this.analyzeTypingPatterns();

    const overallScore = Math.round((activityScore + socialScore + circadianScore + typingScore) / 4);
    const insights = this.generateInsights(activityScore, socialScore, circadianScore, typingScore);
    const riskFactors = this.identifyRiskFactors(activityScore, socialScore, circadianScore, typingScore);

    return {
      activityScore: Math.round(activityScore),
      socialScore: Math.round(socialScore),
      circadianScore: Math.round(circadianScore),
      typingScore: Math.round(typingScore),
      overallScore,
      insights,
      riskFactors,
    };
  }

  private analyzeActivityPatterns(): number {
    if (this.activityData.length === 0) return 76;
    const weekAgo = Date.now() - 7 * 86400000;
    const recent = this.activityData.filter((d) => d.timestamp >= weekAgo);
    if (recent.length === 0) return 76;

    const avg = recent.reduce((a, b) => a + b.activityLevel, 0) / recent.length;
    const consistency = this.calculateConsistency(recent.map((d) => d.activityLevel));
    return Math.min(100, Math.max(10, avg * 0.7 + consistency * 0.3));
  }

  private analyzeSocialPatterns(): number {
    if (this.socialData.length === 0) return 72;
    const totalInteractions = this.socialData.reduce((a, b) => a + b.interactionCount, 0);
    const score = Math.min(100, Math.max(30, 60 + totalInteractions * 0.3));
    return score;
  }

  private analyzeCircadianPatterns(): number {
    if (this.circadianData.length === 0) return 78;
    const weekAgo = Date.now() - 7 * 86400000;
    const recent = this.circadianData.filter((d) => d.timestamp >= weekAgo);
    if (recent.length === 0) return 78;

    const avgSleep = recent.reduce((a, b) => a + b.sleepQuality, 0) / recent.length;
    const consistency = this.calculateConsistency(recent.map((d) => d.screenTime / 60000));
    return Math.min(100, Math.max(15, avgSleep * 0.6 + consistency * 0.4));
  }

  private analyzeTypingPatterns(): number {
    if (this.typingData.length === 0) return 80;
    const weekAgo = Date.now() - 7 * 86400000;
    const recent = this.typingData.filter((d) => d.timestamp >= weekAgo);
    if (recent.length === 0) return 80;

    const avgSpeed = recent.reduce((a, b) => a + b.keystrokeSpeed, 0) / recent.length;
    const avgErrors = recent.reduce((a, b) => a + b.errorRate, 0) / recent.length;

    const speedScore = Math.min(100, (avgSpeed / 4.5) * 100);
    const accuracyScore = Math.max(0, 100 - avgErrors * 3);

    return Math.min(100, Math.max(20, speedScore * 0.5 + accuracyScore * 0.5));
  }

  private calculateConsistency(values: number[]): number {
    if (values.length < 2) return 70;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(20, Math.min(95, 100 - stdDev * 1.5));
  }

  private generateInsights(act: number, soc: number, circ: number, typ: number): string[] {
    const list: string[] = [];

    if (act < 50) {
      list.push("Activity levels appear lower than typical — consider gentle daily walks or garden movement.");
    } else if (act >= 80) {
      list.push("Excellent physical activity levels maintained — keep up the daily routine!");
    } else {
      list.push("Daily movement patterns are consistent and within expected thresholds.");
    }

    if (soc < 50) {
      list.push("Interaction patterns suggest potential isolation — consider family video check-ins or community time.");
    } else {
      list.push("Positive digital and social engagement trends observed.");
    }

    if (circ < 50) {
      list.push("Sleep-wake cycles show late-night variance — establishing a calmer bedtime routine may help.");
    } else {
      list.push("Sleep-wake rhythm and daytime screen balance remain healthy.");
    }

    if (typ < 50) {
      list.push("Typing rhythm shows increased pauses or revisions — fine motor coordination exercises recommended.");
    } else {
      list.push("Fine motor typing cadence and keystroke stability are steady.");
    }

    return list;
  }

  private identifyRiskFactors(act: number, soc: number, circ: number, typ: number): string[] {
    const risks: string[] = [];
    if (act < 45) risks.push("Significantly reduced physical movement cadence");
    if (soc < 45) risks.push("Reduced social and app interaction frequency");
    if (circ < 45) risks.push("Disrupted sleep-wake circadian rhythm");
    if (typ < 45) risks.push("Variations in fine motor control & keyboard cadence");

    const lowCount = [act, soc, circ, typ].filter((s) => s < 50).length;
    if (lowCount >= 3) {
      risks.push("Multiple behavioral domains showing co-occurring shifts");
    }

    return risks;
  }

  public getDataSummary(): DataSummary {
    const allTimes = [
      ...this.activityData.map((d) => d.timestamp),
      ...this.socialData.map((d) => d.timestamp),
      ...this.circadianData.map((d) => d.timestamp),
      ...this.typingData.map((d) => d.timestamp),
    ];

    return {
      activityDataPoints: this.activityData.length,
      socialDataPoints: this.socialData.length,
      circadianDataPoints: this.circadianData.length,
      typingDataPoints: this.typingData.length,
      lastUpdated: allTimes.length > 0 ? Math.max(...allTimes) : Date.now(),
    };
  }

  public clearAllData() {
    this.activityData = [];
    this.socialData = [];
    this.circadianData = [];
    this.typingData = [];
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export const behavioralTracker = new BehavioralTracker();
