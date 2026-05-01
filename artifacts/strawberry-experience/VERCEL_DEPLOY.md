# Deploy to Vercel

## Option A — Full Repo Import (Recommended)

The repo root has a `vercel.json` that handles everything automatically.

1. Push the **full repo** to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub.
3. On the configure screen, leave **Root Directory** blank (use the repo root).
4. All other settings (build command, output dir, install command) are picked up from `vercel.json` automatically.
5. Click **Deploy**. Done.

## Option B — Deploy Only This Subfolder

If you point Vercel's **Root Directory** to `artifacts/strawberry-experience`:

1. Vercel reads the `vercel.json` inside this folder.
2. Build Command: `pnpm build:vercel`
3. Output Directory: `dist`
4. Install Command is set automatically in `vercel.json`.
5. Click **Deploy**.

## Option C — Vercel CLI (local dist upload)

```bash
# 1. Build locally from repo root
pnpm --filter @workspace/strawberry-experience run build:vercel

# 2. Deploy the dist folder
npx vercel artifacts/strawberry-experience/dist --prod
```

## Notes

- Videos (`landscape.mp4`, `mobile.mp4`) must be in `public/` — they are copied into `dist/` at build time.
- The SPA rewrite in `vercel.json` ensures `/menu` and `/order` pages reload correctly.
- No environment variables are needed for production.
