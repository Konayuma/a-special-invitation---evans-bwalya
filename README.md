# A Special Invitation

An interactive, mobile-first invitation built with React, Vite, and Tailwind CSS. It includes a personal photo gallery, attire guide, RSVP flow, signature canvas, audio details, and calendar export.

## Run Locally

**Prerequisites:** Node.js 20.19 or newer and npm.

```bash
npm ci
npm run dev
```

To test RSVP email delivery through a local Vercel function, copy `.env.example`
to `.env.local`, add your Resend API key, and run `npx vercel dev`. The regular
`npm run dev` command only starts Vite and does not serve the `/api/send-rsvp`
function.

For initial Resend testing, `onboarding@resend.dev` can be used as the sender.
Before sharing the production invitation, verify a domain in Resend and change
`RESEND_FROM_EMAIL` to an address on that domain.

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
4. Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RSVP_TO_EMAIL` in **Project
   Settings → Environment Variables**. Set `RSVP_TO_EMAIL` to
   `bradleydimande@gmail.com`.
5. Select **Deploy**.

The committed `vercel.json` sets npm as the installer, runs `npm run build`, publishes `dist`, and preserves SPA fallback routing.

### Vercel CLI

```bash
npx vercel          # preview deployment
npx vercel --prod   # production deployment
```

After deployment, verify the invitation on a mobile viewport, test audio after a
user interaction, complete the RSVP/signature flow, confirm that the RSVP email
arrives, and download the calendar file.
