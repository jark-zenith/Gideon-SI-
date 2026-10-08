# ADR-001 — Model Provider Abstraction
Status: ACCEPTED in principle — baseline decision approved by Jark Pruden (baseline decision #7 approved; interface details pending review); details open to review

## Context
GIDEON must not depend on one AI vendor. Models, prices and capabilities change quickly; the brief names OpenAI, Gemini, Claude and local models.

## Problem
How does Core use LLMs without coupling to a vendor SDK, while avoiding premature multi-model complexity in the MVP?

## Alternatives considered
1. Call one vendor SDK directly from Core.
2. Use a third-party gateway/aggregator as the abstraction.
3. Own thin `ModelProvider` interface with adapters; trivial router at first.
4. Full multi-model router from the start.

## Decision
Option 3. Core depends only on a `ModelProvider` interface (generate, stream, declared capabilities: tool-calling, vision, max context, streaming). One adapter ships in the MVP. The Model Router exists as a module but initially returns the single configured provider. Provider-specific features are surfaced through declared capabilities; Core checks capabilities and degrades gracefully. Provider output is normalized to internal types (messages, tool *proposals*, usage).

## Advantages
Swap/add providers without touching Core; testable with a fake provider in unit tests only (never presented as real); clear place for cost/usage accounting.

## Disadvantages
Lowest-common-denominator risk; adapters must be maintained; some vendor features won't map cleanly.

## Consequences
No provider SDK imports outside `core/models`. Provider keys are server-side env vars. Tool-calling formats differ per vendor; adapters translate to internal proposals, and proposals never execute without the policy engine (ADR-002).

## Reconsideration criteria
Revisit if a second provider cannot be added with only an adapter, if capability differences force provider-specific code in Core, or if a gateway service meets security and cost requirements.
