# BITS Campus Connect

A social networking platform exclusively for BITS Pilani students across all 4 campuses — Pilani, Goa, Hyderabad, and Dubai.

**Live App:** https://bits-campus-connect.vercel.app

## How to Register

1. Go to https://bits-campus-connect.vercel.app
2. Click **Create Account**
3. Fill in:
   - **BITS Email** — Must be your BITS Pilani email (e.g. `f20220808@hyderabad.bits-pilani.ac.in`)
   - **Full Name**
   - **Username** — Choose a unique username
   - **Password** — Min 8 characters, 1 uppercase, 1 number
4. Click **Create account**
5. You'll be redirected to the **Verify** page with the OTP code **already filled in**
6. Just click **Verify** and you're in!

### OTP Note

Email delivery is not set up yet, so the verification code is auto-filled for you. If the code field is empty for any reason, click **Resend** and it will fill in automatically.

## Features

- **Discover** — Find and connect with BITSians across campuses
- **Feed** — Share posts with your connections
- **Communities** — Join interest-based groups, create posts, vote and comment
- **Messages** — Real-time 1:1 and group messaging
- **Stories** — 24-hour ephemeral content
- **Connections** — Send/accept connection requests
- **Profile** — Customize your profile with bio, interests, and current focus

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Zustand
- **Backend:** Express, TypeScript, Prisma ORM, Socket.io
- **Database:** PostgreSQL, Redis
- **Deployment:** Vercel (frontend), Railway (backend)

## Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit .env with your database credentials

# Run database migrations
pnpm db:migrate

# Seed the database
pnpm --filter @bits-campus-connect/api db:seed

# Start dev servers (API + Web)
pnpm dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- When running locally, OTP codes are printed to the API server console as `[DEV] OTP for {email}: {code}`
