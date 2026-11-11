# Backend Vercel Configuration Note

For the current recommended setup, use Vercel's native Express framework detection from the `backend` project root. The reviewed repository already has an Express entry file at `backend/server.js` and a listener-based startup pattern.

The original `backend/vercel.json` uses an explicit `builds`/`routes` configuration with `@vercel/node`. Do not copy that legacy config into a new setup by default. Remove or rename the existing file when choosing Express framework detection, then verify the entrypoint, database readiness, environment variables, and API routes in a Preview deployment.

Vercel's Express documentation allows an Express entrypoint to export the app as the default export or use a port listener. The current project uses a port listener; the bigger pre-deployment issue to address is that the present server starts without awaiting a successful MongoDB connection.

Documentation: https://vercel.com/docs/frameworks/backend/express
