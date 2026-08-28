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
  // App brand & Nav
  "app.name": "NeuroTrack NE",
  "app.tagline": "Cognitive Care · North East India",
  "app.badge": "AI",
  "nav.demo": "Live Demo",
  "nav.features": "Care Suite",
  "nav.states": "8 States",
  "nav.privacy": "Privacy & AI",
  "nav.stories": "Stories",
  "nav.home": "Home",
  "nav.play": "Games Hub",
  "nav.day": "My Day",
  "nav.talk": "Talk",
  "nav.family": "Family",
  "nav.profile": "Profile",
  "nav.doctors": "Doctors",
  "nav.dashboard": "Dashboard",
  "nav.signOut": "Sign Out",
  "nav.start": "Start Onboarding",
  "nav.resume": "Open Dashboard",
  "nav.emergency": "Emergency Helplines (14416)",
  "nav.menu": "Menu",
  "nav.close": "Close",

  // Accessibility
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

  // Hero Section
  "hero.badge": "North East India · AI Cognitive Care Platform",
  "hero.title1": "Early Detection &",
  "hero.titleGradient": "Loving Care",
  "hero.title2": "for Every Mind in the North East.",
  "hero.subhead": "Culturally sensitive, voice-guided cognitive screening and memory gym tailored in Assamese, Hindi, and English for families across all 8 North Eastern states.",
  "hero.ctaPrimary": "Start 5-Min Screening",
  "hero.ctaResume": "Resume Active Session",
  "hero.ctaDemo": "Try Interactive Demo",
  "hero.readAloud": "Hear Introduction",
  "hero.metric1Value": "100%",
  "hero.metric1Label": "Offline Ready & Private",
  "hero.metric2Value": "8 States",
  "hero.metric2Label": "Culturally Localized",
  "hero.metric3Value": "3-in-1",
  "hero.metric3Label": "Triple Biomarker Screen",

  // Features & Carousel
  "features.tag": "Clinical Foundation",
  "features.title": "Triple-Biomarker Early Screening Suite",
  "features.subtitle": "Combines non-invasive cognitive tests, speech acoustic patterns, and passive behavioral markers without medical intimidation.",
  "triad.cogTitle": "1. Cognitive Triad",
  "triad.cogDesc": "Memory cards, spatial clock orientation, and culturally relevant pattern identification.",
  "triad.speechTitle": "2. Speech & Acoustics",
  "triad.speechDesc": "Voice cadence analysis, pause distribution, and semantic phrase repetition in regional dialects.",
  "triad.behTitle": "3. Behavioral Telemetry",
  "triad.behDesc": "Tremor detection, typing speed variance, circadian rhythms, and app interaction fluidity.",

  // 8 States Section
  "states.tag": "8 North Eastern States",
  "states.title": "Culturally Rooted in Every Hill & Valley",
  "states.subtitle": "Designed with familiar imagery—from Assam tea gardens and Meghalaya root bridges to Loktak lake and Hornbill traditions.",

  // Auth / Login
  "auth.portalBadge": "Secure Clinical Portal",
  "auth.title": "Sign in to NeuroTrack NE",
  "auth.subtitle": "Securely manage patient records, cognitive assessments, and care data across North East India.",
  "auth.bullet1": "Clinical patient records synced securely across nodes",
  "auth.bullet2": "End-to-end encrypted, DPDP Act 2023 aligned storage",
  "auth.bullet3": "Multi-caregiver access across all 8 NE states",
  "auth.buttonGoogle": "Continue with Google",
  "auth.buttonRedirecting": "Redirecting to Google…",
  "auth.backHome": "← Back to home page",
  "auth.privacyFooter": "Patient data stays securely on-device when offline and syncs automatically upon reconnection.",

  // Onboarding
  "onboarding.tag": "Patient Onboarding",
  "onboarding.title": "Create a Patient Profile",
  "onboarding.subtitle": "Add basic details first. Next you will see the personalized dashboard. Cognitive screening can be started anytime.",
  "onboarding.back": "Back to home page",
  "onboarding.roleLegend": "I am completing this form as",
  "onboarding.roleSelf": "The person being screened",
  "onboarding.roleCaregiver": "A family member or caregiver",
  "onboarding.name": "Full name",
  "onboarding.namePlaceholder": "e.g., Ananya Bora",
  "onboarding.sex": "Sex",
  "onboarding.sexFemale": "Female",
  "onboarding.sexMale": "Male",
  "onboarding.sexOther": "Other",
  "onboarding.age": "Age",
  "onboarding.phone": "Phone number",
  "onboarding.state": "State",
  "onboarding.district": "District",
  "onboarding.caregiverName": "Family / caregiver name",
  "onboarding.caregiverPhone": "Caregiver phone number",
  "onboarding.notes": "Observations & symptoms noticed by family (optional)",
  "onboarding.notesPlaceholder": "For example: repeating questions, slight confusion with familiar routes, change in sleep habits…",
  "onboarding.savedLocally": "Saved safely on this device.",
  "onboarding.submit": "Save & Go to Dashboard",
  "onboarding.submitting": "Saving profile…",

  // Common UI
  "common.back": "Back",
  "common.home": "Home",
  "common.start": "Start",
  "common.next": "Next",
  "common.done": "Done",
  "common.yes": "Yes",
  "common.no": "No",
  "common.again": "Play again",
  "common.wellDone": "Well done!",
  "common.thankYou": "Thank you",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.loading": "Loading…",
  "common.offline": "Offline Mode Active",

  // Greetings & Home
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
  "games.title": "Choose a game",
  "reminders.title": "My reminders",
  "reminders.taken": "Taken",
  "day.title": "My day",
  "talk.title": "Talk to me",
  "talk.ask": "Tap and ask me anything",
  "offline.pending": "activities waiting to sync",
  "offline.synced": "All activities synchronized",
  "offline.offline": "You are offline — everything still works seamlessly",
};

