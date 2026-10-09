# Gideon SI Background Uploads

Put background image files in this folder, for example `bridge.jpg`, `moon-base.webp`, or `home-room.png`.

Then add one entry to `manifest.json` under `items`, using a unique lowercase `id` (letters, numbers, and hyphens), a display `label`, an optional `subtitle`, and `src` set to `/backgrounds/your-file.jpg`.

Example:
```json
{
  "items": [
    { "id": "home-room", "label": "Home Room", "subtitle": "Residential environment", "src": "/backgrounds/home-room.png" }
  ]
}
```

The homepage reads this manifest on load. The registered background becomes selectable in the Environment panel and can be requested in the local text console, e.g. `change background to home room`. Files placed here without a manifest entry will not appear automatically because static hosting does not provide directory listings.