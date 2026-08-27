import { supabase } from "@/integrations/supabase/client";
import { DOMAINS, GAME_DOMAIN } from "@/lib/adaptive";

const GAME_IDS = Object.keys(GAME_DOMAIN);

type DemoPatient = {
  name: string;
  age: number;
  region: string;
  language: string;
  avatar_emoji: string;
  base_difficulty: number;
  trend: "improving" | "steady" | "declining";
};

const DEMO_PATIENTS: DemoPatient[] = [
  {
    name: "Raj Kumar",
    age: 72,
    region: "Assam",
    language: "en",
    avatar_emoji: "👴",
    base_difficulty: 3,
    trend: "improving",
  },
  {
    name: "Bina Devi",
    age: 78,
    region: "Meghalaya",
    language: "hi",
    avatar_emoji: "👵",
    base_difficulty: 2,
    trend: "steady",
  },
  {
    name: "Tomba Singh",
    age: 69,
    region: "Manipur",
    language: "en",
    avatar_emoji: "🧓",
    base_difficulty: 4,
    trend: "declining",
  },
];

function accuracyFor(trend: DemoPatient["trend"], dayAgo: number) {
  const base = trend === "declining" ? 0.82 : trend === "steady" ? 0.72 : 0.55;
  const slope = trend === "improving" ? 0.02 : trend === "declining" ? -0.02 : 0;
  const value = base + slope * (13 - dayAgo) + (Math.random() * 0.12 - 0.06);
  return Math.max(0.25, Math.min(0.99, Number(value.toFixed(2))));
}

/** Seeds a realistic demo caseload for a caregiver with no patients yet. */
export async function seedDemoData(caregiverId: string) {
  const { data: created, error } = await supabase
    .from("patients")
    .insert(
      DEMO_PATIENTS.map((p) => ({
        caregiver_id: caregiverId,
        name: p.name,
        age: p.age,
        region: p.region,
        language: p.language,
        avatar_emoji: p.avatar_emoji,
        base_difficulty: p.base_difficulty,
        elder_mode: true,
      })),
    )
    .select();

  if (error || !created) throw error ?? new Error("Could not create demo patients");

  const attempts: Array<Record<string, unknown>> = [];
  const cognitive: Array<Record<string, unknown>> = [];
  const reminders: Array<Record<string, unknown>> = [];
  const challenges: Array<Record<string, unknown>> = [];
  const prefs: Array<Record<string, unknown>> = [];

  created.forEach((patient, index) => {
    const demo = DEMO_PATIENTS[index] as DemoPatient;

    for (let dayAgo = 13; dayAgo >= 0; dayAgo -= 1) {
      const sessionsToday = dayAgo % 3 === 0 ? 1 : 2;
      for (let s = 0; s < sessionsToday; s += 1) {
        const gameId = GAME_IDS[(dayAgo + s + index) % GAME_IDS.length] as string;
        const accuracy = accuracyFor(demo.trend, dayAgo);
        const created_at = new Date(
          Date.now() - dayAgo * 86400000 + s * 3 * 3600000,
        ).toISOString();
        attempts.push({
          patient_id: patient.id,
          game_id: gameId,
          difficulty: demo.base_difficulty,
          score: Math.round(accuracy * 100),
          accuracy,
          response_time: Number((5 + (1 - accuracy) * 9 + Math.random() * 2).toFixed(1)),
          mistakes: Math.round((1 - accuracy) * 5),
          created_at,
        });
      }
    }

    DOMAINS.forEach((domain, dIndex) => {
      cognitive.push({
        patient_id: patient.id,
        domain,
        level: Math.max(1, Math.min(5, demo.base_difficulty + ((dIndex % 3) - 1))),
      });
    });

    reminders.push(
      {
        patient_id: patient.id,
        type: "medicine",
        title: "Morning medicine",
        description: "One tablet after breakfast",
        time: "09:00",
        frequency: "daily",
      },
      {
        patient_id: patient.id,
        type: "activity",
        title: "Evening walk",
        description: "A short walk in the garden",
        time: "17:00",
        frequency: "daily",
      },
      {
        patient_id: patient.id,
        type: "appointment",
        title: "Doctor visit",
        description: "Routine check-up at the clinic",
        time: "11:00",
        frequency: "once",
      },
    );

    prefs.push({ patient_id: patient.id });

    if (index === 0) {
      challenges.push({
        patient_id: patient.id,
        creator_name: "Priya",
        game_id: "memory-match",
        message: "Priya challenged you to Memory Match!",
        status: "pending",
        creator_score: 82,
      });
    }
  });

  await Promise.all([
    supabase.from("game_attempts").insert(attempts),
    supabase.from("cognitive_profiles").insert(cognitive),
    supabase.from("reminders").insert(reminders),
    supabase.from("family_challenges").insert(challenges),
    supabase.from("accessibility_preferences").insert(prefs),
  ]);

  return created;
}
