/**
 * Adaptive difficulty engine.
 *
 * Rule-based for the MVP, but deliberately isolated behind a single
 * `recommendDifficulty` contract so a trained model can replace the internals
 * without touching any game or screen.
 */

export const DOMAINS = ["memory", "attention", "pattern", "recall", "emotion"] as const;
export type Domain = (typeof DOMAINS)[number];

export const GAME_DOMAIN: Record<string, Domain> = {
  "memory-match": "memory",
  "pattern-recognition": "pattern",
  "routine-recall": "recall",
  "object-recognition": "attention",
  "emotion-recognition": "emotion",
};

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 5;

export type AttemptSignal = {
  accuracy: number; // 0..1
  response_time: number; // seconds per question
  mistakes: number;
  difficulty: number;
};

export type Recommendation = {
  level: number;
  direction: "up" | "hold" | "down";
  reason: string;
};

/** Weighted performance score in 0..1 from one or more recent attempts. */
export function performanceScore(attempts: AttemptSignal[]): number {
  if (attempts.length === 0) return 0.7;
  const recent = attempts.slice(0, 3);
  let weightSum = 0;
  let total = 0;
  recent.forEach((attempt, index) => {
    const weight = 1 / (index + 1);
    // Speed factor: 6s per question is comfortable, 15s+ is slow.
    const speed = Math.max(0, Math.min(1, (15 - attempt.response_time) / 9));
    const score = attempt.accuracy * 0.8 + speed * 0.2;
    total += score * weight;
    weightSum += weight;
  });
  return Math.max(0, Math.min(1, total / weightSum));
}

export function recommendDifficulty(
  currentLevel: number,
  attempts: AttemptSignal[],
): Recommendation {
  const score = performanceScore(attempts);
  const clamp = (level: number) => Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, level));

  if (attempts.length === 0) {
    return { level: clamp(currentLevel), direction: "hold", reason: "No activity yet" };
  }
  if (score > 0.8) {
    return {
      level: clamp(currentLevel + 1),
      direction: "up",
      reason: "Strong recent performance — a little more challenge",
    };
  }
  if (score < 0.6) {
    return {
      level: clamp(currentLevel - 1),
      direction: "down",
      reason: "Recent attempts were harder — easing the challenge",
    };
  }
  return {
    level: clamp(currentLevel),
    direction: "hold",
    reason: "Comfortable and consistent — keeping this level",
  };
}

/** Friendly, non-diagnostic label for a domain level. */
export function levelLabel(level: number): string {
  if (level >= 5) return "Excellent";
  if (level >= 4) return "Good";
  if (level >= 3) return "Moderate";
  if (level >= 2) return "Building";
  return "Needs practice";
}

export const DOMAIN_LABELS: Record<Domain, string> = {
  memory: "Memory practice",
  attention: "Attention performance",
  pattern: "Pattern recognition",
  recall: "Daily recall",
  emotion: "Emotion recognition",
};

/** Engagement label from attempts in the last 7 days. */
export function engagementLabel(attemptsLast7Days: number): "High" | "Moderate" | "Low" {
  if (attemptsLast7Days >= 10) return "High";
  if (attemptsLast7Days >= 4) return "Moderate";
  return "Low";
}

/**
 * Balanced family-challenge scoring so lower-performing players are not always
 * at the bottom: improvement 40%, consistency 30%, participation 20%,
 * accuracy 10%.
 */
export function balancedScore(input: {
  improvement: number; // 0..1
  consistency: number; // 0..1
  participation: number; // 0..1
  accuracy: number; // 0..1
}): number {
  return Math.round(
    (input.improvement * 0.4 +
      input.consistency * 0.3 +
      input.participation * 0.2 +
      input.accuracy * 0.1) *
      100,
  );
}
