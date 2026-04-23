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

/** Core leadership per pitch deck slide 10 — 5 members */
export const TEAM: readonly TeamMember[] = [
  {
    namePrefix: "Att.",
    name: "Daniel Liven",
    initials: "DL",
    role: "CEO",
    bioShort:
      "European commercial & antitrust lawyer. Ex-COO Zaisan. Web3 regulatory specialist.",
    bioFull:
      "European commercial and antitrust lawyer, former COO at Zaisan, a digital asset advisory firm. Specializes in regulatory frameworks governing Web3 and financial markets across European jurisdictions, focused on the practical challenges of operating compliant financial businesses in evolving regulatory environments.",
    credentials: ["Former COO, Zaisan", "EU Regulatory & Antitrust", "Web3 Compliance"],
    photo: "/team/daniel.jpg",
  },
  {
    name: "Michael Bar Zeev",
    initials: "MB",
    role: "CBDO",
    bioShort:
      "Serial fintech/Web3 founder with three exits. Ex-CEO of Titan (acq. Fireblocks).",
    bioFull:
      "Serial entrepreneur in fintech and Web3 with three successful exits. Former CEO of Titan, a digital asset infrastructure company under First DAG that was acquired by Fireblocks. Deep operational experience building and scaling financial technology companies from inception through acquisition.",
    credentials: ["3× Exit Founder", "Fireblocks (via Titan)", "Fintech & Web3"],
    photo: "/team/michael.jpg",
  },
  {
    name: "Thomas Wolff",
    initials: "TW",
    role: "Technology Director",
    bioShort:
      "Former CTO of Flow Traders — built trading infrastructure at global scale.",
    bioFull:
      "Former CTO of Flow Traders (13 years total, 5 years RTS), one of the world's largest electronic market makers, where he built and ran trading infrastructure at global scale. Hands-on technical leadership across both traditional financial markets and Web3 systems.",
    credentials: ["Former CTO, Flow Traders", "Trading Infrastructure", "Web3 Architecture"],
    photo: "/team/thomas.jpg",
  },
  {
    namePrefix: "Att.",
    name: "Shoham Ben Rubi",
    initials: "SB",
    role: "Legal Counsel",
    bioShort:
      "Led the International Department at the Israel Securities Authority. Ex-Deloitte, ex-TASE.",
    bioFull:
      "Led the International Department at the Israel Securities Authority, shaping cross-border securities policy and regulatory cooperation. Held senior positions at Deloitte and the Tel Aviv Stock Exchange, with extensive expertise in financial regulation and compliance across domestic and international frameworks.",
    credentials: ["Israel Securities Authority", "Deloitte", "TASE", "Cross-Border Regulation"],
  },
  {
    name: "Bar Elkis",
    initials: "BE",
    role: "COO",
    bioShort:
      "Co-Founder of PayBase. 10+ years in Fintech & Web3, guiding startups from concept to MVP.",
    bioFull:
      "Co-Founder of PayBase with 10+ years of experience in Fintech and Web3. Focused on guiding early-stage startups from concept through MVP and into scalable operations, combining operational discipline with product intuition.",
    credentials: ["Co-Founder, PayBase", "Fintech & Web3", "0-to-1 Operations"],
    photo: "/team/bar.jpg",
  },
];

/** Advisors & extended leadership per pitch deck slide 11 — 5 members */
export const ADVISORS: readonly TeamMember[] = [
  {
    name: "Tomer W. Nuni",
    initials: "TN",
    role: "VP Strategy",
    bioShort:
      "CMO at Kima Network. Advisor to ChainGPT Labs. Writer for Cointelegraph & Forbes.",
    bioFull:
      "CMO at Kima Network, advisor to ChainGPT Labs, Web3 investor and contributing writer for Cointelegraph and Forbes. Brings deep market perspective across DeFi, AI, and RWA sectors.",
    credentials: ["Kima Network CMO", "ChainGPT Advisor", "Cointelegraph / Forbes"],
    photo: "/team/tomer.jpg",
  },
  {
    name: "Alon Zusman",
    initials: "AZ",
    role: "VP R&D",
    bioShort:
      "Ex-IDC, ex-Utila. Software Engineer & Architect, 10+ years in fintech & defense.",
    bioFull:
      "Software Engineer and Architect with 10+ years across fintech and defense sectors. Former IDC and Utila engineer. Deep experience shipping resilient production systems under hard performance and security constraints.",
    credentials: ["ex-IDC", "ex-Utila", "Fintech + Defense"],
    photo: "/team/alon.jpg",
  },
  {
    name: "Omri Perl",
    initials: "OP",
    role: "Tech Lead",
    bioShort:
      "Ex-Securitize software engineer. 15+ years experience, 8+ in blockchain.",
    bioFull:
      "Former Software Engineer at Securitize. Previously at CheckPoint and Elbit. 15+ years of engineering experience with 8+ years focused on blockchain infrastructure and smart contract systems.",
    credentials: ["ex-Securitize", "ex-CheckPoint", "ex-Elbit", "8+ yrs Blockchain"],
    photo: "/team/omri.jpg",
  },
  {
    name: "Rhett Oudkerk-Pool",
    initials: "RO",
    role: "Cyber Advisor",
    bioShort:
      "Serial entrepreneur, 2× exits. CEO at Zaisan. Founded & sold Kahuna — one of NL's largest cybersecurity firms.",
    bioFull:
      "Serial entrepreneur with two successful exits. Currently CEO at Zaisan (digital asset advisory). Founded and sold Kahuna, one of the Netherlands' largest cybersecurity firms. Brings applied security expertise to SHIFT's smart contract and operational risk posture.",
    credentials: ["CEO, Zaisan", "Founded Kahuna (exit)", "Cybersecurity"],
    photo: "/team/rhett.jpg",
  },
  {
    name: "Sudip Banerjee",
    initials: "SB",
    role: "IT Advisor",
    bioShort:
      "Co-Founder of Crypto Lions. Extensive experience in IT, consulting & Web3 innovation.",
    bioFull:
      "Co-Founder of Crypto Lions with extensive experience in IT, consulting, and Web3 innovation. Advises SHIFT on infrastructure decisions and scalability pathways.",
    credentials: ["Co-Founder, Crypto Lions", "IT + Web3 Consulting"],
    photo: "/team/sudip.jpg",
  },
];
