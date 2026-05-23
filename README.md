# College Discovery Platform

Full-stack MVP for a college discovery and decision platform.

## Built Features
- College Listing + Search with filters and pagination
- College Detail Page with overview, courses, placements, and reviews
- Compare Colleges feature with a comparison table
- Simple Predictor Tool for exam rank-based college suggestions

## Stack
- Frontend: Next.js + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL

## Setup
1. Create a PostgreSQL database and set `DATABASE_URL`.
2. Backend:
   - `cd backend`
   - `npm install`
   - `cp .env.example .env`
   - `npm run seed`
   - `npm run dev`
3. Frontend:
   - `cd ../frontend`
   - `npm install`
   - `npm run dev`

## Deployment
- Deploy frontend to Vercel
- Deploy backend to Railway / Render
- Set `NEXT_PUBLIC_API_BASE_URL` for the frontend to the backend URL
