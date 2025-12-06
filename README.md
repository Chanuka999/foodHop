# foodHop

FoodHop is a modern full-stack Food Ordering Web Application built with the MERN stack (MongoDB, Express, React, Node). Users can browse menus, place orders, and track order status. This repository contains three apps in a single workspace:

- `backend/` — Express + Node API, MongoDB models and controllers, file uploads.
- `frontend/` — React (Vite) customer-facing site.
- `admin/` — React (Vite) admin dashboard for managing items and orders.

**This README** explains how to run the project locally and how to deploy:

- Host `frontend` and `admin` on Vercel (recommended for static + client apps).
- Host `backend` on Railway (recommended) or another Node host.

**Quick links**

- Backend: [Food Hop Backend](superb-solace-production.up.railway.app)
- Frontend: [Food Hop Frontend](https://food-hop.vercel.app/)
- Admin panel: [Food Hop Admin Panel](https://food-hop-quy8.vercel.app/)

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- A MongoDB connection (Atlas or self-hosted)
- Accounts: Vercel (for frontend/admin), Railway (for backend) or equivalent hosting providers

## Local development

Open three terminals (one per app) and run the following commands from the repository root.

Backend (PowerShell):

```powershell
cd f:\Mern_stack_project\foodHop\backend
npm install
npm run dev  # or `npm start` if you only have a start script
```

Frontend (customer site) (PowerShell):

```powershell
cd f:\Mern_stack_project\foodHop\frontend
npm install
npm run dev
```

Admin panel (PowerShell):

```powershell
cd f:\Mern_stack_project\foodHop\admin
npm install
npm run dev
```

Notes:

- The frontends (Vite) expect a base API URL environment variable. The code checks `import.meta.env.VITE_API_URL` and also falls back to `process.env.REACT_APP_API_URL` in some places. When running locally you can set it with a `.env` file in `frontend/` and `admin/` as:

```
VITE_API_URL=http://localhost:4000
```

or start with an inline environment variable when running build or dev.

## Environment variables (recommended)

Backend (`backend/.env` on Railway or locally):

- `MONGODB_URI` — MongoDB connection string
- `PORT` — Port to run server (default 4000)
- `JWT_SECRET` — Secret for JWT tokens
- `STRIPE_SECRET_KEY` — If you use Stripe for payments
- `FRONTEND_URL` — URL of the frontend (used for success/cancel redirect)

Frontend / Admin (set in Vercel or `.env` locally):

- `VITE_API_URL` — Base URL of backend API (e.g. `https://your-railway-app.up.railway.app`)

## How the API expects items / orders

- When creating an order the backend expects `items` as an array of objects shaped like:

```json
{
  "item": { "_id": "<id>", "name": "Item name", "price": 123.45 },
  "quantity": 2
}
```

The frontend `Checkout` component has been updated to send this shape. The backend stores item price inside the order so admin and user order pages display the price independently of later changes to the item catalog.

## Deployment

### Frontend & Admin: Deploy to Vercel

1. Push your repo to GitHub (or Git provider) and connect it to Vercel.
2. Add two separate Vercel projects (one for `frontend` and one for `admin`) using the same repository but set the **Root Directory** to `frontend` and `admin` respectively.
3. For each project set the following in Vercel dashboard > Settings > Environment Variables:
   - `VITE_API_URL` = `https://<your-backend-host>` (Railway URL)
4. Build settings for Vite apps (defaults usually work):
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Deploy — Vercel will build and host the static assets.

Notes:

- If you use server-side functions or rewrites, configure them in Vercel accordingly. The current apps are client-side React apps built by Vite.

### Backend: Deploy to Railway

1. Create a new project on Railway and connect your GitHub repository (or deploy from local).
2. Set the environment variables in Railway (see list above): `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `FRONTEND_URL`, etc.
3. Ensure the start command is correct (check `backend/package.json`): commonly `npm start` or `node server.js`.
4. Railway will expose a public URL (e.g. `https://your-backend.up.railway.app`). Use that as `VITE_API_URL` in Vercel.

Notes on file uploads:

- The project appears to use local file uploads (an `uploads/` folder). When deploying to Railway, local disk may be ephemeral; consider using S3 (or external storage) for persistent file hosting. If keeping local uploads, be aware that Railway containers may be restarted and lose uploaded files.

## Troubleshooting

- Error: `process is not defined` in the browser — ensure frontends use `import.meta.env.VITE_API_URL` (Vite) or guard `process` access. The admin and frontend code include guards for `process` usage.
- Order prices missing in admin — ensure the `Checkout` sends items with the `{ item: { _id, name, price }, quantity }` shape. The repo's `frontend` Checkout has been updated to send that shape.

## Useful commands

- Run tests (if present): `npm test` inside the relevant package.
- Lint/format: run the linters and formatters defined in each package.

## Contact / Next steps

- If you want, I can:
  - Add a small `admin/.env.example`, `frontend/.env.example`, and `backend/.env.example` to the repo.
  - Add Railway/ Vercel step-by-step screenshots or GitHub Action workflows for CI/CD.

---

Thank you for using FoodHop — if you'd like, I can add the `.env.example` files and a short CI/CD guide for automatic deploys to Vercel and Railway.