const hi: Dict = {
  // App brand & Nav
  "app.name": "न्यूरोट्रैक उत्तर-पूर्व",
  "app.tagline": "संज्ञानात्मक देखभाल · पूर्वोत्तर भारत",
  "app.badge": "एआई",
  "nav.demo": "लाइव डेमो",
  "nav.features": "केयर सुइट",
  "nav.states": "८ राज्य",
  "nav.privacy": "गोपनीयता और एआई",
  "nav.stories": "कहानियां",
  "nav.home": "होम",
  "nav.play": "गेम्स हब",
  "nav.day": "मेरा दिन",
  "nav.talk": "बात करें",
  "nav.family": "परिवार",
  "nav.profile": "प्रोफ़ाइल",
  "nav.doctors": "डॉक्टर",
  "nav.dashboard": "डैशबोर्ड",
  "nav.signOut": "साइन आउट",
  "nav.start": "शुरू करें",
  "nav.resume": "डैशबोर्ड खोलें",
  "nav.emergency": "आपातकालीन हेल्पलाइन (१४४१६)",
  "nav.menu": "मेनू",
  "nav.close": "बंद करें",

  // Accessibility
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

  // Hero Section
  "hero.badge": "पूर्वोत्तर भारत · एआई संज्ञानात्मक स्वास्थ्य मंच",
  "hero.title1": "प्रारंभिक पहचान एवं",
  "hero.titleGradient": "स्नेहपूर्ण देखभाल",
  "hero.title2": "पूर्वोत्तर के हर परिवार के लिए।",
  "hero.subhead": "असमिया, हिंदी और अंग्रेजी में सांस्कृतिक रूप से अनुकूलित, ध्वनि-निर्देशित संज्ञानात्मक जांच और मेमोरी जिम।",
  "hero.ctaPrimary": "५-मिनट जांच शुरू करें",
  "hero.ctaResume": "सक्रिय सत्र जारी रखें",
  "hero.ctaDemo": "लाइव डेमो आज़माएँ",
  "hero.readAloud": "परिचय सुनें",
  "hero.metric1Value": "१००%",
  "hero.metric1Label": "ऑफ़लाइन एवं पूर्ण निजी",
  "hero.metric2Value": "८ राज्य",
  "hero.metric2Label": "सांस्कृतिक रूप से अनुकूलित",
  "hero.metric3Value": "३-इन-१",
  "hero.metric3Label": "ट्रिपल बायोमार्कर जांच",

  // Features & Carousel
  "features.tag": "चिकित्सीय आधार",
  "features.title": "ट्रिपल-बायोमार्कर प्रारंभिक स्क्रीनिंग सुइट",
  "features.subtitle": "स्मृति परीक्षण, वाक् ध्वनि विश्लेषण और व्यवहार संबंधी संकेतों का सरल एवं बिना किसी तनाव का संयोजन।",
  "triad.cogTitle": "१. संज्ञानात्मक परीक्षण",
  "triad.cogDesc": "मेमोरी कार्ड, स्थानिक दिशा पहचान और सांस्कृतिक पैटर्न पहचान।",
  "triad.speechTitle": "२. वाक् एवं ध्वनि विश्लेषण",
  "triad.speechDesc": "क्षेत्रीय बोलियों में आवाज़ की गति, ठहराव और वाक्य पुनरावृत्ति का विश्लेषण।",
  "triad.behTitle": "३. व्यवहार संबंधी संकेत",
  "triad.behDesc": "हाथों का कंपन, टाइपिंग गति में अंतर और ऐप उपयोग की सहजता।",

  // 8 States Section
  "states.tag": "पूर्वोत्तर के ८ राज्य",
  "states.title": "हर पहाड़ी और घाटी की संस्कृति से जुड़ा",
  "states.subtitle": "असम के चाय बागान, मेघालय के जीवित पुल, मणिपुर के लोकतक झील से लेकर नागालैंड के पारंपरिक प्रतीक।",

  // Auth / Login
  "auth.portalBadge": "सुरक्षित क्लिनिकल पोर्टल",
  "auth.title": "न्यूरोट्रैक में साइन इन करें",
  "auth.subtitle": "पूर्वोत्तर भारत के लिए सुरक्षित रूप से रोगी रिकॉर्ड और संज्ञानात्मक डेटा प्रबंधित करें।",
  "auth.bullet1": "क्लिनिकल रिकॉर्ड सभी नोड्स पर सुरक्षित रूप से सिंक होते हैं",
  "auth.bullet2": "एंड-टू-एंड एन्क्रिप्टेड, डीपी secretडीपी अधिनियम २०२३ के अनुरूप",
  "auth.bullet3": "सभी ८ पूर्वोत्तर राज्यों में बहु-देखभालकर्ता पहुँच",
  "auth.buttonGoogle": "Google से जारी रखें",
  "auth.buttonRedirecting": "Google पर पुनर्निर्देशित हो रहा है…",
  "auth.backHome": "← मुख्य पृष्ठ पर वापस जाएं",
  "auth.privacyFooter": "ऑफ़लाइन होने पर डेटा सुरक्षित रूप से आपके डिवाइस पर रहता है और इंटरनेट मिलने पर स्वतः सिंक होता है।",

  // Onboarding
  "onboarding.tag": "रोगी प्रोफ़ाइल",
  "onboarding.title": "नया प्रोफ़ाइल बनाएं",
  "onboarding.subtitle": "पहले बुनियादी जानकारी दर्ज करें। इसके बाद आपको डैशबोर्ड दिखेगा। जांच कभी भी शुरू की जा सकती है।",
  "onboarding.back": "मुख्य पृष्ठ पर वापस जाएं",
  "onboarding.roleLegend": "मैं यह फ़ॉर्म भर रहा/रही हूँ",
  "onboarding.roleSelf": "स्वयं (जिसकी जांच हो रही है)",
  "onboarding.roleCaregiver": "परिवार का सदस्य या देखभालकर्ता",
  "onboarding.name": "पूरा नाम",
  "onboarding.namePlaceholder": "उदा. अनन्या बोरा",
  "onboarding.sex": "लिंग",
  "onboarding.sexFemale": "महिला",
  "onboarding.sexMale": "पुरुष",
  "onboarding.sexOther": "अन्य",
  "onboarding.age": "आयु",
  "onboarding.phone": "फ़ोन नंबर",
  "onboarding.state": "राज्य",
  "onboarding.district": "ज़िला",
  "onboarding.caregiverName": "परिवार / देखभालकर्ता का नाम",
  "onboarding.caregiverPhone": "देखभालकर्ता का फ़ोन नंबर",
  "onboarding.notes": "परिवार द्वारा देखे गए लक्षण (वैकल्पिक)",
  "onboarding.notesPlaceholder": "जैसे: बार-बार वही सवाल पूछना, जाने-पहचाने रास्तों में भ्रम होना, नींद के पैटर्न में बदलाव…",
  "onboarding.savedLocally": "इस डिवाइस पर सुरक्षित रूप से सहेजा गया।",
  "onboarding.submit": "सहेजें और डैशबोर्ड पर जाएं",
  "onboarding.submitting": "सहेजा जा रहा है…",

  // Common UI
  "common.back": "वापस",
  "common.home": "होम",
  "common.start": "शुरू करें",
  "common.next": "आगे",
  "common.done": "पूरा",
  "common.yes": "हाँ",
  "common.no": "नहीं",
  "common.again": "फिर खेलें",
  "common.wellDone": "बहुत बढ़िया!",
  "common.thankYou": "धन्यवाद",
  "common.cancel": "रद्द करें",
  "common.save": "सहेजें",
  "common.loading": "लोड हो रहा है…",
  "common.offline": "ऑफ़लाइन मोड सक्रिय",

  // Greetings & Home
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
  "games.title": "एक खेल चुनें",
  "reminders.title": "मेरी याददिलाहट",
  "reminders.taken": "हो गया",
  "day.title": "मेरा दिन",
  "talk.title": "मुझसे बात करें",
  "talk.ask": "दबाकर कुछ भी पूछें",
  "offline.pending": "गतिविधियाँ सिंक होने की प्रतीक्षा में",
  "offline.synced": "सभी गतिविधियाँ सिंक हो गईं",
  "offline.offline": "आप ऑफ़लाइन हैं — सब कुछ सामान्य रूप से चलता रहेगा",
};

