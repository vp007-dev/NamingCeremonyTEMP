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

## Vercel Analytics

The site includes script tags for **Web Analytics** and **Speed Insights**. Both endpoints (`/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js`) are auto-served by Vercel once enabled.

After your first deploy:

1. Open the project in the Vercel dashboard.
2. Go to the **Analytics** tab and click **Enable**.
3. Go to the **Speed Insights** tab and click **Enable**.

That's it — no code changes needed. Locally these scripts will 404 (harmless).
