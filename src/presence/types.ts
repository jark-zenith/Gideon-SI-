export type GideonPresenceState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "SPEAKING"
  | "TOOL_EXECUTION"
  | "ALERT";

export interface GideonPresenceSnapshot {
  state: GideonPresenceState;
  detail: string;
  responseText?: string;
  activity?: string;
}

export interface GideonPresenceController {
  getSnapshot(): GideonPresenceSnapshot;
  setState(state: GideonPresenceState, detail: string, activity?: string): GideonPresenceSnapshot;
}