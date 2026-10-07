# GIDEON SI Voice Architecture

## MVP
Microphone → Speech-to-Text → GIDEON Core → LLM → Text-to-Speech → Audio Output.

## Design goals
- Natural conversational timing.
- Push-to-talk first.
- Interruptible architecture where the selected providers support it.
- Server-side credentials.
- Clear listening/thinking/speaking state.
- Provider-independent interfaces.

## Future
A realtime speech-to-speech backend may replace the cascaded pipeline behind the same voice interface.

## Deferred
Always-on listening and wake word are explicitly deferred until privacy, battery and platform constraints are evaluated.
