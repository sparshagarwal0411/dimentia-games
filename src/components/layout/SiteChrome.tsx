import {
  Accessibility,
  Brain,
  HeartPulse,
  Shield,
  FileText,
  PhoneCall,
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Pencil,
  UserPlus,
  Camera,
  ChevronDown,
  Languages,
  Plus,
  Trash2,
  Users,
  UserCheck,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useApp, type FamilyMember } from "@/lib/app-state";
import { useI18n, LANGUAGES } from "@/lib/i18n";
import { LegalModal, type LegalTab } from "@/components/LegalModal";
import { soundEffects } from "@/lib/audio-effects";
import { PatientRegistrationModal } from "@/components/PatientRegistrationModal";

export function SiteHeader({
  onStart,
  onLogoClick,
  ctaLabel,
  simple = false,
  subtitle,
  navigation,
}: {
  onStart?: () => void;
  onLogoClick?: () => void;
  ctaLabel?: string;
  simple?: boolean;
  subtitle?: string;
  navigation?: ReactNode;
}) {
  const { openA11yPanel, session, activePatient, signOut } = useApp();
  const { lang, setLang, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName = activePatient?.name || session?.user?.user_metadata?.["full_name"] || session?.user?.email || "";
  const initials = userName
    ? userName
      .split(" ")
      .slice(0, 2)
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
    : "";

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    soundEffects.playClick();
    setMobileMenuOpen(false);
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    } else if (window.location.pathname !== "/") {
      window.location.assign(`/#${targetId}`);
    } else {
      window.location.hash = targetId;
    }
  };

  const handleStart = () => {
    soundEffects.playSuccess();
    setMobileMenuOpen(false);
    onStart?.();
  };

  const resolvedCta = ctaLabel || (activePatient || session ? t("nav.resume") : t("nav.start"));
  const shortCta = ctaLabel || (activePatient || session ? t("nav.resumeShort") : t("nav.startShort"));

  return (
    <header className="glass-surface sticky top-0 z-40 overflow-x-clip border-b transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl min-w-0 items-center gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-2.5">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setMobileMenuOpen(false);
            if (onLogoClick) {
              onLogoClick();
            } else {
              window.location.assign("/");
            }
          }}
          className={`flex min-w-0 items-center gap-2 text-left group ${navigation ? "shrink-0 sm:flex-none" : "flex-1 sm:flex-none"} sm:gap-3`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
            <img src="/logo.png" alt="" className="h-full w-full object-contain p-0.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className={`font-display truncate text-[15px] font-bold leading-none text-foreground sm:text-lg ${navigation ? "hidden sm:inline" : ""}`}>
                {t("app.name")}
              </p>
              <span className="hidden rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary sm:inline">
                {t("app.badge")}
              </span>
            </div>
            <p className="mt-0.5 hidden truncate text-[11px] font-medium tracking-wide text-muted-foreground md:block">
              {subtitle || t("app.tagline")}
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        {!simple && (
          <nav className="hidden flex-1 items-center justify-center gap-5 text-sm font-semibold text-muted-foreground lg:flex">
            <a
              href="#interactive-demo"
              onClick={(e) => handleNavClick(e, "interactive-demo")}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.demo")}
            </a>
            <a
              href="#regional-culture"
              onClick={(e) => handleNavClick(e, "regional-culture")}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.states")}
            </a>
            <a
              href="#how-we-monitor"
              onClick={(e) => handleNavClick(e, "how-we-monitor")}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.privacy")}
            </a>
            <a
              href="#reviews"
              onClick={(e) => handleNavClick(e, "reviews")}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.stories")}
            </a>
          </nav>
        )}

        {navigation ? (
          <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navigation}
          </div>
        ) : null}

        {/* Action Controls */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <label className={`relative inline-flex items-center ${navigation ? "hidden md:inline-flex" : ""}`}>
            <Languages className="pointer-events-none absolute left-2.5 hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            <select
              value={lang}
              onChange={(e) => {
                soundEffects.playClick();
                setLang(e.target.value as typeof lang);
              }}
              className="h-8 w-[3.35rem] appearance-none rounded-full border border-border/80 bg-muted/50 px-2 text-center text-[11px] font-bold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50 sm:h-9 sm:w-auto sm:pl-7 sm:pr-6 sm:text-left sm:text-xs"
              aria-label="Select language"
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          {(session || activePatient) ? (
            <AvatarMenu
              initials={initials}
              userName={userName}
              photo={activePatient?.patient_photo}
              activePatient={activePatient}
              onDashboard={handleStart}
              onA11y={() => { soundEffects.playClick(); openA11yPanel(); }}
              onSignOut={() => void signOut()}
              hasSession={!!session}
            />
          ) : onStart ? (
            <Button
              onClick={handleStart}
              size="sm"
              className="h-8 rounded-full px-3 font-bold shadow-soft transition-all hover:shadow-lift sm:h-9 sm:px-5"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 sm:mr-1" />
              <span className="text-xs sm:hidden">{shortCta}</span>
              <span className="hidden text-sm sm:inline">{resolvedCta}</span>
            </Button>
          ) : null}

          {!simple && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setMobileMenuOpen((prev) => !prev);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-colors hover:bg-muted lg:hidden sm:h-9 sm:w-9"
              aria-label={mobileMenuOpen ? t("nav.close") : t("nav.menu")}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {!simple && mobileMenuOpen && (
        <div className="glass-surface lg:hidden border-t px-4 py-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-foreground">
            <a
              href="#interactive-demo"
              onClick={(e) => handleNavClick(e, "interactive-demo")}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.demo")}</span>
              <span className="text-xs text-primary font-bold">Try Now →</span>
            </a>
            <a
              href="#regional-culture"
              onClick={(e) => handleNavClick(e, "regional-culture")}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.states")}</span>
              <span className="text-xs text-muted-foreground">NE Culture</span>
            </a>
            <a
              href="#how-we-monitor"
              onClick={(e) => handleNavClick(e, "how-we-monitor")}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.privacy")}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">100% Offline</span>
            </a>
            <a
              href="#reviews"
              onClick={(e) => handleNavClick(e, "reviews")}
              className="flex items-center justify-between rounded-xl p-2.5 hover:bg-muted/70 transition-colors"
            >
              <span>{t("nav.stories")}</span>
              <span className="text-xs text-muted-foreground">Clinics & Families</span>
            </a>
          </nav>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                openA11yPanel();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary py-1 px-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Accessibility className="h-4 w-4" />
              <span>{t("a11y.title")}</span>
            </button>
            <span className="text-[11px] text-muted-foreground">{t("app.tagline")}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
            <span className="mr-1 text-xs font-semibold text-muted-foreground">Language</span>
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setLang(item.code);
                }}
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all ${lang === item.code
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                title={item.native}
                aria-label={`Switch to ${item.label}`}
              >
                {item.native}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Avatar Dropdown Component ────────────────────────────────────────────────
function AvatarMenu({
  initials,
  userName,
  photo,
  activePatient,
  onDashboard,
  onA11y,
  onSignOut,
  hasSession,
}: {
  initials: string;
  userName: string;
  photo?: string | undefined;
  activePatient: ReturnType<typeof useApp>["activePatient"];
  onDashboard?: () => void;
  onA11y?: () => void;
  onSignOut?: () => void;
  hasSession?: boolean;
}) {
  const { updatePatient, signOut } = useApp();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(activePatient?.name || "");
  const [age, setAge] = useState(activePatient?.age || 68);
  const [phone, setPhone] = useState(activePatient?.phone || "");
  const [patientPhoto, setPatientPhoto] = useState(activePatient?.patient_photo || "");
  
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    activePatient?.family_members && activePatient.family_members.length > 0
      ? activePatient.family_members
      : activePatient?.caregiver_name || activePatient?.caregiver_photo
      ? [{ id: "fam-1", name: activePatient.caregiver_name || "", relation: "Caregiver", photo: activePatient.caregiver_photo || "", phone: activePatient.caregiver_phone || "" }]
      : [{ id: "fam-1", name: "", relation: "Son", photo: "", phone: "" }]
  );

  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    setName(activePatient?.name || "");
    setAge(activePatient?.age || 68);
    setPhone(activePatient?.phone || "");
    setPatientPhoto(activePatient?.patient_photo || "");
    if (activePatient?.family_members && activePatient.family_members.length > 0) {
      setFamilyMembers(activePatient.family_members);
    } else if (activePatient?.caregiver_name || activePatient?.caregiver_photo) {
      setFamilyMembers([
        {
          id: "fam-1",
          name: activePatient.caregiver_name || "",
          relation: "Caregiver",
          photo: activePatient.caregiver_photo || "",
          phone: activePatient.caregiver_phone || "",
        },
      ]);
    } else {
      setFamilyMembers([{ id: "fam-1", name: "", relation: "Son", photo: "", phone: "" }]);
    }
  }, [activePatient]);

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

  const handleLogout = async () => {
    setOpen(false);
    if (onSignOut) {
      onSignOut();
    } else {
      await signOut();
    }
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activePatient || !name.trim()) return;
    setSaving(true);
    const primaryFam = familyMembers[0];
    await updatePatient(activePatient.id, {
      name: name.trim(),
      age: Number(age) || activePatient.age,
      phone: phone.trim(),
      patient_photo: patientPhoto,
      caregiver_name: primaryFam?.name || "",
      caregiver_phone: primaryFam?.phone || "",
      caregiver_photo: primaryFam?.photo || "",
      family_members: familyMembers,
    });
    setSaving(false);
    setEditOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2 py-1 shadow-sm hover:bg-muted transition-all"
        aria-label="Profile menu"
      >
        <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-primary text-[11px] font-bold text-primary-foreground shrink-0">
          {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : initials || <User className="h-3.5 w-3.5" />}
        </span>
        <span className="hidden sm:inline max-w-[90px] truncate text-xs font-semibold text-foreground">
          {userName.split(" ")[0]}
        </span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="glass-surface absolute right-0 top-full mt-2 w-64 rounded-2xl border z-50 overflow-hidden shadow-lift animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="border-b border-border px-4 py-3 bg-muted/20">
            <p className="text-xs font-bold text-foreground truncate">{userName || "Patient"}</p>
            <p className="text-[11px] text-muted-foreground">SmritiMitra Account</p>
          </div>

          <div className="py-1.5">
            <button
              type="button"
              onClick={() => { setOpen(false); onDashboard?.(); }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Brain className="h-4 w-4 text-primary" />
              Go to Dashboard
            </button>
            {activePatient && (
              <button
                type="button"
                onClick={() => { setOpen(false); setEditOpen(true); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <User className="h-4 w-4 text-primary" />
                Edit Patient & Family Profile
              </button>
            )}
            {activePatient && (
              <button
                type="button"
                onClick={() => { setOpen(false); setAddMemberOpen(true); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <UserPlus className="h-4 w-4 text-primary" />
                Add New Patient Profile
              </button>
            )}
            <button
              type="button"
              onClick={() => { setOpen(false); onA11y?.(); }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings & Accessibility
            </button>
          </div>

          <div className="border-t border-border py-1.5 bg-rose-500/5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Log Out / Switch Account
            </button>
          </div>
        </div>
      )}

      {editOpen && activePatient && createPortal(
        <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <form
            onSubmit={saveProfile}
            className="relative my-0 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-lift sm:my-8 sm:rounded-3xl sm:p-6"
          >
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close profile"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="pr-8 text-xl font-bold text-foreground">Edit Patient & Family Profile</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Update senior details and manage family member photos & relations.
            </p>

            <div className="mt-5 space-y-4">
              {/* Patient Basic Fields */}
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-xs font-semibold text-foreground sm:col-span-2">
                  Patient Full Name *
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </label>
                <label className="text-xs font-semibold text-foreground">
                  Age
                  <input
                    type="number"
                    min={40}
                    max={110}
                    value={age}
                    onChange={(event) => setAge(Number(event.target.value))}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="text-xs font-semibold text-foreground sm:col-span-3">
                  Patient Phone Number
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              </div>

              {/* Patient Photo Upload */}
              <div className="border-t border-border pt-4">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-primary" />
                  Patient Portrait Photo
                </p>
                <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3 transition-colors hover:bg-primary/10">
                  <div className="flex items-center gap-3">
                    {patientPhoto ? (
                      <img src={patientPhoto} alt="Patient preview" className="h-14 w-14 rounded-xl object-cover ring-2 ring-primary/30" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-card text-muted-foreground border">
                        <Camera className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {patientPhoto ? "Change patient photo" : "Upload patient photo"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Clear front face portrait</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) readPhoto(file, setPatientPhoto);
                    }}
                    className="sr-only"
                  />
                </label>
              </div>

              {/* Family Members Section */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      Family Members & Relations ({familyMembers.length})
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Photos and relations used in recognition games and care logs
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFamilyMember}
                    className="rounded-full text-xs font-bold gap-1 text-primary border-primary/30"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Member
                  </Button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {familyMembers.map((member, idx) => (
                    <div key={member.id} className="rounded-2xl border border-border bg-muted/20 p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full text-[10px]">
                          <UserCheck className="h-3 w-3" />
                          Family Member #{idx + 1}
                        </span>
                        {familyMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFamilyMember(member.id)}
                            className="text-destructive font-medium hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        <label className="font-semibold text-foreground">
                          Relation
                          <select
                            value={member.relation}
                            onChange={(e) => updateFamilyMember(member.id, { relation: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none"
                          >
                            {RELATION_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </label>
                        <label className="font-semibold text-foreground">
                          Full Name
                          <input
                            value={member.name}
                            onChange={(e) => updateFamilyMember(member.id, { name: e.target.value })}
                            placeholder="e.g. Son Rahul"
                            className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none"
                          />
                        </label>
                        <label className="font-semibold text-foreground">
                          Phone Number
                          <input
                            type="tel"
                            value={member.phone || ""}
                            onChange={(e) => updateFamilyMember(member.id, { phone: e.target.value })}
                            placeholder="+91 98000 00000"
                            className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none"
                          />
                        </label>
                      </div>

                      <label className="block cursor-pointer rounded-xl border border-dashed border-primary/30 bg-card p-2 hover:bg-primary/5 transition-colors">
                        <div className="flex items-center gap-2">
                          {member.photo ? (
                            <img src={member.photo} alt="" className="h-10 w-10 rounded-lg object-cover ring-1 ring-primary/20 shrink-0" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                              <Camera className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[11px] text-foreground">
                              {member.photo ? `Change photo for ${member.relation}` : `Upload photo of ${member.relation}`}
                            </p>
                            <p className="text-[10px] text-muted-foreground">Used in recognition games</p>
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
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-full px-5 font-bold">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {createPortal(
        <PatientRegistrationModal open={addMemberOpen} onClose={() => setAddMemberOpen(false)} />,
        document.body
      )}
    </div>
  );
}

// ─── Site Footer ───────────────────────────────────────────────────────────────
export function SiteFooter({ onStart }: { onStart?: () => void }) {
  const { t } = useI18n();
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>("terms");

  const openLegal = (tab: LegalTab) => {
    soundEffects.playClick();
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <>
      <footer className="glass-surface border-t transition-colors duration-300">
        {/* ── Main Footer Row ── */}
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-soft">
              <img src="/logo.png" alt="" className="h-full w-full object-contain p-0.5" />
            </div>
            <div>
              <p className="font-display text-base font-bold text-foreground leading-tight">{t("app.name")}</p>
              <p className="text-[11px] text-muted-foreground">{t("app.tagline")}</p>
            </div>
          </div>

          {/* Emergency helpline */}
          <div className="flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
              <HeartPulse className="h-3.5 w-3.5" />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-bold text-foreground">Mental Health Helpline</p>
              <p className="text-[10px] text-muted-foreground">Tele-MANAS · 24/7 Free</p>
            </div>
            <a
              href="tel:14416"
              className="ml-2 inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-rose-700 transition-colors shrink-0"
            >
              <PhoneCall className="h-3 w-3" /> 14416
            </a>
          </div>

          {/* Quick legal links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => openLegal("terms")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <FileText className="h-3 w-3" /> Terms
            </button>
            <span aria-hidden className="opacity-40">·</span>
            <button
              type="button"
              onClick={() => openLegal("privacy")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Shield className="h-3 w-3" /> Privacy
            </button>
            <span aria-hidden className="opacity-40">·</span>
            <button
              type="button"
              onClick={() => openLegal("disclaimer")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <HeartPulse className="h-3 w-3" /> Disclaimer
            </button>
          </div>
        </div>

        {/* ── Copyright Bar ── */}
        <div className="border-t border-border/60 px-4 py-3 text-center">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} {t("footer.rights")} · Built for NE India with ❤️
          </p>
        </div>
      </footer>

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalTab}
      />
    </>
  );
}

