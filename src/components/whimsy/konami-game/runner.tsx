"use client";

import { useEffect, useRef, useState } from "react";
import {
  BEAR,
  COIN,
  LIQ_FLAG,
  PERP_CANDLE,
  SHIFT_DUCK,
  SHIFT_MARK,
  drawSprite,
  spriteHeight,
  spriteWidth,
} from "./sprites";
import { sfx, unlockAudio } from "./sound";

const LOGICAL_W = 800;
const LOGICAL_H = 300;
const GROUND_Y = 240; // top of the ground line in logical px
const PLAYER_X = 90;
const GRAVITY = 0.55;
const JUMP_VELOCITY = -11;
const DUCK_JUMP_VELOCITY = -8;
const FIXED_DT = 1000 / 60;
const HISCORE_KEY = "shift:konami:hiscore";

type ObstacleKind = "flag" | "bear" | "candle";
type PowerupKind = "coin";

type Obstacle = {
  id: number;
  kind: ObstacleKind;
  x: number;
  y: number;
  w: number;
  h: number;
  vy?: number; // for falling candles
};

type Powerup = {
  id: number;
  kind: PowerupKind;
  x: number;
  y: number;
  w: number;
  h: number;
  collected: boolean;
};

type GameState = {
  running: boolean;
  gameOver: boolean;
  score: number;
  hiscore: number;
  speed: number;
  playerY: number;
  playerVy: number;
  ducking: boolean;
  obstacles: Obstacle[];
  powerups: Powerup[];
  spawnTimer: number;
  coinTimer: number;
  groundOffset: number;
  newHigh: boolean;
  nextId: number;
  shake: number;
};

function initialState(hiscore: number): GameState {
  return {
    running: true,
    gameOver: false,
    score: 0,
    hiscore,
    speed: 5,
    playerY: GROUND_Y - spriteHeight(SHIFT_MARK, 2),
    playerVy: 0,
    ducking: false,
    obstacles: [],
    powerups: [],
    spawnTimer: 60,
    coinTimer: 180,
    groundOffset: 0,
    newHigh: false,
    nextId: 1,
    shake: 0,
  };
}

