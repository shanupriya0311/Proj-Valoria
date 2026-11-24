# Project Valoria

The web platform and showcase for Valoria Technology. Built with Next.js, React, Tailwind CSS, and Motion.

## Cloudflare deployment

The project uses OpenNext for Cloudflare Workers. It requires Node.js 20 or newer and npm.

```powershell
npm install
npm run preview
npm run deploy
npm run cf-typegen
```

Authenticate Wrangler before the first deployment:

```powershell
npx wrangler login
```

Configure these Cloudflare Worker secrets for the production Worker:

```powershell
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put SUPABASE_SECRET_KEY
npx wrangler secret put GMAIL_APP_PASSWORD
npx wrangler secret put SALESFORCE_ACCESS_TOKEN
```

`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` are required for internship applications.
`GMAIL_APP_PASSWORD` is required to email Lets Connect inquiries.
`SALESFORCE_ACCESS_TOKEN` is optional; omit it to submit inquiries by email only.

Local preview reads secrets from `.dev.vars`. Keep real credentials out of git.