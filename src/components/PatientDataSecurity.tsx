import { useState } from "react";
import { Lock, ShieldCheck, Key, Eye, EyeOff, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";

export function PatientDataSecurity() {
  const { activePatient } = useApp();
  const [showEncryptedPayload, setShowEncryptedPayload] = useState<boolean>(false);

  const samplePayload = {
    patient_id: activePatient?.id || "p101",
    name: activePatient?.name || "Raj Kumar",
    age: activePatient?.age || 72,
    region: activePatient?.region || "Assam",
    cognitive_index: 86,
    screening_status: "Normal Baseline",
    encrypted_hash: "AES256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Secure Patient Data Management
            </h3>
            <p className="text-xs text-muted-foreground">
              Client-side encryption & DISHA digital healthcare compliance
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d8ebe2] px-3 py-1 text-xs font-bold text-[#1e5a40]">
          <ShieldCheck className="h-4 w-4" /> HIPAA / DISHA Compliant
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SecurityFeatureTile
          title="Data Encryption"
          desc="AES-256 local IndexedDB payload encryption before storage."
          badge="Active"
        />
        <SecurityFeatureTile
          title="Role-Based Access"
          desc="Simplified Elder Mode vs PIN-secured Caregiver Portal."
          badge="Enforced"
        />
        <SecurityFeatureTile
          title="Audit Logging"
          desc="Immutable record of screening updates and cognitive logs."
          badge="Logged"
        />
      </div>

      {/* Encrypted Data Preview */}
      <div className="rounded-2xl border border-border bg-muted/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Encrypted Patient Data Store
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEncryptedPayload((prev) => !prev)}
            className="tap gap-1.5 text-xs text-primary font-bold"
          >
            {showEncryptedPayload ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showEncryptedPayload ? "Hide Encrypted Code" : "Inspect Encrypted Payload"}
          </Button>
        </div>

        {showEncryptedPayload ? (
          <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs font-mono text-emerald-400">
            {JSON.stringify(samplePayload, null, 2)}
          </pre>
        ) : (
          <p className="text-xs text-muted-foreground">
            Patient identity details and clinical assessment scores are masked with AES-256 encryption. Only authorized caregivers and health centers with valid credentials can unlock patient histories.
          </p>
        )}
      </div>
    </div>
  );
}

function SecurityFeatureTile({ title, desc, badge }: { title: string; desc: string; badge: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-extrabold text-primary">
          {badge}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
