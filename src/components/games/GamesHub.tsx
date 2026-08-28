import { useState } from "react";
import { Trophy, Sparkles, Brain, Filter } from "lucide-react";
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
  const stats = loadPlayerStats(activePatient?.id ?? "guest");
  const board = getTournamentBoard(activePatient?.id ?? "guest", activePatient?.name || "You");
  const exit = () => onSelect(null);

  if (selectedGame === "memory-match") return <MemoryMatchGame onExit={exit} />;
  if (selectedGame === "pattern") return <PatternGame onExit={exit} />;
  if (selectedGame === "face-match") return <FaceMatchGame onExit={exit} />;
  if (selectedGame === "tricky-colors") return <TrickyColorsGame onExit={exit} />;
  if (selectedGame === "word-fluency") return <WordFluencyGame onExit={exit} />;
  if (selectedGame === "speech-echo") return <SpeechEchoGame onExit={exit} />;
  if (selectedGame === "find-it") return <FindItGame onExit={exit} />;
  if (selectedGame === "routine-recall") return <RoutineRecallGame onExit={exit} />;
  if (selectedGame === "emotion-recognition") return <EmotionGame onExit={exit} />;

  const categories = ["All", "Memory", "Attention", "Recall", "Logic", "Language", "Social"];
  const filteredGames = activeCategory === "All" ? GAMES : GAMES.filter((g) => g.category === activeCategory);

  const handleSelectGame = (id: GameId) => {
    soundEffects.playClick();
    onSelect(id);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Adaptive Cognitive Gym
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Play, train, and keep sharp
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            9 targeted cognitive activities designed with familiar North East cultural themes. The AI adapts difficulty (Levels 1–5) based on your reaction cadence and accuracy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatTile label="Total XP" value={String(stats.xp)} accent="text-amber-600 dark:text-amber-400" />
        <StatTile label="Day Streak" value={`${stats.streak} 🔥`} accent="text-rose-600 dark:text-rose-400" />
        <StatTile label="Sessions Completed" value={String(totalPlays(stats))} accent="text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0 ml-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveCategory(cat);
            }}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game) => {
          const Icon = game.icon;
          const played = stats.games[game.id];
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => handleSelectGame(game.id)}
              className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 text-left shadow-soft hover:shadow-lift hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-105", game.accent)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-muted/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {game.category}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {game.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-primary">{game.skill}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{game.desc}</p>
              </div>

              <div className="mt-5 border-t border-border/50 pt-3 flex items-center justify-between text-xs">
                {played ? (
                  <span className="font-semibold text-muted-foreground">
                    Best: <span className="text-foreground font-bold">{played.best}%</span> · {played.plays} {played.plays === 1 ? "play" : "plays"}
                  </span>
                ) : (
                  <span className="font-semibold text-primary flex items-center gap-1">
                    Play Now →
                  </span>
                )}
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">
                  Adaptive L1-5
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <section className="rounded-3xl border border-border bg-gradient-to-br from-card to-card/60 p-6 shadow-soft">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Weekly Community Tournament</h3>
              <p className="text-xs text-muted-foreground">{board.theme}</p>
            </div>
          </div>
          <div className="rounded-full bg-secondary/80 px-3.5 py-1 text-xs font-bold text-secondary-foreground">
            Rank #{board.yourRank} · {board.yourPoints} pts
          </div>
        </div>

        <ol className="mt-5 grid gap-2 sm:grid-cols-2">
          {board.entries.slice(0, 6).map((entry, i) => (
            <li
              key={`${entry.name}-${i}`}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-2.5 text-xs transition-colors",
                entry.isYou
                  ? "border border-primary/40 bg-primary/10 font-bold text-primary"
                  : "bg-muted/40 text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background font-bold text-[10px] text-foreground">
                  {i + 1}
                </span>
                <span className="font-semibold text-foreground">
                  {entry.name} {entry.isYou ? "(You)" : ""}
                </span>
              </div>
              <span className="font-bold">{entry.points} pts</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function StatTile({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-4 text-center shadow-soft">
      <p className={cn("text-2xl sm:text-3xl font-extrabold", accent)}>{value}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}
