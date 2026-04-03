"use client";
import { useState, useEffect } from "react";

/**
 * Returns `true` for ~1.2 seconds after mount, then switches to `false`.
 * Use this to show skeleton loading states on navigation.
 */
export function useFakeLoading(delayMs = 1200): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return loading;
}
