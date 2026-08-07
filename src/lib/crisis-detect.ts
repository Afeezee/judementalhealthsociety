/**
 * Crisis-language detection for the AI Assistant (spec §2.9, §6).
 *
 * The assistant NEVER role-plays as a crisis counsellor. When a user
 * mentions self-harm, suicide, or immediate danger, we route them to
 * the real crisis content on /emergency — before the model gets to
 * generate anything (server-side), and again alongside its response.
 *
 * These patterns are deliberately broad on the safe side: over-triggering
 * costs a small banner; under-triggering costs lives. Cultural coverage
 * includes both formal ("commit suicide") and informal Nigerian idioms
 * ("end it all", "cannot go on", "tire of this life").
 */

const CRISIS_PATTERNS: RegExp[] = [
  // Explicit self-harm
  /\bkill(ing)?\s+(my ?self|me\s?self)\b/i,
  /\bharm(ing)?\s+(my ?self|me\s?self)\b/i,
  /\bcut(ting)?\s+(my ?self|me\s?self)\b/i,
  /\bhurt(ing)?\s+(my ?self|me\s?self)\b/i,
  /\bself[-\s]?harm\b/i,
  /\bself[-\s]?injur(y|e|ies|ing)\b/i,

  // Suicide-adjacent
  /\bsuicid(e|al|ing)\b/i,
  /\btak(e|ing)\s+my\s+own\s+life\b/i,
  /\bend(ing)?\s+(my|this)\s+life\b/i,
  /\bend\s+it\s+all\b/i,
  /\bnot\s+want\s+to\s+live\b/i,
  /\bdon'?t\s+want\s+to\s+(live|be\s+here|exist)\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bwish(ing)?\s+(i|i'?d|i\s+was|i\s+were)\s+dead\b/i,
  /\bbetter\s+off\s+dead\b/i,
  /\bno\s+reason\s+to\s+live\b/i,
  /\btir(e|ed)\s+of\s+(this\s+life|living|life)\b/i,
  /\bcan'?t\s+(go\s+on|do\s+this|take\s+it)(\s+any\s?more)?\b/i,
  /\bnothing\s+to\s+live\s+for\b/i,
  /\bworld\s+would\s+be\s+better\s+without\s+me\b/i,

  // Means / method (do not require verb — treat as escalation on its own)
  /\boverdos(e|ing)\b/i,
  /\bpills?\s+to\s+(die|end)\b/i,
  /\bnoose\b/i,
  /\bhang(ing)?\s+my ?self\b/i,
  /\bjump(ing)?\s+off\b/i,

  // "Goodbye" language patterns that read as final
  /\bthis\s+is\s+(my\s+)?goodbye\b/i,
  /\bwon'?t\s+be\s+here\s+(tomorrow|much\s+longer)\b/i,
];

const CONCERN_FOR_OTHER_PATTERNS: RegExp[] = [
  // The user is worried about someone else — same routing, softer wording.
  /\b(my|a)\s+(friend|sister|brother|mother|father|cousin|colleague|classmate|student|child|son|daughter|partner|husband|wife)\b.{0,60}\b(suicid|kill\s+(himself|herself|themselves)|hurt\s+(himself|herself|themselves)|end(ing)?\s+(his|her|their)\s+life|want\s+to\s+die)\b/i,
  /\b(someone|somebody)\b.{0,40}\b(suicid|kill\s+(themselves?|himself|herself))\b/i,
];

export type CrisisMatch = {
  matched: boolean;
  severity: "self" | "other" | null;
  matches: string[];
};

export function detectCrisis(text: string): CrisisMatch {
  if (!text) return { matched: false, severity: null, matches: [] };
  const matches: string[] = [];
  let selfMatched = false;
  let otherMatched = false;

  for (const p of CRISIS_PATTERNS) {
    const m = text.match(p);
    if (m) {
      selfMatched = true;
      matches.push(m[0]);
    }
  }
  for (const p of CONCERN_FOR_OTHER_PATTERNS) {
    const m = text.match(p);
    if (m) {
      otherMatched = true;
      matches.push(m[0]);
    }
  }

  if (!selfMatched && !otherMatched) {
    return { matched: false, severity: null, matches: [] };
  }
  return {
    matched: true,
    severity: selfMatched ? "self" : "other",
    matches,
  };
}

/**
 * The block of text the API prepends to any assistant response when
 * crisis language is detected. Deliberately not model-generated —
 * this content is JMHS-authored and identical every time so it can
 * be relied on.
 */
export function crisisPreface(severity: "self" | "other"): string {
  if (severity === "self") {
    return `**Please read this first — before anything else I say.**

What you're describing sounds serious, and I'm not a crisis service. Please reach a person trained to help, right now:

- **National Emergency Hotline: 112** — toll-free, 24/7, from any phone.
- **SURPIN (Suicide Research and Prevention Initiative): 0800 0787 7464** — toll-free.
- **MANI (Mentally Aware Nigeria): 0809 111 6264** or **0811 168 0686**.
- If you or anyone else is in immediate danger, go to your nearest hospital emergency department.

You can also open the [emergency support page](/emergency) — it has grounding techniques and step-by-step guidance.

You don't have to do this alone. Please reach out to someone right now.

---

`;
  }
  return `**Before we talk about how to help them — please make sure they're safe right now.**

If the person you're worried about is in immediate danger, stay with them. Contact emergency services or a trusted family member. Our [emergency support page](/emergency) has crisis numbers and step-by-step guidance you can follow together.

---

`;
}
