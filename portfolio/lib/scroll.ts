import Lenis from "lenis";

// Single shared Lenis instance for the whole site (smooth scrolling + anchor
// navigation). Created lazily by the SmoothScroll provider on the client.
let lenis: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    anchors: true, // smooth-scrolls in-page anchor links (navbar)
    autoRaf: true, // runs its own requestAnimationFrame loop
  });

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}