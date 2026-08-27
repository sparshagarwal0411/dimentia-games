import { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, type PatientRole } from "@/lib/app-state";
import { NE_DISTRICTS } from "@/lib/regions";
import { SiteHeader } from "@/components/layout/SiteChrome";

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-3 py-3 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring";

export function OnboardingPage({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const { registerPatient } = useApp();

  const [role, setRole] = useState<PatientRole>("self");
  const [name, setName] = useState("");
  const [sex, setSex] = useState<"Male" | "Female" | "Other">("Female");
  const [age, setAge] = useState(68);
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("Assam");
  const [district, setDistrict] = useState(NE_DISTRICTS.Assam[0]);
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverPhone, setCaregiverPhone] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegionChange = (next: string) => {
    setRegion(next);
    setDistrict(NE_DISTRICTS[next]?.[0] || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the person’s full name.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await registerPatient({
        name: name.trim(),
        sex,
        age: Number(age) || 65,
        phone: phone.trim() || "+91 9800000000",
        language: "en",
        region,
        district,
        caregiver_name: caregiverName.trim() || undefined,
        caregiver_phone: caregiverPhone.trim() || undefined,
        clinical_notes: clinicalNotes.trim() || undefined,
        role,
        elder_mode: true,
        base_difficulty: 2,
      });
      onComplete();
    } catch (err) {
      console.error(err);
      setError("Could not save this profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader simple onLogoClick={onBack} onStart={onBack} ctaLabel="Back to home" />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to landing page
        </button>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Onboarding</p>
        <h1 className="mt-2 text-3xl text-foreground">Create a profile</h1>
        <p className="mt-2 text-muted-foreground">
          Add basic details first. Next you will see a dashboard. The dementia test is optional from there.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <fieldset>
            <legend className="text-sm font-semibold text-foreground">I am completing this as</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["self", "The person being screened"],
                  ["caregiver", "A family member or caregiver"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${
                    role === value ? "border-primary bg-secondary/60 font-medium" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={role === value}
                    onChange={() => setRole(value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Full name
              <input required value={name} onChange={(e) => setName(e.target.value)} className={`${fieldClass} mt-1.5`} />
            </label>
            <label className="block text-sm font-medium">
              Sex
              <select value={sex} onChange={(e) => setSex(e.target.value as typeof sex)} className={`${fieldClass} mt-1.5`}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Age
              <input
                type="number"
                min={40}
                max={110}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={`${fieldClass} mt-1.5`}
              />
            </label>
            <label className="block text-sm font-medium">
              Phone
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`${fieldClass} mt-1.5`} />
            </label>
            <label className="block text-sm font-medium">
              State
              <select value={region} onChange={(e) => handleRegionChange(e.target.value)} className={`${fieldClass} mt-1.5`}>
                {Object.keys(NE_DISTRICTS).map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              District
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className={`${fieldClass} mt-1.5`}>
                {(NE_DISTRICTS[region] || []).map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Family / caregiver name
              <input value={caregiverName} onChange={(e) => setCaregiverName(e.target.value)} className={`${fieldClass} mt-1.5`} />
            </label>
            <label className="block text-sm font-medium">
              Caregiver phone
              <input
                type="tel"
                value={caregiverPhone}
                onChange={(e) => setCaregiverPhone(e.target.value)}
                className={`${fieldClass} mt-1.5`}
              />
            </label>
          </div>

          <label className="block text-sm font-medium">
            Anything family has noticed (optional)
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="For example: repeating questions, getting lost on familiar roads…"
              className={`${fieldClass} mt-1.5`}
            />
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Saved on this device.
            </p>
            <Button type="submit" disabled={isSubmitting} className="rounded-full px-6">
              {isSubmitting ? "Saving…" : "Go to dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
