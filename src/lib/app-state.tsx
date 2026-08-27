import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { cacheGet, cacheSet, hydrateSimulatedOffline, startSyncWatcher } from "@/lib/offline";

export type Patient = {
  id: string;
  caregiver_id: string;
  name: string;
  age: number;
  language: string;
  region: string;
  elder_mode: boolean;
  base_difficulty: number;
  avatar_emoji: string;
  created_at: string;
};

export type A11yPrefs = {
  text_scale: number;
  high_contrast: boolean;
  large_buttons: boolean;
  voice_guidance: boolean;
  slow_mode: boolean;
  reduce_sounds: boolean;
  dark_mode: boolean;
  simplify: boolean;
};

export const DEFAULT_PREFS: A11yPrefs = {
  text_scale: 1,
  high_contrast: false,
  large_buttons: true,
  voice_guidance: true,
  slow_mode: false,
  reduce_sounds: false,
  dark_mode: false,
  simplify: false,
};

const ACTIVE_KEY = "cc.activePatient";
const PREFS_KEY = "cc.prefs";

type AppValue = {
  session: Session | null;
  authLoading: boolean;
  patients: Patient[];
  patientsLoading: boolean;
  activePatient: Patient | null;
  setActivePatientId: (id: string) => void;
  refreshPatients: () => Promise<void>;
  prefs: A11yPrefs;
  setPref: <K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => void;
  resetPrefs: () => void;
};

const AppContext = createContext<AppValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULT_PREFS);

  /* ------------------------------- auth ------------------------------- */
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  /* ------------------------------ offline ----------------------------- */
  useEffect(() => {
    hydrateSimulatedOffline();
    return startSyncWatcher();
  }, []);

  /* ------------------------------ patients ---------------------------- */
  const refreshPatients = useCallback(async () => {
    const cached = await cacheGet<Patient[]>("patients");
    if (cached && cached.length > 0) {
      setPatients(cached);
      setPatientsLoading(false);
    }
    const { data } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) {
      setPatients(data as Patient[]);
      void cacheSet("patients", data);
    }
    setPatientsLoading(false);
  }, []);

  useEffect(() => {
    if (!session) {
      setPatients([]);
      setPatientsLoading(false);
      return;
    }
    setPatientsLoading(true);
    void refreshPatients();
  }, [session, refreshPatients]);

  useEffect(() => {
    const stored = window.localStorage.getItem(ACTIVE_KEY);
    if (stored) setActiveId(stored);
  }, []);

  const setActivePatientId = useCallback((id: string) => {
    setActiveId(id);
    window.localStorage.setItem(ACTIVE_KEY, id);
  }, []);

  const activePatient = useMemo(() => {
    if (patients.length === 0) return null;
    return patients.find((p) => p.id === activeId) ?? patients[0] ?? null;
  }, [patients, activeId]);

  /* --------------------------- accessibility -------------------------- */
  const prefsKey = activePatient ? `${PREFS_KEY}.${activePatient.id}` : PREFS_KEY;

  useEffect(() => {
    const raw = window.localStorage.getItem(prefsKey);
    if (raw) {
      try {
        setPrefs({ ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<A11yPrefs>) });
        return;
      } catch {
        /* fall through */
      }
    }
    setPrefs(DEFAULT_PREFS);
  }, [prefsKey]);

  // Remote preferences for the active patient (kept in sync both ways).
  useEffect(() => {
    if (!activePatient || !session) return;
    let cancelled = false;
    void supabase
      .from("accessibility_preferences")
      .select("*")
      .eq("patient_id", activePatient.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const remote: A11yPrefs = {
          text_scale: Number(data.text_scale),
          high_contrast: data.high_contrast,
          large_buttons: data.large_buttons,
          voice_guidance: data.voice_guidance,
          slow_mode: data.slow_mode,
          reduce_sounds: data.reduce_sounds,
          dark_mode: data.dark_mode,
          simplify: data.simplify,
        };
        setPrefs(remote);
        window.localStorage.setItem(prefsKey, JSON.stringify(remote));
      });
    return () => {
      cancelled = true;
    };
  }, [activePatient, session, prefsKey]);

  const persistPrefs = useCallback(
    (next: A11yPrefs) => {
      window.localStorage.setItem(prefsKey, JSON.stringify(next));
      if (activePatient && session) {
        void supabase
          .from("accessibility_preferences")
          .upsert({ patient_id: activePatient.id, ...next, updated_at: new Date().toISOString() });
      }
    },
    [activePatient, session, prefsKey],
  );

  const setPref = useCallback(
    <K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => {
      setPrefs((current) => {
        const next = { ...current, [key]: value };
        persistPrefs(next);
        return next;
      });
    },
    [persistPrefs],
  );

  const resetPrefs = useCallback(() => {
    setPrefs(DEFAULT_PREFS);
    persistPrefs(DEFAULT_PREFS);
  }, [persistPrefs]);

  /* Apply preferences to the document. */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--text-scale", String(prefs.text_scale));
    root.classList.toggle("high-contrast", prefs.high_contrast);
    root.classList.toggle("large-buttons", prefs.large_buttons);
    root.classList.toggle("slow-mode", prefs.slow_mode);
    root.classList.toggle("simplified", prefs.simplify);
    root.classList.toggle("dark", prefs.dark_mode);
  }, [prefs]);

  const value = useMemo(
    () => ({
      session,
      authLoading,
      patients,
      patientsLoading,
      activePatient,
      setActivePatientId,
      refreshPatients,
      prefs,
      setPref,
      resetPrefs,
    }),
    [
      session,
      authLoading,
      patients,
      patientsLoading,
      activePatient,
      setActivePatientId,
      refreshPatients,
      prefs,
      setPref,
      resetPrefs,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
  return ctx;
}
