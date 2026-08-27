export type ScreeningTier = "normal" | "mci" | "dementia_risk";

export type AssessmentPart = "cognitive" | "speech" | "behavioral";

export type ScreeningResult = {
  score: number;
  tier: ScreeningTier;
  orientationScore: number;
  registrationScore: number;
  attentionScore: number;
  spatialScore: number;
  recallScore: number;
  cognitiveScore?: number;
  speechScore?: number;
  behavioralScore?: number;
  partsCompleted?: AssessmentPart[];
  timestamp: string;
};

export function combinedScore(result: Pick<ScreeningResult, "cognitiveScore" | "speechScore" | "behavioralScore" | "score">) {
  const parts = [result.cognitiveScore, result.speechScore, result.behavioralScore].filter(
    (n): n is number => typeof n === "number",
  );
  if (parts.length === 0) return result.score;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}

export function tierFromScore(score: number): ScreeningTier {
  if (score < 60) return "dementia_risk";
  if (score < 80) return "mci";
  return "normal";
}

export function needsCognitiveSupport(tier: ScreeningTier | undefined | null) {
  return tier === "mci" || tier === "dementia_risk";
}

export function tierLabel(tier: ScreeningTier) {
  if (tier === "dementia_risk") return "Elevated dementia risk";
  if (tier === "mci") return "Possible mild cognitive change";
  return "Typical cognitive baseline";
}

export function emptyScreening(): ScreeningResult {
  return {
    score: 0,
    tier: "normal",
    orientationScore: 0,
    registrationScore: 0,
    attentionScore: 0,
    spatialScore: 0,
    recallScore: 0,
    partsCompleted: [],
    timestamp: new Date().toISOString(),
  };
}

export function finalizeScreening(partial: ScreeningResult): ScreeningResult {
  const score = combinedScore(partial);
  return {
    ...partial,
    score,
    tier: tierFromScore(score),
    timestamp: new Date().toISOString(),
  };
}

export async function persistAssessment(patientId: string, result: ScreeningResult) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(patientId)) return;
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.from("assessments").insert({
      patient_id: patientId,
      cognitive_score: result.cognitiveScore ?? null,
      speech_score: result.speechScore ?? null,
      behavioral_score: result.behavioralScore ?? null,
      combined_score: result.score,
      tier: result.tier,
      parts_completed: result.partsCompleted ?? [],
      details: {
        orientationScore: result.orientationScore,
        registrationScore: result.registrationScore,
        attentionScore: result.attentionScore,
        spatialScore: result.spatialScore,
        recallScore: result.recallScore,
        timestamp: result.timestamp,
      },
    });
  } catch {
    /* last_screening JSON still saved on patients */
  }
}
