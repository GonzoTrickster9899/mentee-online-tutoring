# Mentee Online Tutoring — AI Handoff Pack

This package converts the source-code review of `mentee-online-tutoring-main.zip` into reusable coding-agent prompts, an agent skill, and Vercel-first deployment instructions.

## What's included

- `PROJECT_CONTEXT.md` — concise source-grounded project architecture, stack, roles, and existing capabilities.
- `prompts/` — phased prompts for repository audit, security, payments, feature completion, QA, and Vercel deployment.
- `skills/mentee-online-tutoring/SKILL.md` — reusable project-specific instructions for a coding agent.
- `deployment/VERCEL_DEPLOYMENT_GUIDE.md` — dashboard-first deployment instructions for three Vercel projects from one Git repository.
- `deployment/vercel-config/` — corrected Vite SPA rewrite configurations and notes for the Express API.
- `deployment/env-templates/` — safe environment-variable templates containing names only, no credentials.
- `deployment/PRODUCTION_READINESS_CHECKLIST.md` — go-live checklist.

## Recommended execution order

1. Read `PROJECT_CONTEXT.md` and `skills/mentee-online-tutoring/SKILL.md`.
2. Run `prompts/00_MASTER_AGENT_PROMPT.md` as the primary instruction.
3. Execute the focused prompts in this order:
   - `01_REPOSITORY_AUDIT.md`
   - `02_SECURITY_AND_AUTH_HARDENING.md`
   - `03_BOOKING_AND_STRIPE_WEBHOOKS.md`
   - `04_MVP_FEATURE_COMPLETION.md`
   - `06_TESTING_AND_QA.md`
   - `07_VERCEL_DEPLOYMENT.md`
4. Treat `05_ONLINE_CLASSROOM_ROADMAP.md` as a later product phase, not a launch blocker unless live tutoring/video lessons are required at launch.
5. Deploy the three directories as separate Vercel projects using `deployment/VERCEL_DEPLOYMENT_GUIDE.md`.

## Important security notice

The reviewed ZIP included populated `.env` files. Consider every credential in those files compromised. Rotate MongoDB credentials, Cloudinary API credentials, Stripe secret keys, JWT secrets, and admin credentials before any deployment. Do not copy the old `.env` files into Git or Vercel. Use the placeholder templates in `deployment/env-templates/` and enter newly generated values directly in Vercel Project Settings.

The ZIP also contained `backend/node_modules` and Vite cache files. Do not commit dependencies, caches, build outputs, or real `.env` files. Keep lockfiles; remove generated dependency/cache folders from source control.

## Ground rules

- Preserve the existing React + Vite / Express / MongoDB architecture unless the repository audit demonstrates a concrete reason to change it.
- Do not treat this handoff as proof that the current application passed a runtime test. The original review was a source/configuration inspection, not a live production test.
- The existing code has incomplete payment verification and other security/consistency risks. Do not deploy publicly until the critical items in the readiness checklist are fixed and tested.
- Do not invent external service credentials, account IDs, deployed domains, or successful deployment status.
