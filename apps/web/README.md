# GIDEON SI Web Interface

A standalone React + Vite UI located under `apps/web`. It is isolated from the repository's NodeNext TypeScript core build.

## Run locally
```sh
cd apps/web
npm install
npm run dev
npm run build
```

## Included
- Responsive hologram visualization and animated visual states.
- Local appearance and environment selectors.
- Four versioned SVG environment assets under `public/scenes`.
- Floating text console for local demonstration commands.
- Typed browser transport contract at `src/lib/assistant-transport.ts` for a future same-origin server API.

## Integration status and security
The text console currently changes local UI state only. The HTTP transport is an integration seam, not a connected backend: this repository does not yet provide `POST /api/assistant/turn`. The future server adapter must authenticate the session, instantiate the existing `GideonCore`, and keep model-provider credentials server-side.

Never accept user identity, trusted scopes, or confirmation decisions from browser-supplied fields. All tool proposals must pass through the existing `ToolGateway`, policy, confirmation, and audit path. Do not call tools directly from the UI.

Gemini / Google AI Studio, microphone capture, speech-to-text, and text-to-speech are intentionally not connected in this migration. No provider key belongs in `VITE_*` variables or client code.
