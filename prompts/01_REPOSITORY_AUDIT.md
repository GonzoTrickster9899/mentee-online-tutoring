# Prompt 01 — Repository Audit and Implementation Baseline

Act as a senior engineer conducting a source-code audit of the existing Mentee Online Tutoring repository. Do not modify application code during the first pass unless a minimal non-destructive report artifact is needed.

## Goals
1. Verify the current repository structure and the three app boundaries (`frontend`, `admin`, `backend`).
2. Map each user-facing page to the API routes/controllers it uses.
3. Map API route groups, middleware, models, third-party services, and environment variables.
4. Identify incomplete, insecure, duplicated, dead, or misleading functionality.
5. Identify Vercel build/deployment blockers.

## Inspect
- All `package.json` and lockfiles.
- Router setup and all route definitions.
- Controllers, auth middleware, validation, upload and payment code.
- User, tutor, session models and all query/update paths.
- Frontend contexts/services and all Axios calls.
- `.env` and `.env.example` filenames only; never print their values.
- `.gitignore`, Vercel configuration, build scripts, and test scripts.

## Deliverables
Create `docs/engineering/REPOSITORY_AUDIT.md` containing:
- verified architecture diagram (Mermaid);
- verified dependency/stack table with package manifest ranges;
- role-by-role feature matrix with `implemented`, `partial`, `static-only`, or `missing` status;
- API endpoint inventory including method, path, auth role, payload, and caller;
- data model relationship summary;
- environment-variable inventory with names only;
- security findings ranked Critical/High/Medium/Low;
- deployment and build findings;
- prioritized remediation backlog with effort/risk estimates.

## Rules
- Distinguish observed behavior from assumptions.
- Cite file paths and relevant function names in the report.
- Never reproduce the contents of any secret file.
- Do not claim a feature works merely because a UI screen exists.
- Do not claim production readiness without runtime testing.
- Preserve current architecture; do not start a rewrite.
