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
- Upload-ready `public/backgrounds/` and `public/outfits/` folders, each with a `manifest.json` and instructions. Add an image and register it in the matching manifest to make it selectable on the homepage.
- Floating text console for local demonstration commands; registered background and outfit names can be selected by natural-language-like local commands.
- Typed browser transport contract at `src/lib/assistant-transport.ts` for a future same-origin server API.

## Integration status and security
The text console currently changes local UI state only. The HTTP transport is an integration seam, not a connected backend: this repository does not yet provide `POST /api/assistant/turn`. The future server adapter must authenticate the session, instantiate the existing `GideonCore`, and keep model-provider credentials server-side.

Never accept user identity, trusted scopes, or confirmation decisions from browser-supplied fields. All tool proposals must pass through the existing `ToolGateway`, policy, confirmation, and audit path. Do not call tools directly from the UI.

Gemini / Google AI Studio, microphone capture, speech-to-text, and text-to-speech are intentionally not connected in this migration. No provider key belongs in `VITE_*` variables or client code.


## Custom 3D avatar workshop

The interface includes a local GLB preview panel. Use **Load 3D Model** to preview an existing .glb file with orbit controls. The model is loaded locally in the current browser session and is not uploaded to a server. The renderer is loaded from the Google model-viewer CDN, so an internet connection is required for this panel.

A personalized face model still needs to be created from an authorized reference photo and exported as GLB. A regular photo is not a 3D model. The workshop does not claim to generate a face model from a photograph.
