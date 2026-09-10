const STATS_KEY = "neurotrack.gameStats";
const TOURNAMENT_KEY = "neurotrack.tournamentWeek";

export type GameStat = {
  plays: number;
  best: number;
  lastScore: number;
  lastPlayed: string;
};

export type PlayerStats = {
  xp: number;
  streak: number;
  lastPlayDay: string | null;
  games: Record<string, GameStat>;
};

const EMPTY: PlayerStats = { xp: 0, streak: 0, lastPlayDay: null, games: {} };

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function weekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function loadPlayerStats(patientId: string): PlayerStats {
  try {
    const raw = window.localStorage.getItem(`${STATS_KEY}.${patientId}`);
    if (!raw) return { ...EMPTY, games: {} };
    return { ...EMPTY, ...(JSON.parse(raw) as PlayerStats), games: JSON.parse(raw).games ?? {} };
  } catch {
    return { ...EMPTY, games: {} };
  }
}

function savePlayerStats(patientId: string, stats: PlayerStats) {
  window.localStorage.setItem(`${STATS_KEY}.${patientId}`, JSON.stringify(stats));
}

export function recordGamePlay(patientId: string, gameId: string, score: number, passed = true): PlayerStats {
  const stats = loadPlayerStats(patientId);
  const today = dayKey();
  const prev = stats.games[gameId];
  // Passed: 35% of score as XP. Failed (lives ran out): only 10% for trying.
  const xpGain = passed
    ? Math.max(8, Math.round(score * 0.35))
    : Math.max(0, Math.round(score * 0.10));

  let streak = stats.streak;
  if (stats.lastPlayDay !== today) {
    const yesterday = dayKey(new Date(Date.now() - 86400000));
    streak = stats.lastPlayDay === yesterday ? stats.streak + 1 : 1;
  }

  const next: PlayerStats = {
    xp: stats.xp + xpGain,
    streak,
    lastPlayDay: today,
    games: {
      ...stats.games,
      [gameId]: {
        plays: (prev?.plays ?? 0) + 1,
        best: Math.max(prev?.best ?? 0, score),
        lastScore: score,
        lastPlayed: new Date().toISOString(),
      },
    },
  };
  savePlayerStats(patientId, next);
  addTournamentPoints(patientId, xpGain);
  void syncProgressToCloud(patientId, next);
  return next;
}

export type TournamentEntry = { name: string; points: number; isYou?: boolean };

const COMMUNITY: { name: string; points: number }[] = [
  { name: "Mina Deka", points: 420 },
  { name: "Aosen Ao", points: 390 },
  { name: "Lalrinpuii", points: 360 },
  { name: "Pema Bhutia", points: 310 },
  { name: "Biren Singh", points: 275 },
  { name: "Rupali Das", points: 240 },
];

export function addTournamentPoints(patientId: string, points: number) {
  const week = weekKey();
  const key = `${TOURNAMENT_KEY}.${week}`;
  let board: Record<string, number> = {};
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) board = JSON.parse(raw) as Record<string, number>;
  } catch {
    board = {};
  }
  board[patientId] = (board[patientId] ?? 0) + points;
  window.localStorage.setItem(key, JSON.stringify(board));
  void syncTournamentToCloud(patientId, week, board[patientId] ?? 0);
}

export function getTournamentBoard(patientId: string, displayName: string): {
  week: string;
  theme: string;
  entries: TournamentEntry[];
  yourPoints: number;
  yourRank: number;
} {
  const week = weekKey();
  const key = `${TOURNAMENT_KEY}.${week}`;
  let yours = 0;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) yours = (JSON.parse(raw) as Record<string, number>)[patientId] ?? 0;
  } catch {
    yours = 0;
  }

  const entries: TournamentEntry[] = [
    ...COMMUNITY,
    { name: displayName || "You", points: yours, isYou: true },
  ].sort((a, b) => b.points - a.points);

  const yourRank = entries.findIndex((e) => e.isYou) + 1;
  const themes = [
    "Tea-garden memory week",
    "Morning walk streak",
    "Word garden challenge",
    "Colour & calm week",
  ];
  const themeIndex = Number(week.replace(/\D/g, "").slice(-1)) % themes.length;

  return {
    week,
    theme: themes[themeIndex] ?? themes[0]!,
    entries,
    yourPoints: yours,
    yourRank,
  };
}

export function totalPlays(stats: PlayerStats) {
  return Object.values(stats.games).reduce((sum, g) => sum + g.plays, 0);
}

function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

async function syncProgressToCloud(patientId: string, stats: PlayerStats) {
  if (!isUuid(patientId)) return;
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.from("game_progress").upsert({
      patient_id: patientId,
      xp: stats.xp,
      streak: stats.streak,
      last_play_day: stats.lastPlayDay,
      stats: stats.games as never,
      updated_at: new Date().toISOString(),
    });
  } catch {
    /* local stats still count */
  }
}

async function syncTournamentToCloud(patientId: string, week: string, points: number) {
  if (!isUuid(patientId)) return;
  const board = getTournamentBoard(patientId, "You");
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.from("tournament_scores").upsert(
      {
        patient_id: patientId,
        week_key: week,
        theme: board.theme,
        points,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "patient_id,week_key" },
    );
  } catch {
    /* ignore */
  }
}
