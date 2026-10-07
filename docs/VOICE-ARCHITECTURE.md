# GIDEON SI — Voice Architecture

## 1. MVP decision

GIDEON uses **push-to-talk** and a cascaded voice pipeline for the MVP.

```
Microphone
    ↓
Speech-to-Text
    ↓
GIDEON Core
    ↓
LLM / Model Provider
    ↓
Text-to-Speech
    ↓
Audio Output
```

## 2. Voice responsibilities

### Microphone adapter

Responsibilities:
- request browser/device microphone permission;
- capture audio only during an active push-to-talk turn;
- stop capture deterministically;
- expose recording state to the UI.

Always-on listening is **NOT YET IMPLEMENTED**.

### Speech-to-Text

Converts the captured utterance into normalized text.

The STT provider must be replaceable and must not become part of GIDEON Core's business logic.

### GIDEON Core

Receives normalized text exactly as if it came from the text client.

Voice must not create a separate reasoning architecture.

### Text-to-Speech

Converts the final assistant response to audio.

The TTS adapter should expose normalized lifecycle events such as:
- starting;
- speaking;
- completed;
- failed;
- cancelled.

## 3. State model

Expected client states:

```
IDLE
 ↓
LISTENING
 ↓
PROCESSING
 ↓
SPEAKING
 ↓
IDLE
```

Errors return to a safe idle/error state.

## 4. Future realtime backend

A future speech-to-speech provider may replace the cascaded pipeline.

The abstraction should separate:
- audio transport;
- speech recognition;
- model interaction;
- audio synthesis;
- interruption;
- session lifecycle.

The realtime backend must still obey GIDEON's authentication, policy, tool and audit boundaries.

It must not gain privileged tool execution merely because audio is realtime.

## 5. Deferred features

The following are explicitly deferred:
- wake word;
- always-on microphone;
- background audio transmission;
- Android voice control;
- desktop voice control.

These require separate privacy, platform and abuse analysis.

## 6. Voice privacy requirements

- Microphone access must be explicit.
- Push-to-talk must have a visible active state.
- Audio retention must be minimized.
- Provider-side retention policies must be understood before production use.
- Errors must not silently leave the microphone active.

## 7. Current status

Voice is **PLANNED / NOT YET IMPLEMENTED** on this foundation branch.
