import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "as", label: "Assamese", native: "অসমীয়া" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

const en: Dict = {
  "app.name": "Cognitive Care",
  "nav.home": "Home",
  "nav.play": "Play",
  "nav.day": "My Day",
  "nav.talk": "Talk",
  "nav.family": "Family",
  "nav.profile": "Profile",
  "greeting.morning": "Good morning",
  "greeting.afternoon": "Good afternoon",
  "greeting.evening": "Good evening",
  "home.feeling": "How are you feeling today?",
  "home.activities": "Today's activities",
  "home.play": "Play games",
  "home.reminders": "My reminders",
  "home.day": "My day",
  "home.talk": "Talk to me",
  "home.familyChallenge": "Family challenge",
  "home.todaysChallenge": "Today's challenge",
  "common.back": "Back",
  "common.home": "Home",
  "common.start": "Start",
  "common.next": "Next",
  "common.done": "Done",
  "common.yes": "Yes",
  "common.again": "Play again",
  "common.wellDone": "Well done!",
  "common.thankYou": "Thank you",
  "a11y.title": "Accessibility",
  "a11y.read": "Read screen aloud",
  "a11y.text": "Increase text size",
  "a11y.contrast": "High contrast",
  "a11y.buttons": "Large buttons",
  "a11y.voice": "Voice guidance",
  "a11y.slow": "Slow interaction mode",
  "a11y.sounds": "Reduce sounds",
  "a11y.theme": "Light / dark mode",
  "a11y.simplify": "Simplify screen",
  "games.title": "Choose a game",
  "reminders.title": "My reminders",
  "reminders.taken": "Taken",
  "day.title": "My day",
  "talk.title": "Talk to me",
  "talk.ask": "Tap and ask me anything",
  "offline.pending": "activities waiting to sync",
  "offline.synced": "All activities synchronized",
  "offline.offline": "You are offline — everything still works",
};

const hi: Dict = {
  "app.name": "कॉग्निटिव केयर",
  "nav.home": "होम",
  "nav.play": "खेलें",
  "nav.day": "मेरा दिन",
  "nav.talk": "बात करें",
  "nav.family": "परिवार",
  "nav.profile": "प्रोफ़ाइल",
  "greeting.morning": "सुप्रभात",
  "greeting.afternoon": "नमस्कार",
  "greeting.evening": "शुभ संध्या",
  "home.feeling": "आज आप कैसा महसूस कर रहे हैं?",
  "home.activities": "आज की गतिविधियाँ",
  "home.play": "खेल खेलें",
  "home.reminders": "मेरी याददिलाहट",
  "home.day": "मेरा दिन",
  "home.talk": "मुझसे बात करें",
  "home.familyChallenge": "परिवार चुनौती",
  "home.todaysChallenge": "आज की चुनौती",
  "common.back": "वापस",
  "common.home": "होम",
  "common.start": "शुरू करें",
  "common.next": "आगे",
  "common.done": "पूरा",
  "common.yes": "हाँ",
  "common.again": "फिर खेलें",
  "common.wellDone": "बहुत बढ़िया!",
  "common.thankYou": "धन्यवाद",
  "a11y.title": "सुगमता",
  "a11y.read": "स्क्रीन पढ़कर सुनाएँ",
  "a11y.text": "अक्षर बड़े करें",
  "a11y.contrast": "अधिक कंट्रास्ट",
  "a11y.buttons": "बड़े बटन",
  "a11y.voice": "आवाज़ मार्गदर्शन",
  "a11y.slow": "धीमा मोड",
  "a11y.sounds": "आवाज़ कम करें",
  "a11y.theme": "हल्का / गहरा",
  "a11y.simplify": "स्क्रीन आसान करें",
  "games.title": "एक खेल चुनें",
  "reminders.title": "मेरी याददिलाहट",
  "reminders.taken": "हो गया",
  "day.title": "मेरा दिन",
  "talk.title": "मुझसे बात करें",
  "talk.ask": "दबाकर कुछ भी पूछें",
  "offline.pending": "गतिविधियाँ सिंक होने की प्रतीक्षा में",
  "offline.synced": "सभी गतिविधियाँ सिंक हो गईं",
  "offline.offline": "आप ऑफ़लाइन हैं — सब कुछ चलता रहेगा",
};

const as: Dict = {
  "app.name": "কগনিটিভ কেয়াৰ",
  "nav.home": "ঘৰ",
  "nav.play": "খেলা",
  "nav.day": "মোৰ দিন",
  "nav.talk": "কথা পাতক",
  "nav.family": "পৰিবাৰ",
  "nav.profile": "প্ৰফাইল",
  "greeting.morning": "শুভ প্ৰভাত",
  "greeting.afternoon": "নমস্কাৰ",
  "greeting.evening": "শুভ সন্ধিয়া",
  "home.feeling": "আজি আপুনি কেনে অনুভৱ কৰিছে?",
  "home.activities": "আজিৰ কাম",
  "home.play": "খেল খেলক",
  "home.reminders": "মোৰ মনত পেলোৱা",
  "home.day": "মোৰ দিন",
  "home.talk": "মোৰ সৈতে কথা পাতক",
  "home.familyChallenge": "পৰিবাৰৰ প্ৰতিযোগিতা",
  "home.todaysChallenge": "আজিৰ প্ৰতিযোগিতা",
  "common.back": "পিছলৈ",
  "common.home": "ঘৰ",
  "common.start": "আৰম্ভ",
  "common.next": "পৰৱৰ্তী",
  "common.done": "হ'ল",
  "common.yes": "হয়",
  "common.again": "আকৌ খেলক",
  "common.wellDone": "বৰ ভাল!",
  "common.thankYou": "ধন্যবাদ",
  "a11y.title": "সুগমতা",
  "a11y.read": "পৰ্দা পঢ়ি শুনাওক",
  "a11y.text": "আখৰ ডাঙৰ কৰক",
  "a11y.contrast": "বেছি কণ্ট্ৰাস্ট",
  "a11y.buttons": "ডাঙৰ বাটন",
  "a11y.voice": "কণ্ঠ সহায়",
  "a11y.slow": "লেহেমীয়া ধৰণ",
  "a11y.sounds": "শব্দ কমাওক",
  "a11y.theme": "পোহৰ / আন্ধাৰ",
  "a11y.simplify": "পৰ্দা সহজ কৰক",
  "games.title": "এখন খেল বাছনি কৰক",
  "reminders.title": "মোৰ মনত পেলোৱা",
  "reminders.taken": "লোৱা হ'ল",
  "day.title": "মোৰ দিন",
  "talk.title": "মোৰ সৈতে কথা পাতক",
  "talk.ask": "টিপি যিকোনো সুধিব",
  "offline.pending": "কাম সিংক হ'বলৈ বাকী",
  "offline.synced": "সকলো কাম সিংক হ'ল",
  "offline.offline": "আপুনি অফলাইন — সকলো চলি থাকিব",
};

const DICTS: Record<LanguageCode, Dict> = { en, hi, as };

export const SPEECH_LOCALES: Record<LanguageCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  as: "as-IN",
};

type I18nValue = {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: string) => string;
  locale: string;
};

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "cc.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && stored in DICTS) setLangState(stored);
  }, []);

  const setLang = useCallback((next: LanguageCode) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback((key: string) => DICTS[lang][key] ?? en[key] ?? key, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, locale: SPEECH_LOCALES[lang] }),
    [lang, setLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
