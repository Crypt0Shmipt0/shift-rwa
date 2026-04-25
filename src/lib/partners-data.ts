/**
 * Backers + ecosystem integrations — canonical data source for the landing partners section.
 * Logos in /public/partners/{backers,integrations}/{slug}.png
 */

export type Partner = {
  slug: string;
  name: string;
  /** Logo path under /public, or null if we should render a styled text fallback */
  logo: string | null;
  /** External link (usually homepage) — opens in new tab */
  url: string;
  /** Optional small descriptor under the logo (e.g. "Founder of GMX") */
  label?: string;
};

export const BACKERS: readonly Partner[] = [
  { slug: "snz",       name: "SNZ Holding",  logo: "/partners/backers/snz.png",       url: "https://snzholding.com" },
  { slug: "chainlink", name: "Chainlink",    logo: "/partners/backers/chainlink.png", url: "https://chain.link" },
  { slug: "prim3",     name: "PRIM3 VC",     logo: null,                              url: "https://prim3.com" },
  { slug: "gmx",       name: "GMX",          logo: "/partners/backers/gmx.png",       url: "https://gmx.io",        label: "Founder" },
  { slug: "dappradar", name: "dAppRadar",    logo: "/partners/backers/dappradar.png", url: "https://dappradar.com", label: "Founder" },
  { slug: "hellolabs", name: "Hello Labs",   logo: "/partners/backers/hellolabs.png", url: "https://hellolabs.xyz", label: "Founder" },
  { slug: "cvex",      name: "CVEX",         logo: "/partners/backers/cvex.png",      url: "https://cvex.trade",    label: "Founder" },
  { slug: "kraken",    name: "Kraken",       logo: "/partners/backers/kraken.png",    url: "https://kraken.com",    label: "US CEO" },
] as const;

export const INTEGRATIONS: readonly Partner[] = [
  { slug: "solana",    name: "Solana",     logo: "/partners/integrations/solana.png",    url: "https://solana.com" },
  { slug: "jupiter",   name: "Jupiter",    logo: "/partners/integrations/jupiter.png",   url: "https://jup.ag" },
  { slug: "meteora",   name: "Meteora",    logo: "/partners/integrations/meteora.png",   url: "https://meteora.ag" },
  { slug: "phantom",   name: "Phantom",    logo: "/partners/integrations/phantom.png",   url: "https://phantom.app" },
  { slug: "okx",       name: "OKX Wallet", logo: "/partners/integrations/okx.png",       url: "https://okx.com" },
  { slug: "kamino",    name: "Kamino",     logo: "/partners/integrations/kamino.png",    url: "https://kamino.finance" },
  { slug: "orca",      name: "Orca",       logo: "/partners/integrations/orca.png",      url: "https://orca.so" },
  { slug: "birdeye",   name: "Birdeye",    logo: "/partners/integrations/birdeye.png",   url: "https://birdeye.so" },
  { slug: "loopscale", name: "Loopscale",  logo: "/partners/integrations/loopscale.png", url: "https://loopscale.com" },
  { slug: "bnb",       name: "BNB Chain",  logo: "/partners/integrations/bnb.png",       url: "https://bnbchain.org" },
  { slug: "thena",     name: "Thena",      logo: "/partners/integrations/thena.png",     url: "https://thena.fi" },
  { slug: "ichi",      name: "Ichi",       logo: "/partners/integrations/ichi.png",      url: "https://ichi.org" },
  { slug: "chainlink", name: "Chainlink",  logo: "/partners/integrations/chainlink.png", url: "https://chain.link" },
  { slug: "near",      name: "NEAR",       logo: "/partners/integrations/near.png",      url: "https://near.org" },
  { slug: "alpaca",    name: "Alpaca",     logo: "/partners/integrations/alpaca.png",    url: "https://alpaca.markets" },
] as const;
