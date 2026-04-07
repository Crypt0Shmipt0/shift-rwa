/* Shared OG image helpers — all generated via next/og ImageResponse. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

/** Brand tokens (must stay in sync with globals.css) */
export const BRAND = {
  bg: "#021C24",         // Midnight
  card: "#0A2730",
  mint: "#26C8B8",       // Protocol Mint
  tidalSteel: "#07638C", // Tidal Steel (Adjusted)
  offWhite: "#EDEEEE",
  mist: "#98A2B3",
  border: "#123642",
};

let cachedFonts: { regular: Buffer; bold: Buffer } | null = null;

async function loadFonts() {
  if (cachedFonts) return cachedFonts;
  const dir = path.join(process.cwd(), "src", "lib", "fonts");
  const [regular, bold] = await Promise.all([
    readFile(path.join(dir, "SpaceGrotesk-Regular.ttf")),
    readFile(path.join(dir, "SpaceGrotesk-Bold.ttf")),
  ]);
  cachedFonts = { regular, bold };
  return cachedFonts;
}

type OgCardProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Small stat chips rendered top-right */
  chips?: Array<{ label: string; value: string; positive?: boolean }>;
  /** Big mono number rendered right side (e.g., a price) */
  bigNumber?: string;
  accent?: string; // override mint
};

function ShiftLogoMark({ size = 64 }: { size?: number }) {
  // Inline SVG of the SHIFT mark — two stacked chevrons with brand gradient
  return (
    <svg width={size} height={size * 0.68} viewBox="0 0 29 19.8" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="og-shift-g1" x1="14.5" x2="14.5" y1="0" y2="19.8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#26C8B8" />
          <stop offset="1" stopColor="#07638C" />
        </linearGradient>
      </defs>
      <path
        d="M0 10.2L5.2 19.8L10.8 9.6H23.8L29 0H5.6L0 10.2Z"
        fill="url(#og-shift-g1)"
      />
    </svg>
  );
}

function OgCard({ eyebrow, title, subtitle, chips, bigNumber, accent }: OgCardProps) {
  const mint = accent ?? BRAND.mint;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: BRAND.bg,
        fontFamily: '"Space Grotesk", sans-serif',
        position: "relative",
        padding: 64,
      }}
    >
      {/* Mint radial glow top-right */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: 9999,
          background: `radial-gradient(circle, ${mint}22 0%, transparent 60%)`,
          display: "flex",
        }}
      />
      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${BRAND.border}33 1px, transparent 1px), linear-gradient(90deg, ${BRAND.border}33 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          display: "flex",
        }}
      />

      {/* Header — logo + wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ShiftLogoMark size={72} />
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: -1,
            color: BRAND.offWhite,
            lineHeight: 1,
            display: "flex",
          }}
        >
          SHIFT
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 999,
            border: `1px solid ${mint}55`,
            background: `${mint}15`,
            fontSize: 18,
            color: mint,
            fontWeight: 500,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: 999, background: mint, display: "flex" }} />
          shift.finance
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 48,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            flex: 1,
            maxWidth: bigNumber ? 620 : 1000,
          }}
        >
          {eyebrow && (
            <div
              style={{
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: mint,
                display: "flex",
              }}
            >
              {eyebrow}
            </div>
          )}
          <div
            style={{
              fontSize: bigNumber ? 72 : 88,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 0.95,
              color: BRAND.offWhite,
              display: "flex",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 1.3,
                color: BRAND.mist,
                display: "flex",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Big number — right column */}
        {bigNumber && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: 104,
                fontWeight: 700,
                letterSpacing: -4,
                lineHeight: 0.9,
                color: BRAND.offWhite,
                fontVariantNumeric: "tabular-nums",
                display: "flex",
              }}
            >
              {bigNumber}
            </div>
          </div>
        )}
      </div>

      {/* Chip row */}
      {chips && chips.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 32,
            position: "relative",
          }}
        >
          {chips.map((c) => (
            <div
              key={c.label}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "16px 24px",
                borderRadius: 16,
                background: BRAND.card,
                border: `1px solid ${BRAND.border}`,
                minWidth: 160,
              }}
            >
              <div style={{ fontSize: 14, color: BRAND.mist, textTransform: "uppercase", letterSpacing: 1, display: "flex" }}>
                {c.label}
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: c.positive === false ? "#FF4D6A" : c.positive === true ? mint : BRAND.offWhite,
                  marginTop: 4,
                  fontVariantNumeric: "tabular-nums",
                  display: "flex",
                }}
              >
                {c.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 18,
          color: BRAND.mist,
          borderTop: `1px solid ${BRAND.border}`,
          paddingTop: 20,
        }}
      >
        <div style={{ display: "flex" }}>Trade tokenized stocks · 24/7 · on-chain</div>
        <div style={{ display: "flex" }}>SHIFT Finance</div>
      </div>
    </div>
  );
}

export async function renderOg(props: OgCardProps) {
  const { regular, bold } = await loadFonts();
  return new ImageResponse(<OgCard {...props} />, {
    ...OG_SIZE,
    fonts: [
      { name: "Space Grotesk", data: regular, weight: 400, style: "normal" },
      { name: "Space Grotesk", data: bold, weight: 700, style: "normal" },
    ],
  });
}
