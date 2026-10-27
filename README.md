# Karmaveer Cafe

A responsive cafe website with a React/Vite customer experience and an Express API. Guest orders are supported. Orders, inquiries, customers, menu and settings persist in a local JSON store behind an asynchronous repository boundary.

**Owner review before launch:** all menu entries and prices are illustrative. Confirm offerings, prices, hours, facilities, address, contact number, enabled order types, and the cafe description before accepting live orders. There are no configured delivery fees or taxes by default. Parking, Wi-Fi, air conditioning, delivery, testimonials, and discounts are not claimed.

## Requirements

- Node.js 20 or newer and npm 10 or newer.
- No MongoDB installation or cloud database is required.

## Install and run

From the repository root:

```sh
npm install
Copy-Item server/.env.example server/.env # PowerShell; on macOS/Linux: cp server/.env.example server/.env
npm run seed
npm run dev
```

The website runs at `http://localhost:5173`, with the API at `http://localhost:4000`. The Vite dev server proxies `/api` to Express. Alternatively install in the root workspace and run `npm run dev:server` and `npm run dev:client` in separate terminals.

For a production client build run `npm run build`; serve `client/dist` from a static host and run the server with `npm --workspace server start`. Set `VITE_API_URL` at client build time to the production API base path (for example `/api`), configure `CLIENT_ORIGIN` to the exact deployed client origin, and set `COOKIE_SECURE=true` behind HTTPS. Put a reverse proxy in front of the API and serve both over HTTPS in production.

## First administrator

1. Copy `server/.env.example` to `server/.env`.
2. Set `BOOTSTRAP_ADMIN_EMAIL`, a unique email, and `BOOTSTRAP_ADMIN_PASSWORD` to a private password at least 12 characters long. Set a long random `JWT_SECRET`; never use the development fallback outside local development.
3. From the root, run `npm run bootstrap-admin --workspace server` (or `cd server && npm run bootstrap-admin`).
4. Sign in at `/login`. The bootstrap command may be rerun to rotate the configured admin password. Public registration always creates a customer and cannot choose a role.

Keep `.env` and the JSON database out of source control. Do not expose the admin bootstrap command to the public web.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Express listen port; defaults to `4000`. |
| `CLIENT_ORIGIN` | Exact browser origin allowed by credentialed CORS; defaults to local Vite. |
| `JWT_SECRET` | Secret for signed, HttpOnly session cookies. Set a long random production value. |
| `COOKIE_SECURE` | Cookies are secure automatically in production; set `true` when using HTTPS outside production. Secure cookies enable cross-site sessions for a separately hosted frontend and API. |
| `DATA_DIR` | JSON data directory relative to `server/`; defaults to `server/data`. |
| `BOOTSTRAP_ADMIN_EMAIL` | Email for the explicit admin bootstrap process. |
| `BOOTSTRAP_ADMIN_PASSWORD` | Bootstrap password (12+ characters); do not commit it. |
| `VITE_API_URL` | Optional client API URL; use `/api` or the backend origin (for example, `https://example.onrender.com`). The client appends `/api` when needed. |
| `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Reserved for an optional approved WhatsApp Business Platform integration. No automatic notification is sent by this starter. |

The cafe WhatsApp number is configured as `919823739334`. The working customer flow opens an official `wa.me` link with an encoded message; the customer must press Send. Opening WhatsApp is not delivery confirmation. Automatic cafe notifications require a configured WhatsApp Business provider, credentials, business setup, and recipient permissions.

## Data and API

The store is `server/data/db.json`, outside the public client directory. It is initialized idempotently and retains orders across server restarts. Updates are serialized within the running Node process and written to a temporary file before atomic rename. Back up this file. This local single-process JSON store is suitable for local development and a small pilot, not equivalent to MongoDB for concurrent multi-process writes, security isolation, or scale.

Public routes: `GET /api/menu`, `GET /api/menu/:id`, `GET /api/categories` (menu response includes categories), `GET /api/settings/public`, `POST /api/orders`, `GET /api/orders/:id`, `POST /api/contact`, `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/me`. Signed-in customers can use `GET /api/orders/my-orders`. Admin routes under `/api/admin` provide dashboard data, order listing/status changes, menu CRUD, settings updates, and sales reports. Order totals always come from current server-side menu records, and orders retain name/price snapshots. Auth uses password hashes, rate limits on auth endpoints, HttpOnly cookies, role checks, and ownership checks for registered-customer orders.

The guest order confirmation link is an unguessable UUID but is still a bearer link; share it carefully. Registered customer orders require authentication and ownership. This starter does not process payments. Bills show `Unpaid` until a future payment integration or verified admin workflow changes that state.

## Tests

Run `npm test` for the server tests. Run `npm run build` for the production frontend build. Tests and builds must be run in an environment with workspace dependencies installed.

## MongoDB Atlas migration plan

Keep the service layer dependent on repository interfaces rather than JSON paths. Add Mongoose models for users, categories, menu items, orders, inquiries, and settings; define unique indexes for normalized user email and `orderNumber`, indexes for order customer/date/status and menu category/availability, and schema validation for roles, prices, order types, and status lifecycle. Preserve immutable order item snapshots. Implement the same repository methods over Mongoose, inject the selected repository at startup through configuration, validate the connection string in environment, and create a one-time migration script that copies JSON records while preserving IDs and verifying counts. Add transaction handling or an explicit order-number counter before multi-instance deployment. Never migrate password hashes to logs or expose them in responses.

## Operational notes

- Menu/settings are editable by admins; the admin page includes order workflow, menu management, dashboard metrics, and completed-order reports.
- Opening hours and facilities are editable via `PATCH /api/admin/settings`; menu entries through admin UI. Seed defaults are sample values.
- Customer contact submissions are stored in the JSON database. The form reports API failures instead of showing a false success.
- The supplied Google Maps embed URL is included and rendered responsively; the address remains explicitly unconfirmed.
- No fake ratings, reviews, social accounts, or payment claims are included.
