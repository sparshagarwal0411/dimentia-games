import { Trophy } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function GamesHub({
  selectedGame,
  onSelect,
}: {
  selectedGame: GameId | null;
  onSelect: (id: GameId | null) => void;
}) {
  const { activePatient } = useApp();
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

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <div>
        <p className="text-sm font-semibold text-primary">Daily brain games</p>
        <h2 className="mt-1 text-3xl text-foreground">Play, practise, keep going</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Short games inspired by memory cards, face matching, colour attention, word fluency and
          speech practice. They are for daily exercise — not a diagnosis.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile label="XP" value={String(stats.xp)} />
        <StatTile label="Day streak" value={String(stats.streak)} />
        <StatTile label="Sessions" value={String(totalPlays(stats))} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => {
          const Icon = game.icon;
          const played = stats.games[game.id];
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => onSelect(game.id)}
              className="rounded-2xl border border-border bg-card p-5 text-left shadow-soft hover:shadow-lift"
            >
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", game.accent)}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{game.title}</h3>
              <p className="mt-1 text-xs font-medium text-primary">{game.skill}</p>
              <p className="mt-2 text-sm text-muted-foreground">{game.desc}</p>
              {played ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Best {played.best}% · {played.plays} play{played.plays === 1 ? "" : "s"}
                </p>
              ) : (
                <p className="mt-3 text-xs font-medium text-primary">Start</p>
              )}
            </button>
          );
        })}
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-sun" />
          <h3 className="text-lg font-semibold">This week’s tournament</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {board.theme} · You are #{board.yourRank} with {board.yourPoints} pts
        </p>
        <ol className="mt-4 space-y-2">
          {board.entries.slice(0, 7).map((entry, i) => (
            <li
              key={`${entry.name}-${i}`}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-sm",
                entry.isYou ? "bg-secondary font-semibold" : "bg-muted/50",
              )}
            >
              <span>
                {i + 1}. {entry.name}
                {entry.isYou ? " (you)" : ""}
              </span>
              <span>{entry.points} pts</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
