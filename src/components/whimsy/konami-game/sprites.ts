/**
 * Pixel-art sprite definitions for SHIFT Runner.
 *
 * Each sprite is a 2D grid of single-character codes that map to a small
 * palette. We blit them as solid rects with `fillRect` — no images, no
 * smoothing, no asset loading. Edit a string, edit a sprite.
 *
 * Palette codes:
 *   .  → transparent
 *   M  → mint (#26C8B8)
 *   D  → dark mint highlight (#0EA899)
 *   S  → tidal steel (#07638C)
 *   N  → midnight (#021C24)
 *   R  → danger red (#E5484D)
 *   r  → dark red (#A82029)
 *   W  → white-ish (#E6FFFB)
 *   Y  → coin yellow (#F5D547)
 *   y  → coin yellow shadow (#C9A920)
 */

export const PALETTE: Record<string, string> = {
  M: "#26C8B8",
  D: "#0EA899",
  S: "#07638C",
  N: "#021C24",
  R: "#E5484D",
  r: "#A82029",
  W: "#E6FFFB",
  Y: "#F5D547",
  y: "#C9A920",
};

export type Sprite = string[];

// 16×16 SHIFT mark — chunky "S" with a mint outline. Reads at small sizes.
export const SHIFT_MARK: Sprite = [
  "................",
  "....MMMMMMMM....",
  "...MDDDDDDDDM...",
  "..MDDNNNNNNDDM..",
  ".MDDN......NDDM.",
  ".MDDN.......DDM.",
  ".MDDN........DM.",
  ".MDDDMMMMMD..DM.",
  ".MD..DDDDDDM.DM.",
  ".MD........DMDM.",
  ".MD.........DDM.",
  ".MDDN.......NDM.",
  ".MDDN......NDDM.",
  "..MDDNNNNNNDDM..",
  "...MDDDDDDDDM...",
  "....MMMMMMMM....",
];

// Ducking SHIFT — wider, shorter (16w × 10h). Renders crouched.
export const SHIFT_DUCK: Sprite = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "...MMMMMMMMMM...",
  "..MDDDDDDDDDDM..",
  ".MDDNMMMMMMNDDM.",
  ".MDDNDDDDDDNDDM.",
  "..MDDDDDDDDDDM..",
];

// Liquidation flag — red triangle on a dark pole. 12w × 16h.
export const LIQ_FLAG: Sprite = [
  "...N........",
  "...NRRRRRR..",
  "...NRrrrrR..",
  "...NRrRRrR..",
  "...NRrR.rR..",
  "...NRrR.rR..",
  "...NRrrrrR..",
  "...NRRRRR...",
  "...N........",
  "...N........",
  "...N........",
  "...N........",
  "...N........",
  "...N........",
  "...N........",
  "..NNNN......",
];

// Bear icon — small grumpy red square with eyes. 14w × 14h.
export const BEAR: Sprite = [
  "..............",
  "..rr......rr..",
  ".rRRr....rRRr.",
  ".rRRRrrrrRRRr.",
  ".rRRRRRRRRRRr.",
  ".rRRWNRRNWRRr.",
  ".rRRRRRRRRRRr.",
  ".rRRRRNNRRRRr.",
  ".rRRNNRRNNRRr.",
  ".rRRRRRRRRRRr.",
  "..rRRRRRRRRr..",
  "...rrRRRRrr...",
  ".....rrrr.....",
  "..............",
];

// Falling perp candle — red body with dark wick. 8w × 18h.
export const PERP_CANDLE: Sprite = [
  "...NN...",
  "...NN...",
  "..rRRr..",
  ".rRRRRr.",
  ".rRRRRr.",
  ".rRRRRr.",
  ".rRRRRr.",
  ".rRRRRr.",
  ".rRRRRr.",
  ".rRRRRr.",
  ".rRRRRr.",
  ".rRRRRr.",
  ".rRRRRr.",
  ".rRRRRr.",
  "..rRRr..",
  "...NN...",
  "...NN...",
  "...NN...",
];

// Coin — mint/yellow octagon with sparkle. 10w × 10h.
export const COIN: Sprite = [
  "..YYYYYY..",
  ".YyyMMyyY.",
  "YyMMWWMMyY",
  "YyMWWMMMyY",
  "YyMMMMMMyY",
  "YyMMMMMMyY",
  "YyMMMMMMyY",
  "YyMMMMMMyY",
  ".YyyMMyyY.",
  "..YYYYYY..",
];

/** Blit a sprite at (x, y) with each cell rendered as `scale`×`scale` px. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
  scale = 1,
) {
  for (let row = 0; row < sprite.length; row++) {
    const line = sprite[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      const color = PALETTE[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
    }
  }
}

export function spriteWidth(sprite: Sprite, scale = 1) {
  return (sprite[0]?.length ?? 0) * scale;
}

export function spriteHeight(sprite: Sprite, scale = 1) {
  return sprite.length * scale;
}
