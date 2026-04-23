export type TeamMember = {
  name: string;
  /** Optional prefix like "Att." for attorneys */
  namePrefix?: string;
  initials: string;
  role: string;
  /** Short bio for the landing card — 1-2 sentences */
  bioShort: string;
  /** Full bio for the /team page */
  bioFull: string;
  /** Credential chips displayed on the card (3-4 max) */
  credentials: readonly string[];
  /** Optional /public path to headshot. Falls back to initials avatar when absent. */
  photo?: string;
};

export const TEAM: readonly TeamMember[] = [
  {
    name: "Michael Bar Zeev",
    initials: "MB",
    role: "Co-Founder & CEO",
    bioShort:
      "Serial fintech/Web3 founder with three exits. Ex-CEO of Titan (acq. Fireblocks).",
    bioFull:
      "Serial entrepreneur in fintech and Web3 with three successful exits. Former CEO of Titan, a digital asset infrastructure company under First DAG that was acquired by Fireblocks. Deep operational experience building and scaling financial technology companies from inception through acquisition.",
    credentials: ["3× Exit Founder", "Fireblocks (via Titan)", "Fintech & Web3"],
    photo: "/team/michael.jpg",
  },
  {
    namePrefix: "Att.",
    name: "Shoham Ben Rubi",
    initials: "SB",
    role: "Head of Legal & Regulatory",
    bioShort:
      "Led the International Department at the Israel Securities Authority. Ex-Deloitte, ex-TASE.",
    bioFull:
      "Led the International Department at the Israel Securities Authority, shaping cross-border securities policy and regulatory cooperation. Held senior positions at Deloitte and the Tel Aviv Stock Exchange, with extensive expertise in financial regulation and compliance across domestic and international frameworks.",
    credentials: ["Israel Securities Authority", "Deloitte", "TASE", "Cross-Border Regulation"],
  },
  {
    name: "Thomas Wolff",
    initials: "TW",
    role: "Technology Director",
    bioShort:
      "Former CTO of Flow Traders — built trading infrastructure at global scale.",
    bioFull:
      "Former CTO of Flow Traders, one of the world's largest electronic market makers, where he built and ran trading infrastructure at global scale. Hands-on technical leadership across both traditional financial markets and Web3 systems, at the intersection of high-performance engineering and financial product development.",
    credentials: ["Former CTO, Flow Traders", "Trading Infrastructure", "Web3 Architecture"],
    photo: "/team/thomas.jpg",
  },
  {
    namePrefix: "Att.",
    name: "Daniel Liven",
    initials: "DL",
    role: "Head of European Legal & Compliance",
    bioShort:
      "European commercial & antitrust lawyer. Ex-COO Zaisan. Web3 regulatory specialist.",
    bioFull:
      "European commercial and antitrust lawyer, former COO at Zaisan, a digital asset advisory firm. Specializes in regulatory frameworks governing Web3 and financial markets across European jurisdictions, focused on the practical challenges of operating compliant financial businesses in evolving regulatory environments.",
    credentials: ["Former COO, Zaisan", "EU Regulatory & Antitrust", "Web3 Compliance"],
    photo: "/team/daniel.jpg",
  },
];
