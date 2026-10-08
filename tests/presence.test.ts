import { describe, expect, it } from "vitest";
import { PresenceStateMachine } from "../src/presence/state-machine.js";

describe("GIDEON presence state machine", () => {
  it("starts idle", () => {
    expect(new PresenceStateMachine().getSnapshot()).toMatchObject({ state: "IDLE", detail: "STANDING BY" });
  });
  it("allows the MVP voice interaction path", () => {
    const presence = new PresenceStateMachine();
    presence.setState("LISTENING", "MICROPHONE ACTIVE");
    presence.setState("THINKING", "VOICE INPUT CAPTURED");
    presence.setState("SPEAKING", "GENERATING AUDIO");
    expect(presence.getSnapshot().state).toBe("SPEAKING");
  });
  it("rejects unsafe state jumps", () => {
    const presence = new PresenceStateMachine();
    expect(() => presence.setState("TOOL_EXECUTION", "RUNNING TOOL")).toThrow("Invalid GIDEON presence transition");
  });
});