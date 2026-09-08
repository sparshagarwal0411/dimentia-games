import { useMemo, useState } from "react";
import {
  Trophy,
  Sparkles,
  Brain,
  Filter,
  Flame,
  Zap,
  Search,
  ArrowRight,
  Star,
  Award,
  Crown,
  Layers,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { GAMES, type GameId } from "@/lib/games-catalog";
import { getTournamentBoard, loadPlayerStats, totalPlays } from "@/lib/game-progress";
import { useApp } from "@/lib/app-state";
import { MemoryMatchGame } from "@/components/games/MemoryMatchGame";
import { PatternGame } from "@/components/games/PatternGame";
import { FaceMatchGame } from "@/components/games/FaceMatchGame";
import { TrickyColorsGame } from "@/components/games/TrickyColorsGame";
import { WordFluencyGame } from "@/components/games/WordFluencyGame";
import { SpeechEchoGame } from "@/components/games/SpeechEchoGame";
import { FindItGame } from "@/components/games/FindItGame";
import { RoutineRecallGame } from "@/components/games/RoutineRecallGame";
import { EmotionGame } from "@/components/games/EmotionGame";
import { soundEffects } from "@/lib/audio-effects";
import { cn } from "@/lib/utils";

export function GamesHub({
  selectedGame,
  onSelect,
}: {
  selectedGame: GameId | null;
  onSelect: (id: GameId | null) => void;
}) {
  const { activePatient } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const stats = loadPlayerStats(activePatient?.id ?? "guest");
  const board = getTournamentBoard(activePatient?.id ?? "guest", activePatient?.name || "You");
  const exit = () => onSelect(null);

  const categories = ["All", "Memory", "Attention", "Recall", "Logic", "Language", "Social"];

  const filteredGames = useMemo(() => {
    return GAMES.filter((g) => {
      const matchesCategory = activeCategory === "All" || g.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.skill.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSelectGame = (id: GameId) => {
    soundEffects.playClick();
    onSelect(id);
  };

  const playerLevel = Math.floor(stats.xp / 120) + 1;
  const xpInCurrentLevel = stats.xp % 120;
  const levelProgress = Math.min(100, Math.round((xpInCurrentLevel / 120) * 100));

  // Category counts
  const countForCategory = (cat: string) => {
    if (cat === "All") return GAMES.length;
    return GAMES.filter((g) => g.category === cat).length;
  };

  if (selectedGame === "memory-match") return <MemoryMatchGame onExit={exit} />;
  if (selectedGame === "pattern") return <PatternGame onExit={exit} />;
  if (selectedGame === "face-match") return <FaceMatchGame onExit={exit} />;
  if (selectedGame === "tricky-colors") return <TrickyColorsGame onExit={exit} />;
  if (selectedGame === "word-fluency") return <WordFluencyGame onExit={exit} />;
  if (selectedGame === "speech-echo") return <SpeechEchoGame onExit={exit} />;
  if (selectedGame === "find-it") return <FindItGame onExit={exit} />;
  if (selectedGame === "routine-recall") return <RoutineRecallGame onExit={exit} />;
  if (selectedGame === "emotion-recognition") return <EmotionGame onExit={exit} />;


  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-teal-500/5 p-6 sm:p-8 shadow-soft">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Adaptive Cognitive Gym · North East Cultural Edition
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Play, Train & Strengthen Your Mind
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              9 targeted cognitive activities designed with familiar North East cultural motifs. Our adaptive engine dynamically calibrates difficulty (Levels 1–5) based on your reaction cadence and accuracy.
            </p>
          </div>

          {/* Level & XP Capsule */}
          <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-soft min-w-[220px] backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1 text-primary">
                <Crown className="h-3.5 w-3.5" /> Level {playerLevel}
              </span>
              <span>{stats.xp} Total XP</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-primary to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Flame className="h-3.5 w-3.5 fill-current" /> {stats.streak} day streak
              </span>
              <span>{totalPlays(stats)} plays</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count = countForCategory(cat);
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveCategory(cat);
                }}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm scale-100 ring-1 ring-primary/20"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{cat}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px]",
                    active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-full border border-border/80 bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Games Catalog Grid */}
      {filteredGames.length === 0 ? (
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center">
          <Brain className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-bold text-foreground">No games found</h3>
          <p className="text-xs text-muted-foreground mt-1">Try selecting another category or clearing your search.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game) => {
            const Icon = game.icon;
            const played = stats.games[game.id];
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => handleSelectGame(game.id)}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 text-left shadow-soft hover:shadow-lift hover:border-primary/50 hover:-translate-y-1 transition-all overflow-hidden"
              >
                {/* Subtle top gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-teal-500/40 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110", game.accent)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                        {game.category}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        L1–5
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {game.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-primary">{game.skill}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">{game.desc}</p>
                </div>

                <div className="mt-6 border-t border-border/50 pt-3.5 flex items-center justify-between text-xs">
                  {played ? (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-foreground">{played.best}%</span>
                      <span className="text-[11px] text-muted-foreground">({played.plays} {played.plays === 1 ? "round" : "rounds"})</span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                      <Clock className="h-3 w-3" /> ~2 mins session
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                    {played ? "Play Again" : "Start Workout"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Community Tournament Podium Section */}
      <section className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">Weekly Community Tournament</h3>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  Active Sprint
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {board.theme} · Play any cognitive game to earn points towards your regional leaderboard
              </p>
            </div>
          </div>

          <div className="rounded-full bg-card border border-border/80 px-4 py-2 text-xs font-bold shadow-sm self-start sm:self-center">
            Your Standing: <span className="text-primary font-black">Rank #{board.yourRank}</span> · {board.yourPoints} pts
          </div>
        </div>

        {/* Podium Top 3 */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {board.entries.slice(0, 3).map((entry, i) => {
            const medals = ["🥇 1st Place", "🥈 2nd Place", "🥉 3rd Place"];
            const colors = [
              "border-amber-500/40 bg-amber-500/5",
              "border-slate-400/40 bg-slate-500/5",
              "border-amber-700/40 bg-amber-700/5",
            ];
            return (
              <div
                key={entry.name}
                className={cn(
                  "rounded-2xl border p-4 text-center transition-all",
                  colors[i],
                  entry.isYou ? "ring-2 ring-primary" : ""
                )}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {medals[i]}
                </span>
                <p className="mt-1 text-base font-bold text-foreground truncate">
                  {entry.name} {entry.isYou ? "(You)" : ""}
                </p>
                <p className="mt-1 text-xl font-black text-foreground">
                  {entry.points} <span className="text-xs font-normal text-muted-foreground">pts</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Remaining list */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {board.entries.slice(3, 7).map((entry, i) => (
            <div
              key={entry.name}
              className={cn(
                "flex items-center justify-between rounded-xl px-3.5 py-2 text-xs transition-colors",
                entry.isYou
                  ? "border border-primary/40 bg-primary/10 font-bold text-primary"
                  : "bg-muted/40 text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-foreground">
                  {i + 4}
                </span>
                <span className="font-semibold text-foreground truncate max-w-[160px]">
                  {entry.name} {entry.isYou ? "(You)" : ""}
                </span>
              </div>
              <span className="font-bold text-foreground">{entry.points} pts</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
