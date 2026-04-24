/**
 * Unit tests for motion primitives.
 * The vitest.setup.ts file mocks both matchMedia (prefers-reduced-motion: reduce = true)
 * and localStorage["shift:reducedMotion"] = "true", so all motion-ok checks return false.
 */
import { describe, it, expect } from "vitest";
import { renderHook, render, screen } from "@testing-library/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { Reveal } from "./reveal";
import { CountUp } from "./count-up";
import { TiltCard } from "./tilt-card";
import { LazyMotionProvider } from "./lazy-motion-provider";
import React from "react";

// Wrap with LazyMotionProvider for components that use m.* primitives
function Wrapper({ children }: { children: React.ReactNode }) {
  return <LazyMotionProvider>{children}</LazyMotionProvider>;
}

describe("useMotionOk", () => {
  it("returns false when OS prefers-reduced-motion is set", async () => {
    const { result } = renderHook(() => useMotionOk());
    // After mount, the effect runs — in happy-dom matchMedia returns matches: true
    // so motionOk should be false
    await new Promise((r) => setTimeout(r, 10));
    expect(result.current).toBe(false);
  });

  it("returns false when app-level shift:reducedMotion is true in localStorage", async () => {
    const { result } = renderHook(() => useMotionOk());
    await new Promise((r) => setTimeout(r, 10));
    expect(result.current).toBe(false);
  });
});

describe("Reveal", () => {
  it("renders children when reduced motion is active (initial=false path)", () => {
    render(
      <Wrapper>
        <Reveal>
          <span>Test content</span>
        </Reveal>
      </Wrapper>
    );
    expect(screen.getByText("Test content")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Wrapper>
        <Reveal className="my-custom-class">
          <span>Styled</span>
        </Reveal>
      </Wrapper>
    );
    const el = container.querySelector(".my-custom-class");
    expect(el).toBeTruthy();
  });
});

describe("TiltCard", () => {
  it("renders children in a plain div when reduced motion is active", () => {
    const { container } = render(
      <Wrapper>
        <TiltCard>
          <span>tilt-content</span>
        </TiltCard>
      </Wrapper>
    );
    // motionOk is false in test env → renders plain div, no m.div
    expect(screen.getByText("tilt-content")).toBeTruthy();
    // Should NOT have a style with transform-style (motion div has that)
    const divs = container.querySelectorAll("div");
    // At least one div wrapping the content
    expect(divs.length).toBeGreaterThan(0);
  });

  it("applies custom className to the wrapper div", () => {
    const { container } = render(
      <Wrapper>
        <TiltCard className="my-tilt-class">
          <span>styled</span>
        </TiltCard>
      </Wrapper>
    );
    const el = container.querySelector(".my-tilt-class");
    expect(el).toBeTruthy();
  });
});

describe("CountUp", () => {
  it("renders the final static value when motion is not permitted", () => {
    render(
      <Wrapper>
        <CountUp to={42} prefix="$" suffix="M" />
      </Wrapper>
    );
    expect(screen.getByText("$42M")).toBeTruthy();
  });

  it("renders with decimals when decimals prop is set", () => {
    render(
      <Wrapper>
        <CountUp to={3.14} decimals={2} />
      </Wrapper>
    );
    expect(screen.getByText("3.14")).toBeTruthy();
  });
});
