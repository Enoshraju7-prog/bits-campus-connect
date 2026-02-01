---
name: bits-campus-connect
status: backlog
created: 2026-02-01T19:24:14Z
progress: 0%
updated: 2026-02-01T19:36:47Z
prd: .claude/prds/bits-campus-connect.md
github: https://github.com/Enoshraju7-prog/bits-campus-connect/issues/1
---

# Epic: BITS Campus Connect

## Overview

Full-stack social networking platform for BITS Pilani students across 4 campuses. Built as a pnpm monorepo with Next.js 14 frontend, Express/TypeScript backend, PostgreSQL database, Redis cache, and Cloudflare R2 storage. Real-time messaging via Socket.io. Authentication restricted to verified BITS email addresses.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo | pnpm workspaces | Shared types between frontend/backend, single repo for all code |
| Frontend | Next.js 14 App Router | SSR for SEO, RSC for performance, built-in routing and API routes |
| Backend | Express + TypeScript | Lightweight, flexible, good Socket.io integration |
| ORM | Prisma | Type-safe queries, auto-generated client, excellent migration tooling |
| Auth | JWT (access + refresh) | Stateless auth, 15min access / 7-day refresh tokens, HTTP-only cookies |
| Real-time | Socket.io | Fallback transport, room-based messaging, built-in reconnection |
| State (client) | Zustand + TanStack Query | Zustand for UI state, TanStack Query for server state/caching |
| Validation | Zod (shared) | Runtime validation on both client and server from shared schemas |
| File uploads | Presigned URLs to R2 | Direct client-to-storage uploads, reduces server load |
| UI components | Shadcn/ui + Tailwind | Copy-paste components, full customization, no runtime dependency |

## Technical Approach

### Frontend (apps/web)
- **App Router pages:** Auth, feed, messages, stories, communities, profile, settings, discovery
- **Layouts:** Root layout with auth guard, main layout with bottom/side nav, auth layout
- **Real-time:** Socket.io client provider at root, hooks for message/notification events
- **Optimistic updates:** TanStack Query mutations for likes, votes, messages
- **Image handling:** Client-side compression before upload, responsive images via R2 transforms

### Backend (apps/api)
- **REST API:** `/api/v1/*` with Express Router, controller/service/route pattern
- **WebSocket:** Socket.io server on same Express instance, JWT auth middleware on connection
- **Middleware:** Auth (JWT verify), rate limiting (express-rate-limit + Redis), validation (Zod), error handler
- **Services:** Auth, User, Connection, Conversation, Message, Story, Community, Feed, Notification, Upload
- **Background jobs:** Story expiration (cron), notification digests, inactive session cleanup

### Shared Package (packages/shared)
- Zod schemas for all API request/response types
- TypeScript interfaces/types
- Constants (campus colors, email regex, notification types, interest categories)
- Utility functions (email validation, date formatting)

### Database (PostgreSQL + Prisma)
- 16 tables as defined in PRD schema
- Indexes on: email, username, conversation lookups, feed ordering, community post scoring
- Soft deletes for messages and posts (is_deleted flag)
- JSONB for notification data

### Infrastructure
- **Vercel:** Frontend deployment with edge functions
- **Railway:** Backend + PostgreSQL + Redis
- **Cloudflare R2:** Media storage with presigned URLs
- **Resend:** Transactional email (OTP, password reset)
- **GitHub Actions:** CI/CD pipeline (lint, test, build, deploy)

## Implementation Strategy

Development follows a bottom-up approach: foundation first, then core features, then social features. Each task builds on the previous one, minimizing rework.

**Testing approach:** Integration tests for API routes, unit tests for services, E2E tests for critical flows (auth, messaging).

**Risk mitigation:**
- Start with 1:1 messaging before group chat (simpler WebSocket logic)
- Build feed as chronological first, add algorithmic ranking later
- Communities voting uses simple increment/decrement, not complex ranking algorithms initially

## Task Breakdown

