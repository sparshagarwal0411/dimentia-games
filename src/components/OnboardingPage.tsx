import { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, Camera, Plus, Trash2, Users, UserPlus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, type PatientRole, type FamilyMember } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import { NE_DISTRICTS } from "@/lib/regions";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-3 py-3 text-sm text-foreground outline-none ring-offset-background transition-all focus:ring-2 focus:ring-ring";

const RELATION_PRESETS = [
  "Daughter",
  "Son",
  "Spouse",
  "Primary Caregiver",
  "Grandchild",
  "Sister",
  "Brother",
  "Friend / Relative",
  "Other",
] as const;

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
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverPhone, setCaregiverPhone] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [patientPhoto, setPatientPhoto] = useState("");

  // Multiple Family Members state
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Draft form for adding family member
  const [famName, setFamName] = useState("");
  const [famRelation, setFamRelation] = useState<string>("Daughter");
  const [famCustomRelation, setFamCustomRelation] = useState("");
  const [famPhoto, setFamPhoto] = useState("");
  const [famPhone, setFamPhone] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegionChange = (next: string) => {
    setRegion(next);
    setDistrict(NE_DISTRICTS[next]?.[0] || "");
  };

  const readPhoto = (file: File, setPhoto: (value: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };

  const handleAddFamilyMember = () => {
    if (!famPhoto) {
      setError("Please select/upload a photo for the family member.");
      return;
    }
    const actualRelation = famRelation === "Other" ? (famCustomRelation.trim() || "Family Member") : famRelation;
    const memberName = famName.trim() || actualRelation;

    const newMember: FamilyMember = {
      id: `fam_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: memberName,
      relation: actualRelation,
      photo: famPhoto,
      phone: famPhone.trim() || undefined,
    };

    setFamilyMembers((prev) => [...prev, newMember]);
    // Set caregiver name/phone if empty
    if (!caregiverName && memberName) setCaregiverName(memberName);
    if (!caregiverPhone && famPhone) setCaregiverPhone(famPhone);

    // Reset draft form
    setFamName("");
    setFamRelation("Daughter");
    setFamCustomRelation("");
    setFamPhoto("");
    setFamPhone("");
    setError(null);
  };

  const handleRemoveFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the person’s full name.");
      return;
    }

    let finalFamilyMembers = [...familyMembers];

    // If draft photo is pending, auto-add it
    if (famPhoto) {
      const actualRelation = famRelation === "Other" ? (famCustomRelation.trim() || "Family Member") : famRelation;
      const memberName = famName.trim() || actualRelation;
      const autoMember: FamilyMember = {
        id: `fam_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: memberName,
        relation: actualRelation,
        photo: famPhoto,
        phone: famPhone.trim() || undefined,
      };
      finalFamilyMembers.push(autoMember);
    }

    if (!patientPhoto) {
      setError("Please upload a photo of the patient.");
      return;
    }

    if (finalFamilyMembers.length === 0) {
      setError("Please add at least one family member photo along with their relation/name.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const primaryCaregiver = finalFamilyMembers[0];
    const caregiverPhotoUrl = primaryCaregiver?.photo || "";
    const caregiverFullName = caregiverName.trim() || primaryCaregiver?.name || "";
    const caregiverPhoneNum = caregiverPhone.trim() || primaryCaregiver?.phone || "";

    try {
      await registerPatient({
        name: name.trim(),
        sex,
        age: Number(age) || 65,
        phone: phone.trim() || "+91 9800000000",
        language: lang,
        region,
        district,
        caregiver_name: caregiverFullName || undefined,
        caregiver_phone: caregiverPhoneNum || undefined,
        patient_photo: patientPhoto,
        caregiver_photo: caregiverPhotoUrl,
        family_members: finalFamilyMembers,
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
            <img src="/logo.png" alt="SmritiMitra logo" className="h-14 w-14 rounded-2xl object-cover shadow-soft" />
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
          <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-5">
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" /> Patient Photo *
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload a clear face photo of the patient for identification and cognitive recognition games.
            </p>
            <label className="mt-3 flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 transition-colors hover:bg-primary/10">
              {patientPhoto ? (
                <img src={patientPhoto} alt="Patient preview" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/30" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-border text-muted-foreground">
                  <Camera className="h-7 w-7 text-primary" />
                </div>
              )}
              <div>
                <p className="text-xs sm:text-sm font-bold text-foreground">
                  {patientPhoto ? "Change Patient Photo" : "Upload Patient Photo"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Click to choose image file (JPG, PNG)</p>
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

          {/* Multiple Family Members Section */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Family Members & Caregivers *
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload photos and relationships of family members (e.g. Son, Daughter, Spouse, Caregiver). You can add multiple family members.
                </p>
              </div>
              {familyMembers.length > 0 && (
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {familyMembers.length} Added
                </span>
              )}
            </div>

            {/* List of added family members */}
            {familyMembers.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="relative flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs hover:border-primary/40 transition-colors"
                  >
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-14 w-14 rounded-xl object-cover ring-2 ring-primary/20 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground truncate">{member.name}</p>
                      <span className="inline-block mt-0.5 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                        {member.relation}
                      </span>
                      {member.phone && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">{member.phone}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFamilyMember(member.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                      title="Remove family member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Form to add a new family member */}
            <div className="mt-3 rounded-2xl border border-dashed border-border bg-card p-4 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <UserPlus className="h-3.5 w-3.5" /> Add Family Member Details
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="cursor-pointer rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3 flex items-center gap-3 hover:bg-primary/10 transition-colors">
                  {famPhoto ? (
                    <img src={famPhoto} alt="Family member preview" className="h-14 w-14 rounded-xl object-cover shrink-0 ring-2 ring-primary/30" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-card border border-border text-muted-foreground shrink-0">
                      <Camera className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {famPhoto ? "Change Photo" : "Upload Photo *"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Family member face image</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) readPhoto(file, setFamPhoto);
                    }}
                    className="sr-only"
                  />
                </label>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Relationship to Patient *
                  </label>
                  <select
                    value={famRelation}
                    onChange={(e) => setFamRelation(e.target.value)}
                    className={fieldClass}
                  >
                    {RELATION_PRESETS.map((rel) => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>
              </div>

              {famRelation === "Other" && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Specify Custom Relationship
                  </label>
                  <input
                    type="text"
                    value={famCustomRelation}
                    onChange={(e) => setFamCustomRelation(e.target.value)}
                    placeholder="e.g. Uncle, Neighbor, Guardian..."
                    className={fieldClass}
                  />
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={famName}
                    onChange={(e) => setFamName(e.target.value)}
                    placeholder="e.g., Priyam Sharma"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={famPhone}
                    onChange={(e) => setFamPhone(e.target.value)}
                    placeholder="+91 94350 00000"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  onClick={handleAddFamilyMember}
                  variant="outline"
                  className="rounded-full text-xs font-bold border-primary/40 text-primary hover:bg-primary hover:text-white transition-all gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add This Family Member
                </Button>
              </div>
            </div>
          </div>

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


