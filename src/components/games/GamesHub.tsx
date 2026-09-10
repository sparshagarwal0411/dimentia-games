import { useMemo, useState } from "react";
import {
  Trophy,
  Sparkles,
  Brain,
  Search,
  ArrowRight,
  Star,
  Crown,
  Flame,
  Clock,
  Zap,
  Play,
  CheckCircle2,
  Activity,
  Layers,
  LayoutGrid,
  CalendarClock,
  Smile,
  Heart,
  Palette,
  ScanSearch,
  SpellCheck,
  Mic,
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
import { Button } from "@/components/ui/button";
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

  const filteredGames = useMemo(() => {
    return GAMES.filter((g) => {
      const matchesCategory = activeCategory === "All" || g.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const stats = loadPlayerStats(activePatient?.id ?? "guest");
  const board = getTournamentBoard(activePatient?.id ?? "guest", activePatient?.name || "You");
  const exit = () => onSelect(null);

  const categories = ["All", "Memory", "Attention", "Recall", "Logic", "Language", "Social"];

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
      {/* High-Energy Arena Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-teal-500/10 p-6 sm:p-8 shadow-soft">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Cognitive Wellness Arena · North Eastern Cultural Edition
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Bespoke Brain Gym
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              9 scientifically targeted exercises calibrated to your personal cadence. Train memory, inhibitory focus, spatial chronology, and verbal retrieval with authentic regional themes.
            </p>
          </div>

          {/* Player Level & Streak XP Pod */}
          <div className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-soft min-w-[240px] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5 text-primary font-black">
                <Crown className="h-4 w-4" /> Level {playerLevel}
              </span>
              <span className="font-extrabold text-foreground">{stats.xp} XP</span>
            </div>
            <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-primary via-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                <Flame className="h-4 w-4 fill-current" /> {stats.streak} Day Streak
              </span>
              <span>{totalPlays(stats)} Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Daily Circuit Workout Callout */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <Zap className="h-7 w-7 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 text-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                  Recommended Routine
                </span>
                <span className="text-xs font-semibold text-muted-foreground">~5 mins total</span>
              </div>
              <h3 className="mt-1 text-xl font-black text-foreground">
                Today's 3-Game Cognitive Circuit
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Memory Match (Visual Retention) → Stroop Speed (Inhibition Control) → Verbal Garden (Language Lexicon)
              </p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => handleSelectGame("memory-match")}
            className="tap rounded-2xl font-bold shadow-soft gap-2 shrink-0 bg-primary text-primary-foreground hover:shadow-lift"
          >
            <Play className="h-4 w-4 fill-current" /> Launch Circuit Now
          </Button>
        </div>
      </div>

      {/* Search & Domain Filter Bar */}
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
                  "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all",
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
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exercises or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-full border border-border/80 bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      {/* Games Catalog Grid of Bespoke Cartridges */}
      {filteredGames.length === 0 ? (
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center">
          <Brain className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-bold text-foreground">No games found</h3>
          <p className="text-xs text-muted-foreground mt-1">Try selecting another domain or clearing your search.</p>
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
                className={cn(
                  "group relative flex flex-col justify-between rounded-3xl border-2 border-border/80 bg-gradient-to-br p-6 text-left shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all overflow-hidden",
                  game.cardGradient,
                  game.borderHover
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110", game.accent)}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-extrabold text-primary uppercase tracking-wider">
                        {game.badge}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {game.estimatedTime}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-black text-foreground group-hover:text-primary transition-colors">
                    {game.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-bold text-primary">{game.skill}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">{game.desc}</p>
                </div>

                <div className="mt-6 border-t border-border/50 pt-3.5 flex items-center justify-between text-xs">
                  {played ? (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-extrabold text-foreground">{played.best}%</span>
                      <span className="text-[11px] text-muted-foreground">({played.plays} {played.plays === 1 ? "round" : "rounds"})</span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                      <Clock className="h-3 w-3" /> Ready to Play
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 text-xs font-black text-primary group-hover:translate-x-1 transition-transform">
                    {played ? "Train Again" : "Start Game"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Community Tournament Leaderboard Podium */}
      <section className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-sm">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-foreground">Weekly Regional Challenge</h3>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  Sprint Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {board.theme} · Play any cognitive activity to earn tournament XP
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border/80 px-4 py-2 text-xs font-bold shadow-sm self-start sm:self-center">
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
                  "rounded-2xl border-2 p-4 text-center transition-all shadow-sm",
                  colors[i],
                  entry.isYou ? "ring-2 ring-primary border-primary" : ""
                )}
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {medals[i]}
                </span>
                <p className="mt-1 text-base font-black text-foreground truncate">
                  {entry.name} {entry.isYou ? "(You)" : ""}
                </p>
                <p className="mt-1 text-2xl font-black text-foreground">
                  {entry.points} <span className="text-xs font-normal text-muted-foreground">pts</span>
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