- [ ] **Task 1: Monorepo & Project Foundation** - pnpm workspace setup, apps/web (Next.js 14), apps/api (Express/TS), packages/shared, ESLint/Prettier config, TypeScript configs, environment variable setup, CI pipeline
- [ ] **Task 2: Database Schema & Prisma Setup** - Complete Prisma schema with all 16 tables, seed data (interests, default communities), migration scripts, Prisma client generation, shared types export
- [ ] **Task 3: Authentication System** - BITS email validation, OTP generation/verification via Resend, JWT access/refresh token flow, registration/login/logout endpoints, password reset, auth middleware, rate limiting on auth routes
- [ ] **Task 4: User Profiles & Connections** - Profile CRUD endpoints, profile photo/cover upload to R2, interest management, user search/discovery with campus/interest filters, connection request/accept/reject/remove, suggested connections algorithm, profile pages (own + others)
- [ ] **Task 5: Real-time Messaging** - Socket.io server setup with JWT auth, 1:1 direct messaging, group chat (create, members, admin roles), message delivery/read status, typing indicators, conversation list with unread counts, mute functionality, chat UI components
- [ ] **Task 6: Stories & Feed** - Story creation (image/text), 24-hour auto-expiration (cron job), story viewer with view tracking, feed post creation (text/image/achievement), image upload (up to 4), like/comment system, chronological feed with pagination, user profile posts tab
- [ ] **Task 7: Communities** - Community CRUD with moderation roles, join/leave, community post creation with voting (up/down), threaded comments (3 levels), post sorting (hot/new/top), community discovery/search, report system, moderator tools (remove post/user)
- [ ] **Task 8: Notifications & Settings** - In-app notification system, real-time notification delivery via Socket.io, notification center UI, notification preferences, privacy settings (message control, profile visibility), block/unblock users, account deactivation/deletion
- [ ] **Task 9: UI Polish & Responsive Design** - Mobile-first responsive layouts, bottom nav (mobile) / side nav (desktop), campus color theming, skeleton loaders, empty states, error boundaries, toast notifications, PWA manifest, dark mode support
- [ ] **Task 10: Testing, Security & Deployment** - API integration tests, auth flow E2E tests, security hardening (Helmet, CORS, CSRF, input sanitization), rate limiting tuning, Vercel + Railway deployment config, environment setup, monitoring (Sentry), final QA pass

## Dependencies

### External Services
- **Resend** - Email delivery for OTP and notifications
- **Cloudflare R2** - Media file storage
- **Vercel** - Frontend hosting
- **Railway** - Backend, PostgreSQL, Redis hosting

### Internal Dependencies
- Task 1 (foundation) blocks all other tasks
- Task 2 (database) blocks Tasks 3-8
- Task 3 (auth) blocks Tasks 4-8 (all need authenticated endpoints)
- Task 5 (messaging) and Task 8 (notifications) share Socket.io infrastructure
- Task 9 (UI polish) runs in parallel with Tasks 5-8 but after Task 4

## Success Criteria (Technical)

| Criteria | Target |
|----------|--------|
| API response time (P95) | < 500ms |
| WebSocket message latency | < 100ms |
| Page load time (3G) | < 3s |
| Lighthouse performance score | > 80 |
| Test coverage (API) | > 70% |
| Zero critical security vulnerabilities | Pass OWASP top 10 checks |
| Concurrent WebSocket connections | 10,000+ |
| Database query time (P95) | < 100ms |

## Estimated Effort

- **Total tasks:** 10
- **Critical path:** Tasks 1 -> 2 -> 3 -> 4/5/6/7 (parallel) -> 8 -> 9 -> 10
- **Parallelizable:** Tasks 5, 6, 7 can run concurrently after Task 4
- **Largest tasks:** Task 5 (messaging) and Task 7 (communities) are the most complex

## Tasks Created
- [ ] #2 - Monorepo & Project Foundation (parallel: false)
- [ ] #4 - Database Schema & Prisma Setup (parallel: false)
- [ ] #6 - Authentication System (parallel: false)
- [ ] #8 - User Profiles & Connections (parallel: true)
- [ ] #10 - Real-time Messaging (parallel: true)
- [ ] #3 - Stories & Feed (parallel: true)
- [ ] #5 - Communities (parallel: true)
- [ ] #7 - Notifications & Settings (parallel: true)
- [ ] #9 - UI Polish & Responsive Design (parallel: true)
- [ ] #11 - Testing, Security & Deployment (parallel: false)

Total tasks: 10
Parallel tasks: 6
Sequential tasks: 4
Estimated total effort: 168-212 hours
