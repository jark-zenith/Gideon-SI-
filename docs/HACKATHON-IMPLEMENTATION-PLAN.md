# GIDEON SI — Holographic Web MVP Implementation Plan

## Product decision

- Interface: hybrid holographic avatar and control panels.
- Avatar: personalized 3D face, not a generic final avatar.
- First delivery: responsive web application for mobile, laptop, desktop, and Chromebook.
- Hardware: physical hologram stand is out of scope for this software implementation.

## Existing foundation

The repository already contains the GIDEON Core library, security policy, audit-oriented architecture, a React/Vite web shell, and visual scene controls. The existing frontend command console is a local UI demonstration; it is not connected to a real AI provider. Do not describe it as an operational AI assistant.

## Delivery stages

### Stage 1 — Responsive experience
- Preserve the existing React/Vite app and its original PRUDEN visual language.
- Verify the desktop layout and mobile breakpoints.
- Keep interface status labels honest about unconnected backend, voice, and tools.
- Provide a dedicated avatar workshop for importing a custom GLB model.

### Stage 2 — Personalized 3D avatar
- Obtain an authorized frontal reference photo of the intended person.
- Create or source a suitable 3D face/head model from that reference using an appropriate modelling workflow.
- Export as GLB and optimize geometry/materials for browser rendering.
- Preview the GLB locally in the browser before adding it as a versioned project asset.
- A photo is not itself a 3D model; the model-generation step remains incomplete until the source image and a generated/created model are available.

### Stage 3 — Server-side assistant adapter
- Implement POST /api/assistant/turn as a server-side adapter to the existing GideonCore.
- Keep model credentials server-side.
- Validate payloads and session identity on the server; never trust browser-supplied scopes, user IDs, or confirmations.
- Route all tool execution through the existing policy, confirmation, and audit boundary.
- Keep provider selection behind the existing model-provider abstraction.

### Stage 4 — Voice
- Keep push-to-talk as the MVP interaction.
- Implement the approved cascaded STT → model → TTS pipeline through provider interfaces.
- Show honest listening, processing, speaking, unavailable, and error states.
- Do not add wake-word or always-on microphone behavior.

### Stage 5 — Test and demo
- Run frontend production build and existing core tests.
- Verify desktop and narrow mobile layouts.
- Test missing backend, unsupported browser capabilities, invalid model files, and provider failures.
- Deploy only after build checks pass and the required server configuration is available.

## Current status

- Existing responsive holographic shell: present in repository; needs verification against current acceptance criteria.
- Local 3D GLB preview control: implemented on the feature branch; build still needs to be run.
- Personalized face model: blocked on reference photo and model creation; not yet implemented.
- Real AI backend adapter: not yet implemented.
- Real STT/TTS integration: not yet implemented.
- Production deployment: not yet verified.

## Dependency note

The avatar preview uses Google's model-viewer custom element loaded by CDN to render GLB models without introducing a frontend package-lock change. The feature requires internet access to load that component. For an offline-capable release, vendor or package the dependency after reviewing its license and maintenance status.
