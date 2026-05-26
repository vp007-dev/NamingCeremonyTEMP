# Naamkaran Invitation

Cinematic 3D-scroll naming ceremony invitation site.

## Local preview

```bash
npx serve .
```

Then open http://localhost:3000

## Deploy to Vercel

### Option A — via Vercel CLI

```bash
npm i -g vercel
vercel        # follow prompts; framework: "Other"
vercel --prod # deploy to production
```

### Option B — via GitHub + Vercel dashboard

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. Framework Preset: **Other**.
4. Root Directory: leave blank (project root).
5. Build Command: leave blank.
6. Output Directory: leave blank (`.`).
7. Click **Deploy**.

The included `vercel.json` configures asset caching and the audio MIME type.
