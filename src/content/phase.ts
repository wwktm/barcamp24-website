import { PHASES, announcement, type Phase } from './announcement';

/** Cumulative: true when the current phase is at or past `phase`. */
export function isActive(phase: Phase): boolean {
  return PHASES.indexOf(announcement.currentPhase) >= PHASES.indexOf(phase);
}
