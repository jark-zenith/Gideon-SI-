# ADR-003 — Cascaded Voice MVP

## Context

GIDEON needs voice, but the first voice implementation must be debuggable, observable and provider-replaceable.

## Problem

Should MVP voice use direct realtime speech-to-speech or a cascaded pipeline?

## Alternatives considered

### A. Realtime speech-to-speech first
Potentially lower latency and more natural, but harder to debug and introduces tighter provider/session coupling.

### B. Cascaded STT → LLM → TTS
More explicit boundaries, easier testing, easier provider substitution and clearer cost measurement.

## Decision

Use push-to-talk with:

```
Microphone → STT → GIDEON Core → LLM → TTS → Audio
```

Realtime speech-to-speech remains a future pluggable backend.

## Advantages

- clear failure boundaries;
- easier automated testing;
- easier provider replacement;
- explicit transcript and model stages;
- no always-on microphone requirement.

## Disadvantages

- additional latency;
- less naturally interruptible than a mature realtime stack;
- separate STT/TTS costs.

## Consequences

Voice adapters must not become part of Core. Core consumes normalized text and returns normalized assistant responses.

## Future reconsideration criteria

Reconsider when latency, interruption and naturalness requirements justify realtime speech-to-speech and privacy/provider constraints have been evaluated.
