import { useEffect, useState } from "react";
import { Cloud, CloudOff, RefreshCw, CheckCircle, Wifi, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  flushQueue,
  isOnline,
  isSimulatedOffline,
  onPendingChange,
  pendingCount,
  setSimulatedOffline,
} from "@/lib/offline";

export function OfflineStatusCard() {
  const [queueCount, setQueueCount] = useState<number>(0);
  const [offlineMode, setOfflineMode] = useState<boolean>(isSimulatedOffline());
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncedSuccess, setSyncedSuccess] = useState<boolean>(false);

  useEffect(() => {
    void pendingCount().then(setQueueCount);
    return onPendingChange(setQueueCount);
  }, []);

  const handleToggleOffline = () => {
    const next = !offlineMode;
    setOfflineMode(next);
    setSimulatedOffline(next);
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncedSuccess(false);
    const count = await flushQueue();
    setSyncing(false);
    if (count > 0) {
      setSyncedSuccess(true);
      setTimeout(() => setSyncedSuccess(false), 3000);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary">
            {offlineMode ? <CloudOff className="h-6 w-6" /> : <Cloud className="h-6 w-6" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Offline Remote Synchronization
            </h3>
            <p className="text-xs text-muted-foreground">
              IndexedDB local storage for remote North Eastern areas
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            offlineMode
              ? "bg-[#f7e2d8] text-[#8e452d]"
              : "bg-[#d8ebe2] text-[#1e5a40]"
          }`}
        >
          {offlineMode ? <Signal className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
          {offlineMode ? "Simulated Offline" : "Online & Connected"}
        </span>
      </div>

      <div className="rounded-2xl bg-muted/60 p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-foreground">Pending Queue (IndexedDB):</span>
          <span className="font-extrabold text-primary text-base">{queueCount} Items</span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {queueCount > 0
            ? "All game rounds, screening scores, and notes are securely cached locally on your device. They will automatically upload when network returns."
            : "No pending queue. All activities and cognitive metrics are fully synchronized."}
        </p>
      </div>

      {syncedSuccess && (
        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Successfully synchronized pending queue to cloud database!
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleToggleOffline}
          className="tap flex-1 text-sm font-semibold border-border"
        >
          {offlineMode ? "Switch to Online Mode" : "Simulate NE Hilly Area (Offline)"}
        </Button>

        <Button
          type="button"
          onClick={handleManualSync}
          disabled={syncing || offlineMode}
          className="tap gap-2 text-sm font-bold bg-primary text-primary-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Now"}
        </Button>
      </div>
    </div>
  );
}
