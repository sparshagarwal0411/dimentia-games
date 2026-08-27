import { useEffect, useState } from "react";
import { CheckCircle2, CloudOff, RefreshCw } from "lucide-react";

import { flushQueue, isOnline, onPendingChange } from "@/lib/offline";
import { cn } from "@/lib/utils";

export function OfflineBanner() {
  const [pending, setPending] = useState(0);
  const [online, setOnline] = useState(true);
  const [justSynced, setJustSynced] = useState(false);

  useEffect(() => {
    const unsubscribe = onPendingChange((count) => {
      setPending((previous) => {
        if (previous > 0 && count === 0) {
          setJustSynced(true);
          window.setTimeout(() => setJustSynced(false), 4000);
        }
        return count;
      });
    });
    const refresh = () => setOnline(isOnline());
    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    window.addEventListener("cc:network", refresh);
    const interval = window.setInterval(refresh, 4000);
    return () => {
      void unsubscribe;
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      window.removeEventListener("cc:network", refresh);
      window.clearInterval(interval);
    };
  }, []);

  if (online && pending === 0 && !justSynced) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 px-4 py-2 text-center text-base font-semibold",
        !online
          ? "bg-accent text-accent-foreground"
          : pending > 0
            ? "bg-secondary text-secondary-foreground"
            : "bg-secondary text-secondary-foreground",
      )}
      role="status"
    >
      {!online ? (
        <>
          <CloudOff className="h-5 w-5" />
          Offline — games and reminders keep working
          {pending > 0 ? ` · ${pending} activities waiting to sync` : ""}
        </>
      ) : pending > 0 ? (
        <>
          <RefreshCw className="h-5 w-5 animate-spin" />
          {pending} activities waiting to sync
          <button type="button" className="underline" onClick={() => void flushQueue()}>
            Sync now
          </button>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-5 w-5" />
          All activities synchronized
        </>
      )}
    </div>
  );
}
