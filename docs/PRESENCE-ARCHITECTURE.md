# GIDEON SI Presence Architecture

Status: FOUNDATION / PARTIALLY IMPLEMENTED.

The presence layer is the interface between GIDEON Core and the future holographic and 3D presentation.

GIDEON Core decides what the system is doing. The Presence Engine decides how that state is represented visually and audibly.

Core → Presence State → Web renderer / future Android renderer / future desktop renderer / future 3D renderer.

Current states:
- IDLE
- LISTENING
- THINKING
- SPEAKING
- TOOL_EXECUTION
- ALERT

The state machine is deterministic and tested.

The web shell uses the approved repository character reference. Browser speech recognition is only a local UI capability when supported; it does not call an AI provider.

Future 3D pipeline:
Character reference → consistent multi-view assets → 3D character model → rig/facial controls → lip sync and gestures → holographic material/shader → presence renderer.

The 3D model is PLANNED and is not represented as implemented.

The hologram is a presentation layer. It must reflect actual system state and must never invent activity, tool execution, analysis or success.