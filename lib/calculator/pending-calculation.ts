import type { Subject } from "@/types/calculator";

const STORAGE_KEY = "gwa:pending-calculation";

export interface PendingCalculation {
  subjects: Subject[];
  gradingSystemId: string;
}

/**
 * Guest calculations never leave the device unless the user chooses to save.
 * This only ever touches sessionStorage (cleared when the tab closes) and is
 * used purely to carry a draft across the login/register redirect — it is
 * never sent anywhere automatically.
 */
export function stashPendingCalculation(data: PendingCalculation): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage can fail in private browsing modes; saving is best-effort.
  }
}

export function readPendingCalculation(): PendingCalculation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingCalculation;
  } catch {
    return null;
  }
}

export function clearPendingCalculation(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
