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
  "app.name": "SmritiMitra",
  "app.tagline": "A friend that helps preserve memories.",
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
  "auth.title": "Sign in to SmritiMitra",
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

  // Leadership banner
  "lead.initiative": "Cognitive Care Initiative",
  "lead.title1": "Care that reaches",
  "lead.title2": "every family.",
  "lead.subtitle": "Accessible cognitive screening, regional languages and privacy-first brain games — designed for communities across North East India.",
  "lead.badge1": "🛡 Privacy First",
  "lead.badge2": "🗣 Regional Languages",
  "lead.badge3": "🧠 Cognitive Care",

  // Carousel & Core Pillars
  "carousel.tag": "Core Capabilities",
  "carousel.heading": "Engineered for real homes & field clinics",
  "carousel.subheading": "Explore the four pillars supporting cognitive wellbeing across the North Eastern Region.",
  "carousel.slide1.tag": "Clinical Triad",
  "carousel.slide1.title": "Triple-Biomarker Guided Screening",
  "carousel.slide1.badge": "Cognitive · Speech · Behavioral",
  "carousel.slide1.desc": "A calm, conversational screening combining memory tasks, spoken language rhythm, and daily behavioral indicators. Scored directly on-device with zero diagnostic stigma.",
  "carousel.slide1.b1": "No intimidating hospital forms",
  "carousel.slide1.b2": "Instant risk category & clinician next-steps",
  "carousel.slide1.b3": "Automatic offline caching in remote districts",
  "carousel.slide2.tag": "AI Cognitive Gym",
  "carousel.slide2.title": "10 AI-Adaptive Brain Games",
  "carousel.slide2.badge": "Real-time Difficulty Scaling (L1–L5)",
  "carousel.slide2.desc": "Engaging memory cards, routine recall, Stroop attention, family face recognition, and speech echo games that dynamically adjust challenge level based on response speed and accuracy.",
  "carousel.slide2.b1": "Memory, attention, logic & temporal recall",
  "carousel.slide2.b2": "Weekly community tournaments & XP streaks",
  "carousel.slide2.b3": "Designed specifically for elderly hand dexterity",
  "carousel.slide3.tag": "Regional Dialects",
  "carousel.slide3.title": "Multilingual & Voice-Assisted",
  "carousel.slide3.badge": "Assamese · Hindi · English · Regional",
  "carousel.slide3.desc": "Elderly-friendly large tap buttons, full voice read-aloud, and speech-based answers tailored for North East Indian households with familiar tea garden and market cues.",
  "carousel.slide3.b1": "Assamese & Hindi voice guidance built-in",
  "carousel.slide3.b2": "High contrast & slow interaction modes",
  "carousel.slide3.b3": "Culturally familiar objects from all 8 states",
  "carousel.slide4.tag": "Privacy Guarantee",
  "carousel.slide4.title": "Zero-Cloud Local Privacy",
  "carousel.slide4.badge": "DPDP Act 2023 Compliant",
  "carousel.slide4.desc": "All screening data and behavioral telemetry stay securely encrypted on your device. Works completely offline without requiring an active internet connection.",
  "carousel.slide4.b1": "Works in zero-connectivity hills & tea estates",
  "carousel.slide4.b2": "No keystrokes or private messages logged",
  "carousel.slide4.b3": "1-click data deletion anytime",

  // Demo section
  "demo.title": "Interactive Live Mini-Demo",
  "demo.subtitle": "Try a 30-second exercise right now in your browser",
  "demo.tabMemory": "Memory Card",
  "demo.tabStroop": "Attention Stroop",
  "demo.tabVoice": "Voice Echo",
  "demo.promptMemory": "Find the matching cultural tea garden card:",
  "demo.promptStroop": "Choose the COLOR of the word (not the text):",
  "demo.promptVoice": "Tap the mic and say this morning greeting:",
  "demo.tryModule": "Try this module",
  "demo.activeModule": "Active Module",

  // Games Section
  "games.heading": "Cognitive Gym & Memory Retention",
  "games.subheading": "10 culturally tailored games training episodic memory, visual attention, and verbal fluency.",
  "games.play": "Play Game",

  // Privacy Section
  "privacy.heading": "Strict Local-First Privacy for Vulnerable Elders",
  "privacy.subheading": "Built to uphold the highest data sovereignty standards under the Indian Digital Personal Data Protection Act 2023.",

  // Reviews
  "reviews.heading": "Trusted by Families, ASHAs & Clinicians",
  "reviews.subheading": "Real feedback from clinics and households across North East India.",

  // Footer & Common
  "footer.quickLinks": "Platform Features",
  "footer.legal": "Legal & Privacy",
  "footer.rights": "SmritiMitra · Built with clinical respect for North East India",
  "footer.helplineTitle": "24/7 Tele-MANAS Emergency Helpline",
  "footer.helplineDesc": "Govt of India Toll-Free Mental Health & Neurological Support: Call 14416",
};