function aabb(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export type RunnerProps = {
  muted: boolean;
  /** When true, hide on-canvas restart prompt — overlay shows its own. */
  hideOverlayHints?: boolean;
};

/**
 * SHIFT Runner — chrome-dinosaur clone, SHIFT-skinned.
 * Pure 2D canvas, fixed-timestep loop, pauses on tab hide, no engine.
 */
export function Runner({ muted }: RunnerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(initialState(0));
  const mutedRef = useRef(muted);
  const rafRef = useRef<number | null>(null);
  const accumRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const visibleRef = useRef(true);

  const [, force] = useState(0);
  const rerender = () => force((n) => (n + 1) & 0xffff);

  // Keep latest muted in a ref so the loop sees it without re-binding.
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Load hiscore once.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(HISCORE_KEY);
      const hi = raw ? parseInt(raw, 10) : 0;
      if (!Number.isNaN(hi)) {
        stateRef.current.hiscore = hi;
        rerender();
      }
    } catch {
      // ignore
    }
  }, []);

  // Resize canvas for HiDPI but keep logical 800×300 coordinates.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(
        canvas.width / LOGICAL_W,
        0,
        0,
        canvas.height / LOGICAL_H,
        0,
        0,
      );
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Visibility pause.
  useEffect(() => {
    const onVis = () => {
      visibleRef.current = !document.hidden;
      if (document.hidden) {
        lastTsRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const restart = () => {
    stateRef.current = initialState(stateRef.current.hiscore);
    if (!mutedRef.current) sfx.start();
    rerender();
  };

  // Inputs
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        if (s.gameOver) {
          // R/Space restarts.
          e.preventDefault();
          restart();
          return;
        }
        if (s.playerY >= GROUND_Y - spriteHeight(SHIFT_MARK, 2) - 1) {
          e.preventDefault();
          s.playerVy = s.ducking ? DUCK_JUMP_VELOCITY : JUMP_VELOCITY;
          s.ducking = false;
          if (!mutedRef.current) {
            unlockAudio();
            sfx.jump();
          }
        }
      } else if (e.key === "ArrowDown" || e.key === "s") {
        e.preventDefault();
        if (!s.gameOver) {
          s.ducking = true;
          // Hard-drop while airborne for a satisfying thud.
          if (s.playerY < GROUND_Y - spriteHeight(SHIFT_MARK, 2) - 1) {
            s.playerVy = Math.max(s.playerVy, 8);
          }
        }
      } else if (e.key === "r" || e.key === "R") {
        if (s.gameOver) {
          e.preventDefault();
          restart();
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "s") {
        stateRef.current.ducking = false;
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // Mobile touch — tap-to-jump on the canvas itself.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      if (s.gameOver) {
        restart();
        return;
      }
      if (s.playerY >= GROUND_Y - spriteHeight(SHIFT_MARK, 2) - 1) {
        s.playerVy = JUMP_VELOCITY;
        if (!mutedRef.current) {
          unlockAudio();
          sfx.jump();
        }
      }
    };
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    return () => canvas.removeEventListener("touchstart", onTouch);
  }, []);

  // Main loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = (ts: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (!visibleRef.current) {
        lastTsRef.current = null;
        return;
      }
      if (lastTsRef.current == null) {
        lastTsRef.current = ts;
        return;
      }
      const delta = Math.min(ts - lastTsRef.current, 100);
      lastTsRef.current = ts;
      accumRef.current += delta;

      while (accumRef.current >= FIXED_DT) {
        step();
        accumRef.current -= FIXED_DT;
      }

      render(ctx);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Simulation ----
  function step() {
    const s = stateRef.current;
    if (s.gameOver) return;

    // Score & speed ramp.
    s.score += 1;
    if (s.score % 500 === 0) s.speed = Math.min(s.speed + 0.5, 13);

    // Physics.
    s.playerVy += GRAVITY;
    s.playerY += s.playerVy;
    const sprite = s.ducking ? SHIFT_DUCK : SHIFT_MARK;
    const playerH = spriteHeight(sprite, 2);
    if (s.playerY > GROUND_Y - playerH) {
      s.playerY = GROUND_Y - playerH;
      s.playerVy = 0;
    }

    // Move ground/world.
    s.groundOffset = (s.groundOffset + s.speed) % 24;

    // Spawn obstacles.
    s.spawnTimer -= 1;
    if (s.spawnTimer <= 0) {
      const r = Math.random();
      let kind: ObstacleKind = "flag";
      if (r < 0.4) kind = "flag";
      else if (r < 0.75) kind = "bear";
      else kind = "candle";
      spawnObstacle(s, kind);
      // Faster spawns at higher speeds.
      const minGap = Math.max(45, 110 - s.speed * 4);
      const variance = 60;
      s.spawnTimer = minGap + Math.floor(Math.random() * variance);
    }

    // Spawn coins occasionally.
    s.coinTimer -= 1;
    if (s.coinTimer <= 0) {
      spawnCoin(s);
      s.coinTimer = 220 + Math.floor(Math.random() * 200);
    }

    // Update obstacles.
    for (const o of s.obstacles) {
      o.x -= s.speed;
      if (o.kind === "candle") {
        o.vy = (o.vy ?? 0) + 0.15;
        o.y += o.vy;
      }
    }
    s.obstacles = s.obstacles.filter((o) => o.x + o.w > -10 && o.y < LOGICAL_H + 20);

    // Update coins.
    for (const c of s.powerups) c.x -= s.speed;
    s.powerups = s.powerups.filter(
      (c) => !c.collected && c.x + c.w > -10,
    );

    // Collision player vs obstacles. Use slightly inset hitboxes for fairness.
    const px = PLAYER_X + 4;
    const py = s.playerY + 4;
    const pw = spriteWidth(sprite, 2) - 8;
    const ph = playerH - 6;

    for (const o of s.obstacles) {
      if (aabb(px, py, pw, ph, o.x + 2, o.y + 2, o.w - 4, o.h - 4)) {
        s.gameOver = true;
        s.shake = 14;
        if (!mutedRef.current) sfx.liquidate();
        if (s.score > s.hiscore) {
          s.hiscore = s.score;
          s.newHigh = true;
          try {
            window.localStorage.setItem(HISCORE_KEY, String(s.score));
          } catch {
            // ignore
          }
          if (!mutedRef.current) sfx.hiscore();
        }
        rerender();
        return;
      }
    }

    // Coin pickups.
    for (const c of s.powerups) {
      if (
        !c.collected &&
        aabb(px, py, pw, ph, c.x, c.y, c.w, c.h)
      ) {
        c.collected = true;
        s.score += 100;
        if (!mutedRef.current) sfx.coin();
      }
    }

    if (s.shake > 0) s.shake -= 1;
  }

  function spawnObstacle(s: GameState, kind: ObstacleKind) {
    let w = 24;
    let h = 32;
    let y = GROUND_Y - h;
    if (kind === "flag") {
      w = spriteWidth(LIQ_FLAG, 2);
      h = spriteHeight(LIQ_FLAG, 2);
      y = GROUND_Y - h;
    } else if (kind === "bear") {
      w = spriteWidth(BEAR, 2);
      h = spriteHeight(BEAR, 2);
      y = GROUND_Y - h;
    } else if (kind === "candle") {
      w = spriteWidth(PERP_CANDLE, 2);
      h = spriteHeight(PERP_CANDLE, 2);
      y = -h - Math.floor(Math.random() * 60);
    }
    s.obstacles.push({
      id: s.nextId++,
      kind,
      x: LOGICAL_W + 20,
      y,
      w,
      h,
      vy: kind === "candle" ? 1 : undefined,
    });
  }

  function spawnCoin(s: GameState) {
    const w = spriteWidth(COIN, 2);
    const h = spriteHeight(COIN, 2);
    // Place at a height a normal jump can reach.
    const y = GROUND_Y - h - 60 - Math.floor(Math.random() * 50);
    s.powerups.push({
      id: s.nextId++,
      kind: "coin",
      x: LOGICAL_W + 20,
      y,
      w,
      h,
      collected: false,
    });
  }

  // ---- Render ----
  function render(ctx: CanvasRenderingContext2D) {
    const s = stateRef.current;

    // Shake offset.
    const sx = s.shake > 0 ? (Math.random() - 0.5) * s.shake : 0;
    const sy = s.shake > 0 ? (Math.random() - 0.5) * s.shake : 0;

    // Clear / background.
    ctx.fillStyle = "#021C24";
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

    // Trading-floor parallax grid.
    drawGrid(ctx, s.groundOffset);

    ctx.save();
    ctx.translate(sx, sy);

    // Ground line.
    ctx.fillStyle = "#07638C";
    ctx.fillRect(0, GROUND_Y, LOGICAL_W, 2);
    ctx.fillStyle = "#094058";
    ctx.fillRect(0, GROUND_Y + 2, LOGICAL_W, 6);

    // Tickmarks scrolling along the ground.
    ctx.fillStyle = "#0EA899";
    for (let x = -s.groundOffset; x < LOGICAL_W; x += 24) {
      ctx.fillRect(x, GROUND_Y + 4, 8, 2);
    }

    // Coins.
    for (const c of s.powerups) {
      if (c.collected) continue;
      drawSprite(ctx, COIN, c.x, c.y, 2);
    }

    // Obstacles.
    for (const o of s.obstacles) {
      if (o.kind === "flag") drawSprite(ctx, LIQ_FLAG, o.x, o.y, 2);
      else if (o.kind === "bear") drawSprite(ctx, BEAR, o.x, o.y, 2);
      else if (o.kind === "candle") drawSprite(ctx, PERP_CANDLE, o.x, o.y, 2);
    }

    // Player.
    const sprite = s.ducking ? SHIFT_DUCK : SHIFT_MARK;
    drawSprite(ctx, sprite, PLAYER_X, s.playerY, 2);

    ctx.restore();

    // HUD overlays handled in React — keep canvas clean.
    if (s.gameOver) {
      ctx.fillStyle = "rgba(2, 28, 36, 0.78)";
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
      ctx.fillStyle = "#E5484D";
      ctx.font = "bold 36px monospace";
      ctx.textAlign = "center";
      ctx.fillText("LIQUIDATED", LOGICAL_W / 2, LOGICAL_H / 2 - 24);
      ctx.fillStyle = "#26C8B8";
      ctx.font = "bold 18px monospace";
      ctx.fillText(
        `SCORE  ${pad(s.score, 5)}   HI  ${pad(s.hiscore, 5)}`,
        LOGICAL_W / 2,
        LOGICAL_H / 2 + 8,
      );
      ctx.fillStyle = "#E6FFFB";
      ctx.font = "12px monospace";
      ctx.fillText(
        "PRESS  SPACE  OR  R  TO  RETRY",
        LOGICAL_W / 2,
        LOGICAL_H / 2 + 38,
      );
      if (s.newHigh) {
        ctx.fillStyle = "#F5D547";
        ctx.font = "bold 14px monospace";
        ctx.fillText("★ NEW HIGH SCORE ★", LOGICAL_W / 2, LOGICAL_H / 2 + 62);
      }
    }
  }

  function drawGrid(ctx: CanvasRenderingContext2D, offset: number) {
    ctx.strokeStyle = "rgba(38, 200, 184, 0.07)";
    ctx.lineWidth = 1;
    // Vertical lines (scrolling).
    for (let x = -offset; x < LOGICAL_W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GROUND_Y);
      ctx.stroke();
    }
    // Horizontal lines.
    for (let y = 60; y < GROUND_Y; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(LOGICAL_W, y);
      ctx.stroke();
    }
  }

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        className="block w-full h-auto bg-[#021C24] [image-rendering:pixelated]"
        style={{ aspectRatio: `${LOGICAL_W} / ${LOGICAL_H}` }}
        aria-label="SHIFT Runner mini-game"
        role="img"
      />
    </div>
  );
}

function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}

export { HISCORE_KEY, pad as padScore };
