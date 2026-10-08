import type { GideonPresenceController, GideonPresenceSnapshot, GideonPresenceState } from "./types.js";

const allowedTransitions: Record<GideonPresenceState, readonly GideonPresenceState[]> = {
  IDLE: ["LISTENING", "THINKING", "ALERT"],
  LISTENING: ["IDLE", "THINKING", "ALERT"],
  THINKING: ["SPEAKING", "TOOL_EXECUTION", "IDLE", "ALERT"],
  SPEAKING: ["LISTENING", "IDLE", "ALERT"],
  TOOL_EXECUTION: ["THINKING", "SPEAKING", "IDLE", "ALERT"],
  ALERT: ["IDLE", "LISTENING"],
};

export class PresenceStateMachine implements GideonPresenceController {
  private snapshot: GideonPresenceSnapshot = { state: "IDLE", detail: "STANDING BY" };

  getSnapshot(): GideonPresenceSnapshot { return { ...this.snapshot }; }

  setState(state: GideonPresenceState, detail: string, activity?: string): GideonPresenceSnapshot {
    const current = this.snapshot.state;
    if (current !== state && !allowedTransitions[current].includes(state)) {
      throw new Error("Invalid GIDEON presence transition: " + current + " -> " + state);
    }
    this.snapshot = { state, detail, ...(activity ? { activity } : {}) };
    return this.getSnapshot();
  }
}