# Run the downloaded Lusion site

Use the complete snapshot in this folder:

- `lusion.co/lusion.co`

The folders `lusion.co (1)` and `lusion.co (2)` are partial duplicates and are not needed to run the full site.

## Option 1 (PowerShell)

From the workspace root, run:

```powershell
.\start-lusion-site.ps1
```

## Option 2 (Command Prompt)

From the workspace root, run:

```bat
start-lusion-site.bat
```

Then open:

- `http://localhost:5500/`

## Why this is needed

The pages use root paths like `/_astro/...`, `/assets/...`, `/about`, and `/projects`.
Those links only resolve correctly when served from `lusion.co/lusion.co` as a web root (not when opening HTML files directly with `file://`).

## Asset Bridging Included

The startup script now auto-connects split snapshot assets from `lusion.co/lusion.dev/assets` into `lusion.co/lusion.co/assets` using Windows junctions for:

- `audios`
- `models`
- `projects`
- `team`
- `textures`

It also creates fallback dark favicon files and a fallback home model file when the downloader did not save those originals.

## Stop the server

Press `Ctrl+C` in the terminal where the server is running.
