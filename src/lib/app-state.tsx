import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { cacheGet, cacheSet, hydrateSimulatedOffline, startSyncWatcher } from "@/lib/offline";
import type { ScreeningResult } from "@/lib/screening";
import { setVoiceGuidanceEnabled } from "@/lib/speech";
import { soundEffects } from "@/lib/audio-effects";

export type PatientRole = "self" | "caregiver";

export type Patient = {
  id: string;
  caregiver_id?: string;
  name: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  phone: string;
  language: string;
  region: string;
  district: string;
  caregiver_name?: string;
  caregiver_phone?: string;
  clinical_notes?: string;
  patient_photo?: string;
  caregiver_photo?: string;
  role: PatientRole;
  last_screening?: ScreeningResult;
  elder_mode: boolean;
  base_difficulty: number;
  created_at: string;
};

export type A11yPrefs = {
  text_scale: number;
  high_contrast: boolean;
  extra_high_contrast: boolean;
  large_buttons: boolean;
  voice_guidance: boolean;
  slow_mode: boolean;
  slow_animations: boolean;
  reduce_motion: boolean;
  reduce_sounds: boolean;
  dark_mode: boolean;
  simplify: boolean;
  enhanced_focus: boolean;
  colorblind_friendly: boolean;
  auto_read: boolean;
};

export const DEFAULT_PREFS: A11yPrefs = {
  text_scale: 1,
  high_contrast: false,
  extra_high_contrast: false,
  large_buttons: true,
  voice_guidance: true,
  slow_mode: false,
  slow_animations: false,
  reduce_motion: false,
  reduce_sounds: false,
  dark_mode: false,
  simplify: false,
  enhanced_focus: false,
  colorblind_friendly: false,
  auto_read: false,
};

const ACTIVE_KEY = "neurotrack.activePatient";
const PATIENTS_STORE_KEY = "neurotrack.localPatients";
const PREFS_KEY = "neurotrack.prefs";

