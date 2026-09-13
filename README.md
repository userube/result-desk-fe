# ClassPilot Frontend

Next.js App Router frontend for ClassPilot by PulchriLabs, with ResultDesk as the result-generation module.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Install dependencies: `npm install`.
3. Start locally: `npm run dev`.
4. Build for production: `npm run build`.

## Routes

- Public: `/`, `/pricing`, `/demo`
- Auth: `/login`, `/signup`, `/accept-invite`, `/forgot-password`, `/reset-password`
- Tenant app: `/app/dashboard`, `/app/programs`, `/app/setup`, `/app/teachers`, `/app/classes`, `/app/students`, `/app/weekly-reports`, `/app/results`, `/app/results/[classId]`, `/app/audit-logs`, `/app/settings/school`, `/app/settings/domain`, `/app/settings/grading`, `/app/settings/result-template`
- Public school portal: `/s/[schoolSlug]`, `/s/[schoolSlug]/admission`

## Tenant Notes

The UI is structured around `school.slug` and public school portal paths. Production subdomain routing should map `greenfield.classpilot.app` to the matching tenant and API school context.

## Deployment

Deploy to Vercel and set `NEXT_PUBLIC_API_BASE_URL` to the Railway API URL.
