# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**BITS Campus Connect** - A social networking platform exclusively for BITS Pilani students across 4 campuses (Pilani, Goa, Hyderabad, Dubai).

### Core Features
- Email-based authentication (BITS emails only)
- User profiles with campus, interests, achievements
- Personal messaging (1:1 and group chats)
- Stories/Status (24-hour ephemeral content)
- Interest-based communities (Reddit-style)
- Personal feed (Instagram/Facebook-style posts)

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/ui, Zustand, TanStack Query, Socket.io-client
- **Backend:** Node.js 20, Express, TypeScript, Prisma ORM, Zod, Socket.io
- **Database:** PostgreSQL 15, Redis 7
- **Storage:** Cloudflare R2
- **Deployment:** Vercel (frontend), Railway (backend)

## Project Structure
```
bits-campus-connect/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities, API client
│   │   ├── hooks/           # Custom React hooks
│   │   └── stores/          # Zustand stores
│   └── api/                 # Express backend
│       ├── src/
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── middleware/
│       │   ├── socket/
│       │   └── utils/
│       └── prisma/
└── packages/
    └── shared/              # Shared types, constants
```

## Commands
```bash
pnpm install              # Install dependencies
pnpm dev                  # Run all apps
pnpm dev:web              # Frontend only (localhost:3000)
pnpm dev:api              # Backend only (localhost:8000)
pnpm db:generate          # Generate Prisma client
pnpm db:migrate           # Run migrations
pnpm db:studio            # Open Prisma Studio
pnpm build                # Build all apps
pnpm lint                 # Lint all apps
pnpm test                 # Run tests
```

## Authentication

- Email regex: `/^[a-z]\d{8}@(pilani|goa|hyderabad|dubai)\.bits-pilani\.ac\.in$/i`
- Example: `f20220808@hyderabad.bits-pilani.ac.in`
- Flow: Register → OTP to email → Verify → JWT tokens
- Access token: 15min, Refresh token: 7 days

## Campus Colors
```typescript
const CAMPUS_COLORS = {
  pilani: '#DC2626',    // Red
  goa: '#059669',       // Green
  hyderabad: '#7C3AED', // Purple
  dubai: '#D97706',     // Orange
};
```

## Database Schema (Key Tables)

- users, user_interests, interests, connections
- conversations, conversation_participants, messages
- stories, story_views
- communities, community_members, community_posts, post_votes, comments
- feed_posts, feed_post_media, feed_post_likes, feed_post_comments
- notifications, blocks, reports

## API Patterns

- Base URL: `/api/v1/{resource}`
- Auth: `Authorization: Bearer {token}`
- Response: `{ "success": true, "data": {...} }` or `{ "success": false, "error": {...} }`
- Pagination: `?page=1&limit=20`

## Coding Conventions

1. TypeScript strict mode, no `any`
2. Zod for runtime validation
3. Functional components with named exports
4. Zustand for global state, TanStack Query for server state
5. React Hook Form + Zod for forms
6. camelCase for variables, PascalCase for components/types

## Development Priorities (P0 - Must Have First)

1. Project foundation (monorepo, configs)
2. Database schema & Prisma setup
3. Authentication system
4. User profiles
5. Real-time messaging
6. Basic feed and stories

## Environment Variables
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
RESEND_API_KEY=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Key Patterns

1. **WebSocket:** Namespaced events like `message:new`, `story:view`
2. **File Uploads:** Presigned URL → direct upload to R2 → save URL
3. **Real-time:** Socket.io rooms per conversation/user
4. **Caching:** Redis for sessions, OTP, frequently accessed data
```

---

## Next Steps After Pasting:

**Step 1:** Save the CLAUDE.md file

**Step 2:** In Claude Code, type:
```
Initialize the monorepo with pnpm workspace. Create the folder structure for apps/web, apps/api, and packages/shared. Set up the basic package.json files and pnpm-workspace.yaml.
```

**Step 3:** Then:
```
Set up the Express backend with TypeScript in apps/api with the folder structure from CLAUDE.md
```

**Step 4:** Then:
```
Set up Next.js 14 with App Router and TypeScript in apps/web