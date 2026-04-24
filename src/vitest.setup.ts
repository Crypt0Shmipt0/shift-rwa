/**
 * Global vitest setup for motion-related tests.
 * Mocks localStorage and matchMedia to simulate reduced-motion preferences.
 */

// Mock localStorage with shift:reducedMotion = true
const localStorageMock = (() => {
  const store: Record<string, string> = {
    "shift:reducedMotion": "true",
  };
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock window.matchMedia to report prefers-reduced-motion: reduce = true
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
