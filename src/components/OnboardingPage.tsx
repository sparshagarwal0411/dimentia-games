import { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, Camera, Plus, Trash2, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, type PatientRole, type FamilyMember } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { NE_DISTRICTS } from "@/lib/regions";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-3 py-3 text-sm text-foreground outline-none ring-offset-background transition-all focus:ring-2 focus:ring-ring";

const RELATION_OPTIONS = [
  "Son",
  "Daughter",
  "Spouse",
  "Grandchild",
  "Brother",
  "Sister",
  "Mother",
  "Father",
  "Caregiver",
  "Friend",
  "Other",
];

export function OnboardingPage({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const { registerPatient, activePatient } = useApp();
  const { t, lang } = useI18n();

  const [role, setRole] = useState<PatientRole>("self");
  const [name, setName] = useState("");
  const [sex, setSex] = useState<"Male" | "Female" | "Other">("Female");
  const [age, setAge] = useState(68);
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("Assam");
  const [district, setDistrict] = useState(NE_DISTRICTS.Assam[0]);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [patientPhoto, setPatientPhoto] = useState("");
  
  // Multiple family members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "fam-1", name: "", relation: "Son", photo: "", phone: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegionChange = (next: string) => {
    setRegion(next);
    setDistrict(NE_DISTRICTS[next]?.[0] || "");
  };

  const readPhoto = (file: File, callback: (value: string) => void) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const max = 360;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      callback(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.src = url;
  };

  const addFamilyMember = () => {
    setFamilyMembers((prev) => [
      ...prev,
      {
        id: `fam-${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: "",
        relation: prev.length === 1 ? "Daughter" : "Spouse",
        photo: "",
        phone: "",
      },
    ]);
  };

  const removeFamilyMember = (id: string) => {
    if (familyMembers.length <= 1) return;
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the person’s full name.");
      return;
    }
    if (!patientPhoto) {
      setError("Please add a clear patient photo.");
      return;
    }

    const hasFamilyPhoto = familyMembers.some((m) => m.photo && m.photo.trim().length > 0);
    if (!hasFamilyPhoto) {
      setError("Please add a photo for at least one family member or relative.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const primaryFam = familyMembers[0];
      await registerPatient({
        name: name.trim(),
        sex,
        age: Number(age) || 65,
        phone: phone.trim() || "+91 9800000000",
        language: lang,
        region,
        district,
        caregiver_name: primaryFam?.name || undefined,
        caregiver_phone: primaryFam?.phone || undefined,
        patient_photo: patientPhoto,
        caregiver_photo: primaryFam?.photo || undefined,
        family_members: familyMembers,
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
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <SiteHeader simple onLogoClick={onBack} onStart={onBack} ctaLabel={t("common.back")} />

      <main className="mx-auto max-w-3xl flex-1 px-4 py-8 sm:py-12 sm:px-6 w-full">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("onboarding.back")}
        </button>

        <div className="mt-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <img src="/logo.png" alt="SmritiMitra logo" className="h-full w-full object-contain p-1" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-foreground">SmritiMitra</p>
              <p className="text-xs text-muted-foreground"> Bringing Joy to the Golden Years..</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-primary">
            {t("onboarding.tag")}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("onboarding.title")}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {t("onboarding.subtitle")}
          </p>
        </div>

        {/* Warm Relatable Elder Banner */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-4 rounded-3xl border border-border/80 bg-gradient-to-r from-primary/10 via-card to-background p-4 sm:p-5 shadow-xs">
          <img
            src="/images/elder_grandfather_assam.jpg"
            alt="Elder from North East India"
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover object-top shadow-sm ring-2 ring-primary/20 shrink-0"
          />
          <div className="text-left space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              🌱 Made for North Eastern Elders
            </span>
            <p className="text-xs sm:text-sm font-bold text-foreground">
              "Care that speaks our mother tongue and respects our memories."
            </p>
            <p className="text-[11px] text-muted-foreground">
              Personalized for seniors across Assam, Meghalaya, Sikkim, Nagaland, and all 8 North East states.
            </p>
          </div>
        </div>

        {activePatient && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-950 dark:text-emerald-200">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Active Patient Profile Found
              </p>
              <p className="text-sm font-semibold mt-0.5">
                {activePatient.name} ({activePatient.age}y, {activePatient.region})
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                You are already onboarded. You can resume activity or register an additional patient below.
              </p>
            </div>
            <Button
              type="button"
              onClick={onComplete}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0"
            >
              Resume Dashboard →
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-6 rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-soft">
          <fieldset>
            <legend className="text-xs sm:text-sm font-bold text-foreground">
              {t("onboarding.roleLegend")}
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["self", t("onboarding.roleSelf")],
                  ["caregiver", t("onboarding.roleCaregiver")],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-xs sm:text-sm transition-all ${role === value ? "border-primary bg-primary/10 font-bold text-foreground ring-1 ring-primary" : "border-border text-muted-foreground hover:bg-muted/50"
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

          {/* Basic Patient Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs sm:text-sm font-medium text-foreground">
              {t("onboarding.name")}
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("onboarding.namePlaceholder")}
                className={`${fieldClass} mt-1.5`}
              />
            </label>
            <label className="block text-xs sm:text-sm font-medium text-foreground">
              {t("onboarding.sex")}
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as typeof sex)}
                className={`${fieldClass} mt-1.5`}
              >
                <option value="Female">{t("onboarding.sexFemale")}</option>
                <option value="Male">{t("onboarding.sexMale")}</option>
                <option value="Other">{t("onboarding.sexOther")}</option>
              </select>
            </label>
            <label className="block text-xs sm:text-sm font-medium text-foreground">
              {t("onboarding.age")}
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
            <label className="block text-xs sm:text-sm font-medium text-foreground">
              {t("onboarding.phone")}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98000 00000"
                className={`${fieldClass} mt-1.5`}
              />
            </label>
            <label className="block text-xs sm:text-sm font-medium text-foreground">
              {t("onboarding.state")}
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className={`${fieldClass} mt-1.5`}
              >
                {Object.keys(NE_DISTRICTS).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs sm:text-sm font-medium text-foreground">
              {t("onboarding.district")}
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`${fieldClass} mt-1.5`}
              >
                {(NE_DISTRICTS[region] || []).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Patient Photo Section */}
          <div className="border-t border-border pt-5">
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              Patient Photo *
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Upload a clear facial photo of the senior for recognition & identity.
            </p>

            <label className="mt-3 block cursor-pointer rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 transition-colors hover:bg-primary/10">
              <div className="flex items-center gap-4">
                {patientPhoto ? (
                  <img src={patientPhoto} alt="Patient preview" className="h-16 w-16 rounded-2xl object-cover shadow-sm ring-2 ring-primary/30" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card text-muted-foreground border border-border">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {patientPhoto ? "Change patient photo" : "Click to select patient photo"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    JPG or PNG format · Clear front portrait recommended
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) readPhoto(file, setPatientPhoto);
                }}
                className="sr-only"
              />
            </label>
          </div>

          {/* Multiple Family Members & Caregivers Section */}
          <div className="border-t border-border pt-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Family Members & Loved Ones (Multiple Photos Allowed) *
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Upload photos and relationships (e.g. Son, Daughter, Spouse, Grandchild) so the senior can practice face recognition in games.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFamilyMember}
                className="rounded-full text-xs font-bold gap-1.5 border-primary/40 text-primary hover:bg-primary/10 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Family Member
              </Button>
            </div>

            <div className="space-y-4">
              {familyMembers.map((member, idx) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-border/90 bg-muted/30 p-4 transition-all hover:border-primary/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                      <UserCheck className="h-3 w-3" />
                      Family Member #{idx + 1}
                    </span>
                    {familyMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFamilyMember(member.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
                        title="Remove family member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="block text-xs font-semibold text-foreground">
                      Relationship *
                      <select
                        value={member.relation}
                        onChange={(e) => updateFamilyMember(member.id, { relation: e.target.value })}
                        className={`${fieldClass} mt-1 text-xs py-2`}
                      >
                        {RELATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-xs font-semibold text-foreground">
                      Full Name (e.g. Rahul)
                      <input
                        value={member.name}
                        onChange={(e) => updateFamilyMember(member.id, { name: e.target.value })}
                        placeholder="e.g. Son Rahul"
                        className={`${fieldClass} mt-1 text-xs py-2`}
                      />
                    </label>

                    <label className="block text-xs font-semibold text-foreground">
                      Phone Number (Optional)
                      <input
                        type="tel"
                        value={member.phone || ""}
                        onChange={(e) => updateFamilyMember(member.id, { phone: e.target.value })}
                        placeholder="+91 98000 00000"
                        className={`${fieldClass} mt-1 text-xs py-2`}
                      />
                    </label>
                  </div>

                  {/* Photo picker for this family member */}
                  <label className="block cursor-pointer rounded-xl border border-dashed border-primary/40 bg-card p-3 transition-colors hover:bg-primary/5">
                    <div className="flex items-center gap-3">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt="Family member preview"
                          className="h-14 w-14 rounded-xl object-cover shadow-xs ring-2 ring-primary/30 shrink-0"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground shrink-0">
                          <Camera className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground">
                          {member.photo
                            ? `Change photo for ${member.relation} ${member.name ? `(${member.name})` : ""}`
                            : `Upload photo of ${member.relation} *`}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Clear photo of face for social recognition exercises
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) readPhoto(file, (photoData) => updateFamilyMember(member.id, { photo: photoData }));
                      }}
                      className="sr-only"
                    />
                  </label>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addFamilyMember}
              className="w-full rounded-2xl border-dashed border-primary/50 text-xs font-bold text-primary hover:bg-primary/10 py-3 gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Family Member / Relative Photo
            </Button>
          </div>

          <div className="border-t border-border pt-4">
            <label className="block text-xs sm:text-sm font-medium text-foreground">
              {t("onboarding.notes")}
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder={t("onboarding.notesPlaceholder")}
                className={`${fieldClass} mt-1.5`}
              />
            </label>
          </div>

          {error ? <p className="text-xs sm:text-sm font-medium text-destructive">{error}</p> : null}

          <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {t("onboarding.savedLocally")}
            </p>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-full px-6 font-bold shadow-soft hover:shadow-lift transition-all"
            >
              <span>{isSubmitting ? t("onboarding.submitting") : t("onboarding.submit")}</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </form>
      </main>

      <SiteFooter onStart={onBack} />
    </div>
  );
}


