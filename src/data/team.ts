export type TeamMember = {
  name: string;
  initials: string;
  role: string;
  bio: string;
};

export const TEAM: readonly TeamMember[] = [
  {
    name: "Michael Bar Zeev",
    initials: "MB",
    role: "CEO",
    bio: "Ex-CEO Titan by First DAG (acq. Fireblocks). Serial fintech/Web3 founder.",
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
  },
  {
    name: "Daniel Liven",
    initials: "DL",
    role: "COO",
    bio: "Ex-COO Zaisan. EU commercial/antitrust lawyer specializing in Web3.",
  },
];
