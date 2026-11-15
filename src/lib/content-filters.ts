import type { EventHighlight } from "@/types";

const CREATIVE = /photograph|videograph|photo\/video|editor|colorist|creative|media|event coverage/i;

export function isCreativeText(text: string) {
  return CREATIVE.test(text);
}

/** Homepage keeps hackathons and hands-on technical roles; the rest lives on /events. */
export function isMainPageEvent(event: EventHighlight) {
  if (isCreativeText(event.role ?? "")) return false;
  return (
    event.category === "hackathon" ||
    /developer|builder|volunteer|organi[sz]er|finalist|co-host/i.test(event.role ?? "")
  );
}