const hi: Dict = {
  // App brand & Nav
  "app.name": "SmritiMitra",
  "app.tagline": "A friend that helps preserve memories.",
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

  // Leadership banner
  "lead.initiative": "संज्ञानात्मक देखभाल पहल",
  "lead.title1": "देखभाल जो पहुंचे",
  "lead.title2": "हर परिवार तक।",
  "lead.subtitle": "सुलभ संज्ञानात्मक जांच, क्षेत्रीय भाषाएं और पूर्णतः निजी दिमागी खेल — पूर्वोत्तर भारत के परिवारों के लिए विशेष रूप से निर्मित।",
  "lead.badge1": "🛡 पूर्णतः निजी",
  "lead.badge2": "🗣 क्षेत्रीय भाषाएं",
  "lead.badge3": "🧠 दिमागी देखभाल",

  // Carousel & Core Pillars
  "carousel.tag": "मुख्य क्षमताएं",
  "carousel.heading": "घरों एवं क्लिनिकों के लिए तैयार",
  "carousel.subheading": "पूर्वोत्तर क्षेत्र में संज्ञानात्मक स्वास्थ्य का समर्थन करने वाले चार प्रमुख आधार।",
  "carousel.slide1.tag": "क्लिनिकल ट्रायड",
  "carousel.slide1.title": "ट्रिपल-बायोमार्कर आधारित स्क्रीनिंग",
  "carousel.slide1.badge": "संज्ञानात्मक · वाक् · व्यवहार",
  "carousel.slide1.desc": "स्मृति परीक्षण, वाक् गति और दैनिक व्यवहार संकेतकों का सरल और तनावमुक्त संयोजन। सीधे इसी डिवाइस पर सुरक्षित रूप से विश्लेषित।",
  "carousel.slide1.b1": "अस्पताल के कठिन फ़ॉर्मों से मुक्ति",
  "carousel.slide1.b2": "तत्काल जोखिम श्रेणी और डॉक्टर के मार्गदर्शन",
  "carousel.slide1.b3": "दूरदराज के इलाकों में स्वतः ऑफ़लाइन कार्य",
  "carousel.slide2.tag": "एआई ब्रेन जिम",
  "carousel.slide2.title": "१० एआई-अनुकूली दिमागी खेल",
  "carousel.slide2.badge": "रीयल-टाइम कठिनाई स्तर (L1–L5)",
  "carousel.slide2.desc": "मेमोरी कार्ड, दैनिक दिनचर्या याद करना, परिवार के चेहरों की पहचान और वाक् अभ्यास खेल जो खिलाड़ी की गति के अनुसार स्वतः ढलते हैं।",
  "carousel.slide2.b1": "स्मृति, एकाग्रता और तार्किक अभ्यास",
  "carousel.slide2.b2": "साप्ताहिक चुनौतियां और प्रोत्साहन अंक",
  "carousel.slide2.b3": "बुजुर्गों के हाथों की सहजता के अनुकूल",
  "carousel.slide3.tag": "क्षेत्रीय बोलियां",
  "carousel.slide3.title": "बहुभाषी एवं आवाज़-निर्देशित",
  "carousel.slide3.badge": "असमिया · हिंदी · अंग्रेजी · स्थानीय",
  "carousel.slide3.desc": "बुजुर्गों के लिए बड़े टच बटन, आवाज़ द्वारा पढ़कर सुनाने की सुविधा और स्थानीय परिचित प्रतीकों के साथ तैयार।",
  "carousel.slide3.b1": "असमिया एवं हिंदी ध्वनि मार्गदर्शन अंतर्निहित",
  "carousel.slide3.b2": "उच्च कंट्रास्ट और धीमा मोड",
  "carousel.slide3.b3": "पूर्वोत्तर के सभी ८ राज्यों के जाने-पहचाने सांस्कृतिक प्रतीक",
  "carousel.slide4.tag": "गोपनीयता गारंटी",
  "carousel.slide4.title": "शून्य-क्लाउड स्थानीय सुरक्षा",
  "carousel.slide4.badge": "DPDP अधिनियम २०२३ के अनुरूप",
  "carousel.slide4.desc": "सभी जांच डेटा और व्यवहार संबंधी जानकारी आपके डिवाइस पर एन्क्रिप्टेड रहती है। इंटरनेट कनेक्शन के बिना भी पूरी तरह काम करता है।",
  "carousel.slide4.b1": "इंटरनेट रहित चाय बागानों और पहाड़ियों में सक्षम",
  "carousel.slide4.b2": "कोई कीस्ट्रोक या निजी संदेश रिकॉर्ड नहीं",
  "carousel.slide4.b3": "कभी भी १-क्लिक में डेटा मिटाने की सुविधा",

  // Demo section
  "demo.title": "लाइव इंटरैक्टिव मिनी-डेमो",
  "demo.subtitle": "अपने ब्राउज़र में अभी ३० सेकंड का अभ्यास आज़माएं",
  "demo.tabMemory": "मेमोरी कार्ड",
  "demo.tabStroop": "स्ट्रूप एकाग्रता",
  "demo.tabVoice": "आवाज़ दोहराव",
  "demo.promptMemory": "सांस्कृतिक चाय बागान कार्ड का जोड़ा खोजें:",
  "demo.promptStroop": "शब्द के रंग का चयन करें (लिखे शब्द का नहीं):",
  "demo.promptVoice": "माइक दबाएं और यह अभिवादन बोलें:",
  "demo.tryModule": "यह मॉड्यूल आज़माएँ",
  "demo.activeModule": "सक्रिय मॉड्यूल",

  // Games Section
  "games.heading": "संज्ञानात्मक जिम एवं स्मृति अभ्यास",
  "games.subheading": "पूर्वोत्तर संस्कृति के अनुसार १० खेल जो स्मृति, दृष्टि एकाग्रता और वाक् कौशल को मजबूत करते हैं।",
  "games.play": "खेलें",

  // Privacy Section
  "privacy.heading": "बुजुर्गों के लिए सुरक्षित, स्थानीय गोपनीयता",
  "privacy.subheading": "भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम २०२३ के उच्चतम मानकों के साथ निर्मित।",

  // Reviews
  "reviews.heading": "परिवारों, आशा कार्यकर्ताओं और डॉक्टरों का भरोसा",
  "reviews.subheading": "पूर्वोत्तर भारत के क्लीनिकों और परिवारों से वास्तविक अनुभव।",

  // Footer & Common
  "footer.quickLinks": "प्लेटफ़ॉर्म सुविधाएं",
  "footer.legal": "कानूनी एवं गोपनीयता",
  "footer.rights": "न्यूरोट्रैक पूर्वोत्तर · पूर्वोत्तर भारत के प्रति सम्मान के साथ निर्मित",
  "footer.helplineTitle": "२४/७ टेली-मानस आपातकालीन हेल्पलाइन",
  "footer.helplineDesc": "भारत सरकार की निःशुल्क मानसिक स्वास्थ्य एवं न्यूरो सहायता: डायल करें १४४१६",
};

