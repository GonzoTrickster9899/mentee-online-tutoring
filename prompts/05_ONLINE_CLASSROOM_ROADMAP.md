# Prompt 05 — Online Classroom and Learning Features (Later Phase)

Plan and implement a later-stage online learning experience for Mentee Online Tutoring. First inspect the current application and produce a design proposal; do not immediately add a video provider or paid external service.

## Product capabilities to evaluate

1. **Online classroom**: secure session room, scheduled access, meeting status, participant roles, teacher controls, waiting room, and join/leave handling.
2. **Video/audio**: evaluate provider options against cost, Philippine availability/latency, browser support, recording/privacy requirements, and Vercel compatibility. Do not claim a provider is free or has a specific quota without current verification.
3. **Messaging**: student/tutor conversation scoped to a booking, message history, abuse controls, and notifications.
4. **Learning materials**: upload/download PDFs and permitted files, access control by booking/course, file size/type limits, and secure URLs.
5. **Calendar**: tutor availability, student booking calendar, timezone handling, and optional calendar export/synchronization.
6. **Reviews and ratings**: only verified students with eligible completed sessions can review; prevent duplicate reviews and abusive content.
7. **Learning history**: session notes, resources, attendance, and progress summaries with role-based privacy.

## Design requirements
- Reuse existing User, Tutor, and Session concepts where appropriate.
- Define new models and relationships only when needed.
- Enforce booking ownership and role authorization for all classroom/resources/messages.
- Do not expose room secrets or provider tokens in browser-visible environment variables.
- Create short-lived, server-generated room access credentials.
- Define data retention, recording consent, and access policies before enabling recording.
- Design around serverless execution: do not assume an Express process stays alive for socket state. Select external managed realtime infrastructure or another architecture only after evaluating the tradeoffs.
- Prefer incremental release behind feature flags.

## Deliverables
First produce a proposal containing architecture, data model, API contracts, user journeys, privacy/security risks, provider comparison, and staged cost considerations. After review/approval, implement one feature slice at a time with tests and deployment guidance.
