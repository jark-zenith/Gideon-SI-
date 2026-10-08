# GIDEON SI — Voice Architecture

Status: DESIGN ONLY. **NOT YET IMPLEMENTED.** Wake word and always-on listening are explicitly out of scope until Phase 10.

## 1. MVP pipeline (cascaded, push-to-talk)
```
Microphone (user holds button/key)
   ↓
Speech-to-Text (streaming where possible)
   ↓
GIDEON Core  (context, policy, tools, memory)
   ↓
LLM (via provider abstraction)
   ↓
Text-to-Speech (streamed sentence by sentence)
   ↓
Audio Output
```
Why cascaded first: transcripts are inspectable and loggable (redacted), each stage is swappable and cost-capped, and tool calls remain under Core's control (ADR-003).

## 2. Interfaces (illustrative TypeScript; final language pending approval)
```ts
// What Core sees. Core knows nothing about audio.
interface TurnHandler {
  handleTurn(input: { sessionId: string; text: string; source: 'voice' | 'text' },
             signal: AbortSignal): AsyncIterable<CoreEvent>;   // token | tool_status | confirmation_request | done | error
}

// A voice backend turns audio into Core turns and Core events into audio.
interface VoiceBackend {
  start(session: VoiceSession, core: TurnHandler): Promise<void>;
  pushAudio(chunk: ArrayBuffer): void;      // user audio in
  endUserTurn(): void;                      // push-to-talk released
  interrupt(): void;                        // barge-in: stop speaking, abort generation
  on(event: 'transcript.partial' | 'transcript.final' | 'assistant.audio' |
            'state' | 'error', cb: (e: VoiceEvent) => void): void;
  stop(): Promise<void>;
}

interface SttProvider { transcribe(stream: AsyncIterable<ArrayBuffer>): AsyncIterable<Transcript>; }
interface TtsProvider { synthesize(text: AsyncIterable<string>, voice: VoiceId): AsyncIterable<ArrayBuffer>; }
```
- `CascadedVoiceBackend` = `SttProvider` + Core + `TtsProvider`. (MVP, PLANNED)
- `RealtimeVoiceBackend` = a speech-to-speech provider session. (FUTURE, PLANNED)
Both implement `VoiceBackend`; Core and the UI do not change when swapping.

## 3. Rules that apply to every backend (including future realtime)
1. **Tools never bypass Core.** If a realtime model proposes a tool call, it is forwarded to Core's policy engine as a proposal; the realtime provider never holds tool credentials.
2. Confirmation prompts are shown visually (and may be read aloud), but confirmation requires an explicit user action bound to the exact arguments — an ambiguous spoken "yeah" is not sufficient for SENSITIVE actions.
3. The same audit records are written regardless of backend.
4. Provider keys stay server-side; clients get short-lived session tokens (WebRTC/WebSocket auth).

## 4. Interruption (barge-in)
User presses the button while GIDEON speaks → client stops playback immediately → `interrupt()` → server aborts LLM/TTS streams → state returns to listening. Required test: no audio continues after interrupt.

## 5. UI state events
`idle | listening | transcribing | thinking | tool_running(name) | speaking | alert | error`. States are emitted from real backend events; the UI never fakes a state.

## 6. Privacy
Mic only active while the button is held. Visible mic indicator. Audio not stored by default; transcripts stored only as part of conversation history under the user's controls. Provider data-retention settings must be reviewed before enabling any provider. Wake word (Phase 10) must run on-device with no audio leaving the device before detection.

## 7. Open items
STT provider, TTS provider and voice identity (original male, mature, calm voice — no imitation of any actor) need Jark's approval. Measure end-to-end latency in Phase 4 and record it here.
