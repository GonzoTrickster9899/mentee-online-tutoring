# MVP Feature Matrix and QA

This matrix reflects source changes in this iteration. Stripe, MongoDB, Cloudinary, and browser behavior still require the manual checks below before release.

| Role | Flow | Status | Notes |
|---|---|---|---|
| Student | Browse/filter tutors | Implemented | Client-side search/filter plus loading, empty, error, and retry states. |
| Student | Select a tutor/time | Implemented | Public tutor list derives reserved slots from active sessions; UI handles missing tutor and requires a selected time. |
| Student | Book a session | Implemented pending deployment migration | Server validates a future, 30-minute slot and uses the unique active-slot index. |
| Student | Pay | Implemented pending Stripe setup | Checkout uses database amounts; browser return only refreshes state; signed webhook confirms payment. |
| Student | Cancel | Implemented | Only unpaid/failed/expired active sessions; paid/refund flows are intentionally unsupported. |
| Student | Profile update | Partial | Required client fields, image-type feedback, and saving state added; server-side upload hardening remains a separate security task. |
| Tutor | View session/payment states | Implemented | Displays pending, paid, failed/expired, cancelled, and completed states. |
| Tutor | Complete/cancel assigned session | Implemented | Backend enforces assignment; only verified paid active sessions can complete. |
| Tutor | Earnings | Implemented | Includes only verified paid, completed sessions. |
| Administrator | View session state/cancel | Implemented | Status is explicit; same no-refund cancellation policy applies. |
| Administrator | Revenue | Implemented at API level | Dashboard response includes completed, verified-payment revenue once per session. |
| Administrator | Tutor availability | Partial | Existing workflow preserved; advanced search/sort/pagination is not yet implemented. |
| Shared | Contact | Implemented as informational | Removed misleading submit behavior; no email/contact backend exists. |
| Shared | Blog | Static-only | Explicitly labelled static content. |

## Manual user-flow QA

1. Configure a new test MongoDB database and Stripe test credentials; set identical backend `BOOKING_TIME_ZONE` and frontend `VITE_BOOKING_TIME_ZONE` values.
2. Run the booking/payment migration dry run, resolve duplicate active slots, apply it, and verify the database unique index.
3. As a student, browse, search, select a future slot, book it, and verify it disappears from another browser’s availability list.
4. Attempt a concurrent booking of the same slot; expect one success and one `409` response.
5. Start Checkout, return to the application, and verify the session reads “Payment pending” until Stripe delivers a signed event.
6. Deliver each Stripe test event listed in `BOOKING_AND_STRIPE_OPERATIONS.md`; verify the displayed status matches the API response.
7. As the assigned tutor, confirm only paid sessions can be completed. Verify an unassigned tutor cannot cancel or complete the session.
8. Confirm an administrator sees status, can cancel an unpaid session, and receives a clear blocked response for paid/payment-in-progress sessions.
9. Check the layout at mobile and desktop widths, keyboard focus for search/profile controls, and an empty tutor/session list.
