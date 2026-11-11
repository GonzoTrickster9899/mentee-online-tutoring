# Prompt 04 — Complete the Existing MVP Experience

Improve the current Mentee Online Tutoring MVP while keeping the existing architecture and UI patterns. Do not add an online classroom or a large new subsystem in this phase.

## Required MVP scope

### Student experience
- Improve tutor search/filtering and empty/loading/error states.
- Make tutor availability and selectable slots consistent with the backend.
- Show booking status clearly: pending payment, paid/confirmed, cancelled, completed, or failed/expired where supported.
- Ensure the student sees only their own sessions.
- Improve profile form validation and upload feedback.

### Tutor experience
- Show upcoming, completed, cancelled, and payment-related session states clearly.
- Ensure tutors can act only on sessions assigned to them.
- Improve profile and availability editing with validation and useful feedback.
- Calculate earnings from successful payments and completed sessions according to the business rule defined in Prompt 03.

### Administrator experience
- Improve tutor creation/editing and availability workflows.
- Add clear search/filter/sort and pagination where data volumes justify it.
- Make session cancellation and status changes auditable.
- Ensure dashboard statistics match source records and exclude unpaid/duplicate revenue.

### Shared quality
- Add consistent loading, empty, success, and error states.
- Add accessible form labels, focus states, keyboard support, and mobile responsiveness.
- Use consistent date/time handling and display the intended timezone clearly. Store timestamps in a consistent UTC representation where appropriate and avoid ambiguous local-time parsing.
- Add pagination or safe limits to collection endpoints.
- Add server-side validation and useful API error codes.
- Improve the Contact page only if a real backend/email handling workflow is included; otherwise label it as informational and do not pretend a form submission is sent.
- Keep the Blog marked as static content unless a CMS/API is actually implemented.

## Not in scope for this prompt
- Video conferencing / live classroom.
- Chat or realtime messaging.
- Subscription billing or tutor payouts.
- A complete LMS.

## Deliverables
- Working, role-specific student/tutor/admin flows.
- Updated API and UI tests.
- A feature matrix showing implemented/partial/not implemented.
- Short user-flow QA instructions.

## Acceptance criteria
- All existing role flows can be completed without console errors.
- UI status labels agree with backend state.
- No role can perform unauthorized actions.
- Responsive layouts remain usable on mobile and desktop.
- Existing routes and visual language are preserved unless a specific defect requires change.
