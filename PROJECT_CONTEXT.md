# Project Context — Mentee Online Tutoring

## Product summary

Mentee Online Tutoring is a web-based tutor discovery, booking, and administration platform. The current codebase has three application areas: a public student-facing website, an admin/tutor dashboard, and an Express API.

## Repository layout observed

```text
mentee-online-tutoring-main/
├── frontend/    # public student website (React + Vite)
├── admin/       # administrator and tutor dashboard (React + Vite)
└── backend/     # REST API (Node.js + Express + MongoDB)
```

The source archive also contained generated dependency/cache folders and populated `.env` files. These must not be deployed or committed as-is.

## Architecture

- Public frontend calls the Express API through `VITE_BACKEND_URL`.
- Admin/tutor frontend calls the same Express API through `VITE_BACKEND_URL`.
- Express exposes `/api/user`, `/api/tutor`, and `/api/admin` route groups.
- MongoDB is accessed through Mongoose.
- Cloudinary is used for profile image storage.
- Stripe Checkout is used for session payment.
- JWT-based middleware separates student, tutor, and administrator access paths.

## Technology stack observed in package manifests

| Area | Packages / technologies | Declared package range |
|---|---|---|
| Public and admin UIs | React, React DOM | `^19.1.1` |
| Frontend build tooling | Vite, `@vitejs/plugin-react` | `^7.1.2`, `^5.0.0` |
| Routing | React Router DOM | `^7.8.x` (minor patch differs between apps) |
| HTTP | Axios | `^1.11.0` |
| Styling | Tailwind CSS, PostCSS, Autoprefixer | `^3.4.17`, `^8.5.6`, `^10.4.21` |
| UI utilities | React Icons, React Toastify | `^5.5.0`, `^11.0.5` |
| API | Node.js, Express | Express `^5.1.0`; Node version not pinned in the reviewed package manifest |
| Database | MongoDB, Mongoose | `^8.18.0` |
| Auth/security | jsonwebtoken, bcrypt, validator | `^9.0.2`, `^6.0.0`, `^13.15.15` |
| Uploads/media | Multer, Cloudinary SDK | `^2.0.2`, `^2.7.0` |
| Payments | Stripe Node SDK | `^18.4.0` |
| Runtime config | dotenv, cors | `^17.2.1`, `^2.8.5` |

Use the lockfiles as the authority for exact installed versions. Do not upgrade major dependencies without checking compatibility and the impact on existing code.

## Roles and existing capabilities

### Student / mentee
- Register and log in.
- Browse and filter tutors.
- View tutor profiles, qualifications, experience, subject, and fees.
- Select dates and time slots and book a session.
- View own sessions and profile.
- Update profile details and upload a profile image.
- Start a Stripe Checkout payment flow.
- Cancel a booking through the existing cancellation path.

### Tutor
- Log in to the tutor dashboard.
- View assigned sessions and dashboard data.
- View and update tutor profile information.
- Set availability and fees through the existing dashboard/admin flows.
- Mark sessions complete or cancel sessions.

### Administrator
- Log in using configured admin credentials.
- View dashboard statistics and session records.
- Add tutors and upload tutor images.
- List tutors and change tutor availability.
- View and cancel sessions.

### Public pages observed
Home, tutor listing, tutor/session details, blog, contact, login/register, profile, and student session pages. Blog content is static frontend content in the reviewed implementation. The Contact page did not have a matching backend contact-submission route in the reviewed route set.

## Existing MongoDB models observed

- **User**: student identity, login, profile, contact, address, date of birth, and gender fields.
- **Tutor**: tutor identity, qualification, subject, experience, profile/about text, availability, fees, address, and booked-slot data.
- **Session**: student/tutor identifiers and snapshots, date/time, amount, cancelled, payment, and completion flags.

The Session model stores `userData` and `tutData` as object snapshots as well as IDs. Preserve historical booking display semantics if changing the schema. Add migrations/backward-compatible handling for existing documents.

## API route groups observed

- `/api/user`: register, login, get/update profile, book session, list sessions, cancel session, create Stripe Checkout session, verify Stripe payment.
- `/api/tutor`: tutor list/login, list own sessions, complete/cancel session, dashboard, profile, update profile.
- `/api/admin`: admin login, add/list tutors, change tutor availability, list/cancel sessions, admin dashboard.

Confirm exact HTTP methods and payload contracts in route/controller files before changing any endpoint. Keep existing clients compatible or update clients and API together.

## Known risks from source review

1. Populated `.env` files were present in the ZIP. Rotate all exposed credentials and do not reuse them.
2. The current Stripe verification endpoint marks a session as paid based on a request/query flow rather than verified Stripe payment evidence. A signed Stripe webhook and idempotent processing are required before production payments.
3. Booking availability is checked and then written in separate operations. Concurrent booking requests can race and reserve the same slot.
4. JWT signing does not visibly set an expiration in the reviewed user login/register code. Add finite token lifetime and consistent verification behavior.
5. CORS is configured with `cors()` without an explicit allowed-origin list.
6. The MongoDB connection function logs failure but does not propagate the error, and the server starts accepting requests without awaiting the connection.
7. Tutor earnings should count only completed and successfully paid sessions, not merely completed sessions.
8. Tutor/admin cancellation paths need review to ensure they release slots consistently and enforce actor authorization.
9. The backend package's `test` script is a placeholder that exits with an error; automated tests are not set up.
10. Existing frontend Vercel rewrites target `/`; Vercel's current Vite SPA guidance uses `/index.html` for deep links.
11. The existing backend Vercel config uses a custom `@vercel/node` build/routes pattern. Vercel currently supports Express directly; confirm the deployment approach and avoid mixing legacy custom routing with framework detection without a specific need.
12. Generated `node_modules`, `.vite`, build output, and real environment files should not be part of the source repository.

## Product direction

Recommended MVP sequence:
1. Secure authentication, authorization, input validation, and secrets.
2. Correct session reservation/cancellation and payment lifecycle.
3. QA automation and deployment hardening.
4. Complete booking communications and notifications.
5. Add optional learning features: messaging, lesson resources, calendar, reviews, and online classroom/video.

Do not start by rewriting the whole system. Audit the current code, preserve working user flows, and make incremental, tested changes.
