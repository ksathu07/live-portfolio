"use client";

import { useEffect } from "react";
import { initLenis, destroyLenis } from "@/lib/scroll";

// Mounts the shared Lenis smooth-scroll instance for the whole page.
export default function SmoothScroll() {
  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  return null;
}