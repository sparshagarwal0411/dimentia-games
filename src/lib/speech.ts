/** Thin wrappers around the Web Speech API. All calls are browser-only. */

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, locale = "en-IN", slow = false) {
  if (!speechSupported() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = slow ? 0.75 : 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    /* speech is a bonus, never a blocker */
  }
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

/** Reads the visible text of a container aloud, skipping hidden nodes. */
export function readScreen(root: HTMLElement | null, locale: string, slow = false) {
  if (!root) return;
  const text = root.innerText.replace(/\s+/g, " ").trim().slice(0, 1200);
  speak(text, locale, slow);
}

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function recognitionSupported() {
  return getRecognitionCtor() !== null;
}

/** Starts one-shot voice capture. Returns a stop function. */
export function listenOnce(
  locale: string,
  onResult: (transcript: string) => void,
  onEnd?: () => void,
) {
  const Ctor = getRecognitionCtor();
  if (!Ctor) {
    onEnd?.();
    return () => {};
  }
  const recognition = new Ctor();
  recognition.lang = locale;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  recognition.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript ?? "";
    if (transcript) onResult(transcript);
  };
  recognition.onend = () => onEnd?.();
  recognition.onerror = () => onEnd?.();
  try {
    recognition.start();
  } catch {
    onEnd?.();
  }
  return () => {
    try {
      recognition.stop();
    } catch {
      /* noop */
    }
  };
}
