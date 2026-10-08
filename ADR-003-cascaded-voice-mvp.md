# ADR-003 — Cascaded Voice Pipeline for the MVP
Status: ACCEPTED in principle — baseline decision approved by Jark Pruden (baseline decisions #1–#5 approved); details open to review

## Context
Target experience is conversational voice with interruption. Realtime speech-to-speech APIs exist but are costly (billed per audio token, with prior context re-read each turn) and give less control over tool calls and transcripts. Wake word is a hard privacy/battery problem.

## Problem
Which voice architecture gives a real, testable MVP without locking the system in?

## Alternatives considered
1. Realtime speech-to-speech API from day one.
2. Cascaded STT → LLM → TTS with push-to-talk.
3. Browser-only speech APIs (device STT/TTS) with no server voice layer.
4. Wake word + always-on listening immediately.

## Decision
Option 2 for the MVP, behind a `VoiceBackend` interface so a `RealtimeVoiceBackend` can be added later without changing Core. Push-to-talk only; no wake word; no always-on mic.

## Advantages
Inspectable transcripts, per-stage swap and cost caps, tools stay under Core's policy, simpler privacy story, works with any text LLM.

## Disadvantages
Higher latency than speech-to-speech; no native full-duplex; prosody/emotion lost in transcription; three providers to manage.

## Consequences
Latency must be measured and optimized (streaming STT, sentence-level TTS). UI voice states come from backend events. Realtime remains a Phase 11 candidate.

## Reconsideration criteria
Revisit if measured latency is unacceptable after streaming optimizations, if realtime pricing/capabilities make it viable and policy-gated tool use is supported, or if users require full-duplex conversation.
