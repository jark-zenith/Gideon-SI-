# ADR-003: Cascaded Voice MVP

## Decision
Start with STT → LLM → TTS.

## Reason
It is easier to debug, measure and cost-control than a fully realtime speech-to-speech system.

## Future
Realtime voice remains a pluggable backend.