const as: Dict = {
  // App brand & Nav
  "app.name": "SmritiMitra",
  "app.tagline": "A friend that helps preserve memories.",
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

  // Leadership banner
  "lead.initiative": "জ্ঞান আৰু স্মৃতি যত্ন পদক্ষেপ",
  "lead.title1": "যত্ন যি স্পৰ্শ কৰে",
  "lead.title2": "প্ৰতিটো পৰিয়ালক।",
  "lead.subtitle": "সহজ জ্ঞান পৰীক্ষা, আঞ্চলিক ভাষা আৰু সম্পূৰ্ণ ব্যক্তিগত মগজুৰ খেল — উত্তৰ-পূৰ্বাঞ্চলৰ পৰিয়ালসমূহৰ বাবে নিৰ্মিত।",
  "lead.badge1": "🛡 সম্পূৰ্ণ ব্যক্তিগত",
  "lead.badge2": "🗣 স্থানীয় ভাষা",
  "lead.badge3": "🧠 মগজুৰ যত্ন",

  // Carousel & Core Pillars
  "carousel.tag": "মূল সেৱাসমূহ",
  "carousel.heading": "ঘৰ আৰু স্বাস্থ্য কেন্দ্ৰৰ বাবে উপযুক্ত",
  "carousel.subheading": "উত্তৰ-পূৰ্বাঞ্চলত জ্ঞান আৰু স্মৃতি সুস্থতাৰ বাবে চাৰিটা মূল স্তম্ভ।",
  "carousel.slide1.tag": "ক্লিনিক্যাল ট্ৰায়াড",
  "carousel.slide1.title": "তিনিটা লক্ষণ ভিত্তিক পৰীক্ষা",
  "carousel.slide1.badge": "স্মৃতি · মাত · দৈনন্দিন আচৰণ",
  "carousel.slide1.desc": "স্মৃতি পৰীক্ষা, মাতৰ তাল আৰু দৈনন্দিন অভ্যাসৰ সহজ সংমিশ্ৰণ। ডিভাইচতে কোনো ভয় নোহোৱাকৈ স্কোৰ কৰা হয়।",
  "carousel.slide1.b1": "হাস্পতালৰ দীঘলীয়া প্ৰপত্ৰৰ প্ৰয়োজন নাই",
  "carousel.slide1.b2": "তৎক্ষণাৎ ফলাফল আৰু চিকিৎসকৰ পৰামৰ্শ",
  "carousel.slide1.b3": "দুৰ্গম অঞ্চলতো অফলাইনত চলে",
  "carousel.slide2.tag": "AI মগজুৰ ব্যায়াম",
  "carousel.slide2.title": "১০টা AI-আধাৰিত মগজুৰ খেল",
  "carousel.slide2.badge": "পৰীক্ষাৰ স্তৰ (L1–L5)",
  "carousel.slide2.desc": "স্মৃতি কাৰ্ড, পুৰণি অভ্যাস মনত পেলোৱা, পৰিয়ালৰ চিনাকি মুখ চিনাক্তকৰণ খেল যিবোৰ খেলুৱৈৰ দক্ষতা অনুসৰি সলনি হয়।",
  "carousel.slide2.b1": "স্মৃতি, মনোযোগ আৰু তৰ্ক শক্তি বৃদ্ধি",
  "carousel.slide2.b2": "সাপ্তাহিক প্ৰতিযোগিতা আৰু পুৰস্কাৰ",
  "carousel.slide2.b3": "বয়োবৃদ্ধসকলৰ বাবে সহজ স্পর্শ স্ক্ৰীন",
  "carousel.slide3.tag": "আঞ্চলিক ভাষা",
  "carousel.slide3.title": "মাত আৰু স্থানীয় ভাষাত নিৰ্দেশনা",
  "carousel.slide3.badge": "অসমীয়া · হিন্দী · ইংৰাজী · স্থানীয়",
  "carousel.slide3.desc": "ডাঙৰ বুটাম, মাতৰ দ্বাৰা পঢ়ি শুনোৱা সুবিধা আৰু চাহ বাগিচা বা চিনাকি সাংস্কৃতিক উপাদানৰ সৈতে সজ্জিত।",
  "carousel.slide3.b1": "অসমীয়া আৰু হিন্দীত মাত অন্তৰ্ভুক্ত",
  "carousel.slide3.b2": "স্পষ্ট দেখা পোৱা হাই কণ্ট্ৰাষ্ট আৰু লেহেমীয়া মোড",
  "carousel.slide3.b3": "উত্তৰ-পূৰ্বাঞ্চলৰ ৮খন ৰাজ্যৰ সাংস্কৃতিক প্ৰতীক",
  "carousel.slide4.tag": "গোপনীয়তা সুৰক্ষা",
  "carousel.slide4.title": "ডিভাইচতে সুৰক্ষিত তথ্য",
  "carousel.slide4.badge": "DPDP আইন ২০২৩ অনুসাৰে",
  "carousel.slide4.desc": "সকলো পৰীক্ষা আৰু তথ্য আপোনাৰ ডিভাইচতে এনক্ৰিপ্ট হৈ থাকে। ইণ্টাৰনেট নোহোৱাকৈয়ো চলে।",
  "carousel.slide4.b1": "পাহাৰীয়া আৰু চাহ বাগিচা অঞ্চলত অফলাইনত চলে",
  "carousel.slide4.b2": "ব্যক্তিগত বাৰ্তা কেতিয়াও সংগ্ৰহ নহয়",
  "carousel.slide4.b3": "১-ক্লিকত সকলো তথ্য মচি পেলোৱাৰ সুবিধা",

  // Demo section
  "demo.title": "অনলাইন লাইভ ডেমো",
  "demo.subtitle": "আপোনাৰ ব্ৰাউজাৰতে ৩০ ছেকেণ্ডৰ অনুশীলন কৰি চাওক",
  "demo.tabMemory": "স্মৃতি কাৰ্ড",
  "demo.tabStroop": "মনোযোগ পৰীক্ষা",
  "demo.tabVoice": "মাতৰ প্ৰতিধ্বনি",
  "demo.promptMemory": "চাহ বাগিচাৰ চিনাকি কাৰ্ডৰ যোৰ মিলাওক:",
  "demo.promptStroop": "শব্দটোৰ ৰং বাছক (লিখা শব্দটো নহয়):",
  "demo.promptVoice": "মাইক টিপি এই প্ৰভাতী সম্ভাষণ কওক:",
  "demo.tryModule": "এই খেলটো খেলি চাওক",
  "demo.activeModule": "সক্ৰিয় খেল",

  // Games Section
  "games.heading": "মগজুৰ ব্যায়াম আৰু স্মৃতি সংৰক্ষণ",
  "games.subheading": "উত্তৰ-পূৰ্বাঞ্চলৰ সংস্কৃতিৰ ১০টা খেল যিয়ে স্মৃতি আৰু মনোযোগ শক্তিশালী কৰে।",
  "games.play": "খেলক",

  // Privacy Section
  "privacy.heading": "বয়োবৃদ্ধসকলৰ বাবে কঠোৰ স্থানীয় গোপনীয়তা",
  "privacy.subheading": "ভাৰতীয় ডিজিটেল ব্যক্তিগত তথ্য সুৰক্ষা আইন ২০২৩ অনুসাৰে নিৰ্মিত।",

  // Reviews
  "reviews.heading": "পৰিয়াল, আশা কৰ্মী আৰু চিকিৎসকৰ আস্থা",
  "reviews.subheading": "উত্তৰ-পূৰ্বাঞ্চলৰ ক্লিনিক আৰু ঘৰৰ পৰা পোৱা প্ৰকৃত মতামত।",

  // Footer & Common
  "footer.quickLinks": "প্লেটফৰ্ম সেৱাসমূহ",
  "footer.legal": "আইন আৰু গোপনীয়তা",
  "footer.rights": "নিউৰোট্ৰেক উত্তৰ-পূব · শ্ৰদ্ধা আৰু নিষ্ঠাৰে নিৰ্মিত",
  "footer.helplineTitle": "২৪/৭ টেলি-মানস জৰুৰীকালীন হেল্পলাইন",
  "footer.helplineDesc": "ভাৰত চৰকাৰৰ বিনামূলীয়া মানসিক স্বাস্থ্য আৰু স্নায়ু সাহায্য: কল কৰক ১৪৪১৬",
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

