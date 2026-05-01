# Deploy to Vercel

## Option A — GitHub Import (Recommended)

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub.
3. On the configure screen set:
   - **Root Directory**: `artifacts/strawberry-experience`
   - **Build Command**: `pnpm build:vercel`
   - **Output Directory**: `dist`
   - **Install Command**: `cd ../.. && pnpm install`
4. Click **Deploy**. Done.

## Option B — Vercel CLI (local build)

```bash
# 1. Build locally
cd artifacts/strawberry-experience
pnpm build:vercel

# 2. Deploy the dist folder
npx vercel dist --prod
```

## Notes

- All three videos are bundled inside `dist/` and served as static assets.
- The `vercel.json` already sets SPA rewrites so page refreshes work correctly.
- No environment variables are needed for production.
