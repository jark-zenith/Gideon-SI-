# Gideon SI Hologram Outfit Uploads

Put new hologram-look images in this folder, preferably transparent PNG or WebP full-body renders with the same framing and aspect ratio for consistent switching.

Then add one entry to `manifest.json` under `items`, using a unique lowercase `id`, a display `label`, an optional `detail`, a one-character `mark`, and `src` set to `/outfits/your-file.png`.

Example:
```json
{
  "items": [
    { "id": "space-suit", "label": "Space Suit", "detail": "Exploration mode", "mark": "✦", "src": "/outfits/space-suit.png" }
  ]
}
```

The homepage reads this manifest on load. The new look appears in the Appearance panel and can be requested in the local text console, e.g. `switch to space suit look`. Files placed here without a manifest entry will not appear automatically because static hosting does not provide directory listings.