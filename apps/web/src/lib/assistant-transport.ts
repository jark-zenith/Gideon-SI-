/**
 * Browser-to-server transport contract for the future GIDEON Core HTTP adapter.
 * This module deliberately does not call the model provider or expose credentials.
 * A server endpoint must authenticate the session and invoke GideonCore; browser input
 * must never supply trusted scopes, user IDs, or confirmation decisions.
 */
export type AssistantTurnRequest = {
  text: string;
  conversationId?: string;
};

export type AssistantTurnResponse = {
  text: string;
  conversationId: string;
  stoppedReason: "complete" | "confirmation_required" | "max_steps";
  pendingConfirmation?: {
    tool: string;
    confirmationId: string;
    expiresAt: number;
    summary: string;
  };
};

export async function requestAssistantTurn(
  input: AssistantTurnRequest,
  fetcher: typeof fetch = fetch,
): Promise<AssistantTurnResponse> {
  const response = await fetcher("/api/assistant/turn", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "GIDEON Core API is not connected in this build."
        : `GIDEON Core request failed (${response.status}).`,
    );
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !("text" in payload) ||
      typeof payload.text !== "string" || !("conversationId" in payload) ||
      typeof payload.conversationId !== "string") {
    throw new Error("GIDEON Core returned an invalid response.");
  }
  return payload as AssistantTurnResponse;
}
