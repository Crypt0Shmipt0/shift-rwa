export type TeamMember = {
  name: string;
  initials: string;
  role: string;
  bio: string;
  /** Optional /public path to headshot. Falls back to initials avatar when absent. */
  photo?: string;
};

export const TEAM: readonly TeamMember[] = [
  {
    name: "Michael Bar Zeev",
    initials: "MB",
    role: "CEO",
    bio: "Ex-CEO Titan by First DAG (acq. Fireblocks). Serial fintech/Web3 founder.",
    photo: "/team/michael.jpg",
  },
  {
    name: "Shoham Ben Rubi",
    initials: "SB",
    role: "CLO",
    bio: "Ex-Head of International, Israel Securities Authority. Deloitte, TASE regulatory expertise.",
  },
  {
    name: "Thomas Wolff",
    initials: "TW",
    role: "CTO",
    bio: "Ex-CTO Flow Traders. Deep capital-markets + infrastructure credibility.",
    photo: "/team/thomas.jpg",
  },
  {
    name: "Daniel Liven",
    initials: "DL",
    role: "COO",
    bio: "Ex-COO Zaisan. EU commercial/antitrust lawyer specializing in Web3.",
    photo: "/team/daniel.jpg",
  },
];
