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

Before sending an RSVP, add and verify `sepokonayuma.me` in Resend by installing
the DNS records shown in the Resend dashboard. The production sender is
`A Special Invitation <rsvp@sepokonayuma.me>`.

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
   Settings → Environment Variables**. Set `RESEND_FROM_EMAIL` to
   `A Special Invitation <rsvp@sepokonayuma.me>` and `RSVP_TO_EMAIL` to
   `bradleydimande@gmail.com,sepokonayuma@gmail.com`. Multiple recipients are
   separated with commas.
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
