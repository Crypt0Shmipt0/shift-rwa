import { ShieldOff, Repeat, Layers } from "lucide-react";

const ROW_1 = [
  { glyph: "III", label: "Bi-Directional", sub: "Long & short on every market" },
  { glyph: "M",   label: "Tokenized",     sub: "ERC-20s, not margin positions" },
  { glyph: "B",   label: "Brokerage-free", sub: "No KYC, no paperwork, no friction" },
  { glyph: "24/7", label: "Always-on",    sub: "Settles in seconds, on-chain" },
];

const ROW_2 = [
  { ticker: "TSLA", img: "/trade/tsl2s.png", sub: "2× & inverse" },
  { ticker: "NVDA", img: "/trade/nvd3s.png", sub: "3× & inverse" },
  { ticker: "SPY",  img: "/trade/spy3s.png", sub: "3× & inverse" },
  { ticker: "TSLA", img: "/trade/tslss.png", sub: "Short" },
];

export function LandingWhy() {
  return (
    <section className="relative mx-auto max-w-[1280px] px-6 py-28">
      {/* Section eyebrow */}
      <div className="text-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-mint">
          Permissionless · 24/7 Trade · Pool of Reserves
        </span>
      </div>
      <h2 className="text-center text-4xl md:text-6xl font-bold text-white tracking-[-0.03em] leading-[0.95] mb-16">
        Two broken extremes.
        <br />
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #26C8B8 0%, #07638C 100%)" }}
        >
          One revolutionary fix.
        </span>
      </h2>

      {/* The problem strip (red) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
        <ProblemCard
          icon={<ShieldOff className="h-5 w-5" />}
          tag="1× spot stocks"
          title="Boring"
          body="Tesla moves 1.4% on a typical day. SPY moves 0.8%. For traders coming from crypto volatility, that's not a market — that's a savings account."
        />
        <ProblemCard
          icon={<ShieldOff className="h-5 w-5" />}
          tag="Perps & margin"
          title="Liquidating"
          body="A 3× perp on TSLA gets blown out by a routine 5% wick. Funding rates eat your edge. The brokerage equivalent margin-calls you at the worst moment."
        />
      </div>

      {/* Concept tile grid — row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {ROW_1.map((tile) => (
          <ConceptTile key={tile.label} {...tile} />
        ))}
      </div>

      {/* Concept tile grid — row 2 (token tickers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {ROW_2.map((tile, i) => (
          <TokenTile key={`${tile.ticker}-${i}`} {...tile} />
        ))}
      </div>

      {/* Bottom badges */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        <Badge icon={<Repeat className="h-5 w-5" />} title="Bi-directional" body="Long AND inverse on every market — same wallet, same chain." />
        <Badge icon={<Layers className="h-5 w-5" />} title="Tokenized, not collateralized" body="ERC-20s with NAV — never margin positions, never liquidations." />
        <Badge icon={<ShieldOff className="h-5 w-5" />} title="Zero forced closes" body="Worst case is the token's net asset value approaching zero." />
      </div>
    </section>
  );
}

function ProblemCard({
  icon, tag, title, body,
}: { icon: React.ReactNode; tag: string; title: string; body: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-destructive/25 bg-gradient-to-br from-destructive/10 via-card to-card p-8">
      <div className="absolute -top-20 -right-20 size-60 rounded-full bg-destructive/10 blur-3xl" />
      <div className="relative flex items-center gap-3 mb-5">
        <div className="size-10 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive/80">
          {tag}
        </span>
      </div>
      <div className="relative text-3xl font-bold text-white mb-3">{title}</div>
      <p className="relative text-sm text-foreground/65 leading-relaxed">{body}</p>
    </div>
  );
}

function ConceptTile({ glyph, label, sub }: { glyph: string; label: string; sub: string }) {
  return (
    <div className="relative aspect-square rounded-3xl border border-border bg-gradient-to-b from-card to-background p-6 overflow-hidden hover:border-mint/40 transition-colors group">
      {/* Mint corner glow */}
      <div className="absolute -bottom-16 -right-16 size-40 rounded-full bg-mint/5 blur-3xl group-hover:bg-mint/10 transition-colors" />
      <div className="relative h-full flex flex-col items-center justify-between text-center">
        <div className="flex-1 flex items-center justify-center w-full">
          <span
            className="text-6xl md:text-7xl font-bold text-white tracking-tighter"
            style={{
              backgroundImage: "linear-gradient(180deg, #EDEEEE 0%, #98A2B3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {glyph}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-sm font-semibold text-white">{label}</div>
          <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
        </div>
      </div>
      {/* Mint border accent on hover */}
      <div className="absolute inset-0 rounded-3xl border border-mint/0 group-hover:border-mint/30 transition-colors pointer-events-none" />
    </div>
  );
}

function TokenTile({ ticker, img, sub }: { ticker: string; img: string; sub: string }) {
  return (
    <div className="relative aspect-square rounded-3xl border border-mint/20 bg-gradient-to-br from-mint/[0.04] via-card to-card p-6 overflow-hidden hover:border-mint/50 transition-colors group">
      <div className="absolute -bottom-20 -right-20 size-48 rounded-full bg-mint/8 blur-3xl group-hover:bg-mint/15 transition-colors" />
      <div className="relative h-full flex flex-col items-center justify-center text-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={ticker} className="size-20 md:size-24 rounded-full object-cover drop-shadow-[0_0_30px_rgba(38,200,184,0.4)]" />
        <div>
          <div className="text-xl font-bold text-white">{ticker}</div>
          <div className="text-[11px] text-mint mt-0.5">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-mint/20 bg-mint/5 p-5 backdrop-blur">
      <div className="size-9 rounded-lg bg-mint/15 border border-mint/30 flex items-center justify-center text-mint mb-3">
        {icon}
      </div>
      <div className="font-semibold text-white text-sm mb-1">{title}</div>
      <p className="text-xs text-foreground/65 leading-relaxed">{body}</p>
    </div>
  );
}