const as: Dict = {
  // App brand & Nav
  "app.name": "নিউৰোট্ৰেক উত্তৰ-পূব",
  "app.tagline": "কগনিটিভ কেয়াৰ · উত্তৰ পূৰ্বাঞ্চল",
  "app.badge": "AI",
  "nav.demo": "লাইভ ডেমো",
  "nav.features": "কেয়াৰ চুইট",
  "nav.states": "৮খন ৰাজ্য",
  "nav.privacy": "গোপনীয়তা আৰু AI",
  "nav.stories": "কাহিনীসমূহ",
  "nav.home": "ঘৰ",
  "nav.play": "খেল হাব",
  "nav.day": "মোৰ দিন",
  "nav.talk": "কথা পাতক",
  "nav.family": "পৰিবাৰ",
  "nav.profile": "প্ৰফাইল",
  "nav.doctors": "চিকিৎসক",
  "nav.dashboard": "ডেশ্বব'ৰ্ড",
  "nav.signOut": "চাইন আউট",
  "nav.start": "আৰম্ভ কৰক",
  "nav.resume": "ডেশ্বব'ৰ্ড খোলক",
  "nav.emergency": "জৰুৰীকালীন হেল্পলাইন (১৪৪১৬)",
  "nav.menu": "মেনু",
  "nav.close": "বন্ধ কৰক",

  // Accessibility
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

  // Hero Section
  "hero.badge": "উত্তৰ-পূব ভাৰত · AI কগনিটিভ কেয়াৰ মঞ্চ",
  "hero.title1": "প্ৰাথমিক চিনাক্তকৰণ আৰু",
  "hero.titleGradient": "মৰমীয়াল যত্ন",
  "hero.title2": "উত্তৰ-পূৰ্বাঞ্চলৰ প্ৰতিটো পৰিয়ালৰ বাবে।",
  "hero.subhead": "অসমীয়া, হিন্দী আৰু ইংৰাজীত সাংস্কৃতিকভাৱে উপযুক্ত, কণ্ঠ-নিৰ্দেশিত স্মৃতি পৰীক্ষণ আৰু ব্ৰেইন জিম।",
  "hero.ctaPrimary": "৫ মিনিটৰ পৰীক্ষণ আৰম্ভ কৰক",
  "hero.ctaResume": "সক্ৰিয় অধিবেশন চলাই নিয়ক",
  "hero.ctaDemo": "লাইভ ডেমো চাওক",
  "hero.readAloud": "পৰিচয় শুনক",
  "hero.metric1Value": "১০০%",
  "hero.metric1Label": "অফলাইন আৰু ব্যক্তিগত",
  "hero.metric2Value": "৮খন ৰাজ্য",
  "hero.metric2Label": "সাংস্কৃতিকভাৱে সংলগ্ন",
  "hero.metric3Value": "৩-ইন-১",
  "hero.metric3Label": "ট্ৰিপল বায়'মাৰ্কাৰ পৰীক্ষণ",

  // Features & Carousel
  "features.tag": "ক্লিনিকেল আধাৰ",
  "features.title": "ট্ৰিপল-বায়'মাৰ্কাৰ প্ৰাৰম্ভিক স্ক্ৰীনিং চুইট",
  "features.subtitle": "স্মৃতি পৰীক্ষা, কথা কোৱাৰ ছন্দ আৰু দৈনন্দিন আচৰণৰ সহজ নিৰীক্ষণ—কোনো ভয় বা শংকা নোহোৱাকৈ।",
  "triad.cogTitle": "১. কগনিটিভ পৰীক্ষা",
  "triad.cogDesc": "মেম'ৰি কাৰ্ড, স্থান আৰু দিশ চিনাক্তকৰণ আৰু সাংস্কৃতিক পেটাৰ্ণ চিনাকি।",
  "triad.speechTitle": "২. কণ্ঠ আৰু মাতৰ ছন্দ",
  "triad.speechDesc": "আঞ্চলিক ভাষাত কথাৰ গতি, বিৰতি আৰু বাক্য পুনৰাবৃত্তিৰ বিশ্লেষণ।",
  "triad.behTitle": "৩. আচৰণগত সূচক",
  "triad.behDesc": "হাতৰ কঁপনি, টাইপিং গতি আৰু ব্যৱহাৰৰ স্বাভাৱিকতা চিনাক্তকৰণ।",

  // 8 States Section
  "states.tag": "উত্তৰ-পূবৰ ৮খন ৰাজ্য",
  "states.title": "প্ৰতিখন পাহাৰ আৰু উপত্যকাৰ সৈতে জড়িত",
  "states.subtitle": "অসমৰ চাহ বাগিচা, মেঘালয়ৰ জীৱন্ত দলং, মণিপুৰৰ লোকটাক হ্ৰদৰ পৰা নাগালেণ্ডৰ পৰম্পৰাগত ৰূপ।",

  // Auth / Login
  "auth.portalBadge": "সুৰক্ষিত ক্লিনিকেল প'ৰ্টেল",
  "auth.title": "নিউৰোট্ৰেকত প্ৰৱেশ কৰক",
  "auth.subtitle": "উত্তৰ-পূৰ্বাঞ্চলৰ বাবে ৰোগীৰ তথ্য আৰু কগনিটিভ কেয়াৰ সংৰক্ষণ কৰক।",
  "auth.bullet1": "ক্লিনিকেল তথ্য সকলো ন'ডতে সুৰক্ষিতভাৱে চিনক হয়",
  "auth.bullet2": "এণ্ড-টু-এণ্ড এনক্ৰিপ্ট কৰা, DPDP আইন ২০২৩ ৰ অধীনত",
  "auth.bullet3": "৮খন উত্তৰ-পূব ৰাজ্যত পৰিয়াল আৰু সহায়কৰ সুবিধা",
  "auth.buttonGoogle": "Google ৰ সৈতে আগবাঢ়ক",
  "auth.buttonRedirecting": "Google লৈ নিয়া হৈছে…",
  "auth.backHome": "← মুখ্য পৃষ্ঠালৈ উভতি যাওক",
  "auth.privacyFooter": "অফলাইন অৱস্থাতো তথ্য আপোনাৰ ডিভাইচতে সুৰক্ষিত থাকে আৰু ইন্টাৰনেট পালে আপোনা-আপুনি চিনক হয়।",

  // Onboarding
  "onboarding.tag": "ৰোগী অনব'ৰ্ডিং",
  "onboarding.title": "প্ৰফাইল সৃষ্টি কৰক",
  "onboarding.subtitle": "প্ৰথমে সাধাৰণ তথ্য দিয়ক। তাৰ পিছত ডেশ্বব'ৰ্ড দেখিব। পৰীক্ষা যিকোনো সময়ত আৰম্ভ কৰিব পাৰিব।",
  "onboarding.back": "মুখ্য পৃষ্ঠালৈ উভতি যাওক",
  "onboarding.roleLegend": "মই এই তথ্যসমূহ পূৰণ কৰিছোঁ",
  "onboarding.roleSelf": "নিজে (যাৰ পৰীক্ষা হ'ব)",
  "onboarding.roleCaregiver": "পৰিয়ালৰ সদস্য বা সহায়ক হিচাপে",
  "onboarding.name": "সম্পূৰ্ণ নাম",
  "onboarding.namePlaceholder": "যেনে: অনন্যা বৰা",
  "onboarding.sex": "লিংগ",
  "onboarding.sexFemale": "মহিলা",
  "onboarding.sexMale": "পুৰুষ",
  "onboarding.sexOther": "অন্যান্য",
  "onboarding.age": "বয়স",
  "onboarding.phone": "ফোন নম্বৰ",
  "onboarding.state": "ৰাজ্য",
  "onboarding.district": "জিলা",
  "onboarding.caregiverName": "পৰিয়াল / সহায়কৰ নাম",
  "onboarding.caregiverPhone": "সহায়কৰ ফোন নম্বৰ",
  "onboarding.notes": "পৰিয়ালে লক্ষ্য কৰা লক্ষণসমূহ (ঐচ্ছিক)",
  "onboarding.notesPlaceholder": "যেনে: একে কথাকে বাৰে বাৰে সোধা, চিনাকি ৰাস্তা পাহৰি যোৱা, টোপনিৰ সালসলনি…",
  "onboarding.savedLocally": "এই ডিভাইচতে সুৰক্ষিতভাৱে সাঁচি থোৱা হৈছে।",
  "onboarding.submit": "সাঁচক আৰু ডেশ্বব'ৰ্ডলৈ যাওক",
  "onboarding.submitting": "সাঁচি থকা হৈছে…",

  // Common UI
  "common.back": "পিছলৈ",
  "common.home": "ঘৰ",
  "common.start": "আৰম্ভ",
  "common.next": "পৰৱৰ্তী",
  "common.done": "হ'ল",
  "common.yes": "হয়",
  "common.no": "নহয়",
  "common.again": "আকৌ খেলক",
  "common.wellDone": "বৰ ভাল!",
  "common.thankYou": "ধন্যবাদ",
  "common.cancel": "বাতিল",
  "common.save": "সাঁচক",
  "common.loading": "অপেক্ষা কৰক…",
  "common.offline": "অফলাইন মোড সক্ৰিয়",

  // Greetings & Home
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

  const t = useCallback((key: string) => DICTS[lang]?.[key] ?? en[key] ?? key, [lang]);

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

