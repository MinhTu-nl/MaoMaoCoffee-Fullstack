# MaoMao Coffee — Fullstack Project

This repository contains a full-stack web application for MaoMao Coffee. It includes three main sub-projects:

- `FrontEnd/` — Customer-facing React app built with Vite and Tailwind CSS.
- `Admin/` — Admin dashboard React app built with Vite and Tailwind CSS.
- `BackEnd/` — Node.js + Express backend (MongoDB, Cloudinary integration).

High level

- Frontend and Admin are single-page React apps. Each is configured with Vite and Tailwind.
- Backend is an Express server with REST APIs, user auth, product management, orders, reviews, notifications, and integrations with Cloudinary and MongoDB.

Quick scripts

- From repository root you can run both frontends and the server concurrently (requires `concurrently`):

  - `npm run maomao`

- Per-subproject scripts (run from each folder or via `npm --prefix <folder> run <script>`):

  - FrontEnd: `npm run dev` (start Vite dev server), `npm run build`, `npm run preview`
  - Admin: `npm run dev` (start Vite dev server), `npm run build`, `npm run preview`, `npm run lint`
  - BackEnd: `npm run dev` (start server with nodemon), `npm run server` (start server in development env), `npm run start`

Requirements

- Node.js >= 18.x (backend package.json specifies engines >=18.0.0)
- npm (comes with Node) or yarn/pnpm if you prefer (commands below use npm)
- MongoDB database (local or hosted) and Cloudinary account for image uploads — credentials go into `.env` files (see `BackEnd/.env.example`)

Repository structure (top-level)

- `FrontEnd/` — customer site (Vite + React)
- `Admin/` — admin dashboard (Vite + React)
- `BackEnd/` — APIs (Express + Mongoose)

Notes

- Environment variables are required for the backend (MongoDB URI, JWT secret, Cloudinary keys). Copy `BackEnd/.env.example` to `BackEnd/.env` and fill values before running the server.
- If you move the project to a different machine, follow the installation steps described in `HuongDanCaiDat.md`.

For contribution, bug reports, or questions, open an issue or contact the repository owner.

## Deloy sản phẩm demo trên vercel
Frontend: 
`https://mao-mao-coffee.vercel.app/`
Admin: 
`https://mao-mao-admin.vercel.app/`