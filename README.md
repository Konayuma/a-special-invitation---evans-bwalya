# A Special Invitation

An interactive, mobile-first invitation built with React, Vite, and Tailwind CSS. It includes a personal photo gallery, attire guide, RSVP flow, signature canvas, audio details, and calendar export.

## Run Locally

**Prerequisites:** Node.js 20.19 or newer and npm.

```bash
npm ci
npm run dev
```

No environment variables are required.

## Quality checks

```bash
npm run check
```

This runs the TypeScript check and creates the production build in `dist/`.

## Deploy to Vercel

### Vercel dashboard

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, select **Add New → Project** and import the repository.
3. Vercel will detect the included Vite configuration automatically.
4. Select **Deploy**. No environment variables need to be added.

The committed `vercel.json` sets npm as the installer, runs `npm run build`, publishes `dist`, and preserves SPA fallback routing.

### Vercel CLI

```bash
npx vercel          # preview deployment
npx vercel --prod   # production deployment
```

After deployment, verify the invitation on a mobile viewport, test audio after a user interaction, complete the RSVP/signature flow, and download the calendar file.
