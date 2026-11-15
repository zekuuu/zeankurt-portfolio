import { identity } from "@/lib/identity";

/** Visible FAQ + FAQPage JSON-LD. Technical facts only. */
export function buildFaq(email: string) {
  return [
    {
      q: `Who is ${identity.name}?`,
      a: identity.bios.medium,
    },
    {
      q: `What does ${identity.name} build?`,
      a: "Full-stack web applications: Next.js and React interfaces with Laravel, Supabase or PostgreSQL backends, plus Web3 apps on Base. His projects include Clario, CLINIQ, Salikop and NameThat.",
    },
    {
      q: "What tech stack does he use?",
      a: `${identity.stack.join(", ")}. He also uses AI-assisted development tools while owning the architecture, code review and debugging.`,
    },
    {
      q: "What hackathons has he won or joined?",
      a: `${identity.awards.join(". ")}.`,
    },
    {
      q: "Where does he study?",
      a: `${identity.education.degree} (${identity.education.year}) at ${identity.education.school}, ${identity.education.campus}.`,
    },
    {
      q: `How do I contact ${identity.name}?`,
      a: `Email ${email} or message him on LinkedIn (${identity.profiles.linkedin}). He is open to ${identity.lookingFor.join(", ").toLowerCase()}.`,
    },
  ];
}