type AppValue = {
  session: Session | null;
  user: User | null;
  authLoading: boolean;
  patients: Patient[];
  patientsLoading: boolean;
  activePatient: Patient | null;
  setActivePatientId: (id: string) => void;
  registerPatient: (data: Omit<Patient, "id" | "created_at">) => Promise<Patient>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  refreshPatients: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  prefs: A11yPrefs;
  setPref: <K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => void;
  resetPrefs: () => void;
  a11yPanelOpen: boolean;
  setA11yPanelOpen: (open: boolean) => void;
  openA11yPanel: () => void;
  closeA11yPanel: () => void;
  toggleA11yPanel: () => void;
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
      setAuthLoading(false);
    });

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    }).catch(() => {
      setAuthLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    setPatients([]);
    setActiveId(null);
    window.localStorage.removeItem(ACTIVE_KEY);
    window.localStorage.removeItem(PATIENTS_STORE_KEY);
    await cacheSet("patients", []);
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    setSession(null);
  };

  /* ------------------------------ offline ----------------------------- */
  useEffect(() => {
    hydrateSimulatedOffline();
    return startSyncWatcher();
  }, []);

  /* ------------------------------ patients ---------------------------- */
  const refreshPatients = useCallback(async () => {
    const normalize = (item: Patient): Patient => ({
      ...item,
      role: item.role === "caregiver" ? "caregiver" : "self",
    });

    // 1. Try local cache / LocalStorage first
    const cached = await cacheGet<Patient[]>("patients");
    const localStoredRaw = window.localStorage.getItem(PATIENTS_STORE_KEY);
    const localStored: Patient[] = (localStoredRaw ? JSON.parse(localStoredRaw) : []).map(normalize);

    if (cached && cached.length > 0) {
      setPatients(cached.map(normalize));
      setPatientsLoading(false);
    } else if (localStored.length > 0) {
      setPatients(localStored);
      setPatientsLoading(false);
    }

    // 2. Fetch from Supabase if connected
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        const merged: Patient[] = data.map((item: any) => ({
          id: item.id,
          caregiver_id: item.caregiver_id || "",
          name: item.name || "Patient",
          age: Number(item.age) || 65,
          sex: item.sex || "Male",
          phone: item.phone || "+91 9800000000",
          language: item.language || "en",
          region: item.region || "Assam",
          district: item.district || "Kamrup Metropolitan",
          caregiver_name: item.caregiver_name || "",
          caregiver_phone: item.caregiver_phone || "",
          clinical_notes: item.clinical_notes || "",
          patient_photo: item.patient_photo || "",
          caregiver_photo: item.caregiver_photo || "",
          role: item.role === "caregiver" ? "caregiver" : "self",
          last_screening: item.last_screening || undefined,
          elder_mode: item.elder_mode ?? true,
          base_difficulty: item.base_difficulty ?? 2,
          created_at: item.created_at || new Date().toISOString(),
        }));
        setPatients(merged);
        void cacheSet("patients", merged);
        window.localStorage.setItem(PATIENTS_STORE_KEY, JSON.stringify(merged));
      }
    } catch (e) {
      console.warn("Could not query Supabase patients, using local storage state", e);
    } finally {
      setPatientsLoading(false);
    }
  }, []);

  useEffect(() => {
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

  const registerPatient = useCallback(
    async (data: Omit<Patient, "id" | "created_at">): Promise<Patient> => {
      // Attempt Supabase insert first (it generates the UUID server-side)
      try {
        const { data: row, error } = await supabase
          .from("patients")
          .insert({
            caregiver_id: session?.user?.id ?? "",
            name: data.name,
            age: data.age,
            sex: data.sex,
            phone: data.phone,
            language: data.language,
            region: data.region,
            district: data.district,
            caregiver_name: data.caregiver_name ?? "",
            caregiver_phone: data.caregiver_phone ?? "",
            clinical_notes: data.clinical_notes ?? "",
            patient_photo: data.patient_photo ?? "",
            caregiver_photo: data.caregiver_photo ?? "",
            role: data.role,
            elder_mode: data.elder_mode,
            base_difficulty: data.base_difficulty,
            last_screening: (data.last_screening as any) ?? null,
          })
          .select()
          .single();

        if (error) throw error;

        const newPatient: Patient = {
          ...data,
          id: row.id,
          caregiver_id: row.caregiver_id,
          created_at: row.created_at,
        };

        setPatients((prev) => {
          const updated = [...prev, newPatient];
          window.localStorage.setItem(PATIENTS_STORE_KEY, JSON.stringify(updated));
          void cacheSet("patients", updated);
          return updated;
        });
        setActivePatientId(newPatient.id);
        return newPatient;
      } catch (err) {
        // Offline fallback: generate local ID and queue for later sync
        console.warn("Supabase insert failed, using local fallback:", err);
        const newId = `pat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const newPatient: Patient = {
          ...data,
          id: newId,
          created_at: new Date().toISOString(),
        };
        setPatients((prev) => {
          const updated = [...prev, newPatient];
          window.localStorage.setItem(PATIENTS_STORE_KEY, JSON.stringify(updated));
          void cacheSet("patients", updated);
          return updated;
        });
        setActivePatientId(newId);
        return newPatient;
      }
    },
    [session, setActivePatientId],
  );

  const updatePatient = useCallback(async (id: string, updates: Partial<Patient>) => {
    // Optimistic local update
    setPatients((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      window.localStorage.setItem(PATIENTS_STORE_KEY, JSON.stringify(updated));
      void cacheSet("patients", updated);
      return updated;
    });
    // Persist to Supabase
    try {
      const supabaseUpdates: Record<string, unknown> = {};
      const allowed = [
        "name", "age", "sex", "phone", "language", "region", "district",
        "caregiver_name", "caregiver_phone", "clinical_notes", "role",
        "elder_mode", "base_difficulty", "last_screening",
        "patient_photo", "caregiver_photo",
      ];
      for (const key of allowed) {
        if (key in updates) supabaseUpdates[key] = (updates as any)[key];
      }
      if (Object.keys(supabaseUpdates).length > 0) {
        await supabase.from("patients").update(supabaseUpdates as any).eq("id", id);
      }
    } catch (err) {
      console.warn("Could not sync patient update to Supabase:", err);
    }
  }, []);

  const deletePatient = useCallback(async (id: string) => {
    // Optimistic local removal
    setPatients((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      window.localStorage.setItem(PATIENTS_STORE_KEY, JSON.stringify(updated));
      void cacheSet("patients", updated);
      return updated;
    });
    // Remove from Supabase
    try {
      await supabase.from("patients").delete().eq("id", id);
    } catch (err) {
      console.warn("Could not delete patient from Supabase:", err);
    }
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

  const persistPrefs = useCallback(
    (next: A11yPrefs) => {
      window.localStorage.setItem(prefsKey, JSON.stringify(next));
    },
    [prefsKey],
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

  const [a11yPanelOpen, setA11yPanelOpen] = useState(false);
  const openA11yPanel = useCallback(() => setA11yPanelOpen(true), []);
  const closeA11yPanel = useCallback(() => setA11yPanelOpen(false), []);
  const toggleA11yPanel = useCallback(() => setA11yPanelOpen((prev) => !prev), []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--text-scale", String(prefs.text_scale));
    root.classList.toggle("high-contrast", prefs.high_contrast || prefs.extra_high_contrast);
    root.classList.toggle("extra-high-contrast", prefs.extra_high_contrast);
    root.classList.toggle("large-buttons", prefs.large_buttons);
    root.classList.toggle("slow-mode", prefs.slow_mode || prefs.slow_animations);
    root.classList.toggle("reduced-motion", prefs.reduce_motion);
    root.classList.toggle("enhanced-focus", prefs.enhanced_focus);
    root.classList.toggle("colorblind-friendly", prefs.colorblind_friendly);
    root.classList.toggle("simplified", prefs.simplify);
    root.classList.toggle("dark", prefs.dark_mode);

    // Sync speech and audio synthesis globals
    setVoiceGuidanceEnabled(Boolean(prefs.voice_guidance));
    soundEffects.setMuted(Boolean(prefs.reduce_sounds));
  }, [prefs]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      authLoading,
      patients,
      patientsLoading,
      activePatient,
      setActivePatientId,
      registerPatient,
      updatePatient,
      deletePatient,
      refreshPatients,
      signInWithGoogle,
      signOut,
      prefs,
      setPref,
      resetPrefs,
      a11yPanelOpen,
      setA11yPanelOpen,
      openA11yPanel,
      closeA11yPanel,
      toggleA11yPanel,
    }),
    [
      session,
      authLoading,
      patients,
      patientsLoading,
      activePatient,
      setActivePatientId,
      registerPatient,
      updatePatient,
      deletePatient,
      refreshPatients,
      prefs,
      setPref,
      resetPrefs,
      a11yPanelOpen,
      openA11yPanel,
      closeA11yPanel,
      toggleA11yPanel,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
  return ctx;
}
