<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy as static site (e.g. GitHub Pages)

1. Build: `npm run build`
2. The output is in the `dist/` directory. Publish the contents of `dist/` to your static host.
3. For **GitHub Pages** (project site at `username.github.io/repo-name`): in `vite.config.ts` set `base: '/repo-name/'` (e.g. `base: '/noted/'`), then run `npm run build` and push the `dist/` contents to a `gh-pages` branch or use the Actions workflow. With `base: './'`, the app works when served from any subpath.
