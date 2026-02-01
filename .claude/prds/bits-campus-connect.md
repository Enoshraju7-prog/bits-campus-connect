---
name: bits-campus-connect
description: Social networking platform exclusively for BITS Pilani students across 4 campuses
status: in-progress
created: 2026-01-31T11:58:18Z
---

# PRD: BITS Campus Connect - Inter-Campus Social Platform

**Document Version:** 1.0
**Created:** January 31, 2026
**Author:** Enosh
**Status:** Draft

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Target Users](#3-target-users)
4. [User Personas](#4-user-personas)
5. [User Stories](#5-user-stories)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Technical Requirements](#8-technical-requirements)
9. [Data Models](#9-data-models)
10. [API Specifications](#10-api-specifications)
11. [UI/UX Requirements](#11-uiux-requirements)
12. [Security Requirements](#12-security-requirements)
13. [Success Metrics](#13-success-metrics)
14. [Release Plan](#14-release-plan)
15. [Risks & Mitigations](#15-risks--mitigations)
16. [Appendix](#16-appendix)

---

## 1. Executive Summary

### 1.1 Product Name
**BITS Campus Connect** (BCC)

### 1.2 Problem Statement
BITS Pilani has 4 campuses (Pilani, Goa, Hyderabad, Dubai) with 20,000+ students who lack a unified platform to:
- Connect with peers across campuses
- Form interest-based communities
- Share achievements and experiences
- Collaborate on projects and events
- Maintain relationships post-graduation

Current solutions (WhatsApp groups, Instagram, LinkedIn) are fragmented, not BITS-specific, and don't facilitate organic cross-campus connections.

### 1.3 Solution Overview
A dedicated social networking platform exclusively for BITS Pilani students featuring:
- **Verified Authentication** via official BITS email
- **Personal Profiles** showcasing campus, interests, achievements
- **Real-time Messaging** for personal and group conversations
- **Stories/Status** for ephemeral content sharing
- **Interest Communities** (Reddit-style) for discussions
- **Feed** for achievements, photos, updates (Instagram/Facebook-style)
- **Cross-campus Discovery** to meet students from other campuses

### 1.4 Business Justification
- First-mover advantage in BITS student ecosystem
- Captive audience of 20,000+ verified users
- Potential for alumni expansion
- Sponsorship opportunities from companies targeting BITS talent
- Foundation for future mobile apps

---

## 2. Product Vision & Goals

### 2.1 Vision Statement
*"To be the digital home for every BITSian - connecting minds across campuses, fostering communities around shared passions, and creating lifelong bonds that extend beyond graduation."*

### 2.2 Product Goals

| Goal | Description | Success Metric |
|------|-------------|----------------|
| G1 | Unite all 4 BITS campuses on one platform | 50%+ students registered within 6 months |
| G2 | Enable meaningful cross-campus connections | Avg 5+ cross-campus connections per user |
| G3 | Build thriving interest-based communities | 50+ active communities with daily engagement |
| G4 | Replace fragmented WhatsApp groups | 80% reduction in new WhatsApp group creation |
| G5 | Become the go-to platform for BITS updates | 70% DAU/MAU ratio |

### 2.3 Project Scope

#### In Scope (MVP - Phase 1)
- Email-based authentication (BITS emails only)
- User profiles with campus, interests, bio
- Personal messaging (1:1 chat)
- Group chats
- Stories/Status (24-hour ephemeral content)
- Interest-based communities with posts/comments
- Personal feed for photos/achievements
- Basic notifications
- Web application (responsive)

#### Out of Scope (Future Phases)
- Native mobile apps (iOS/Android)
- Alumni network integration
- Job/internship board
- Event management system
- Marketplace for books/items
- Video calling
- AI-powered recommendations

---

## 3. Target Users

### 3.1 Primary Users
| Campus | Estimated Students | Email Format |
|--------|-------------------|--------------|
| Pilani | ~8,000 | f20220808@pilani.bits-pilani.ac.in |
| Goa | ~4,000 | f20220808@goa.bits-pilani.ac.in |
| Hyderabad | ~5,000 | f20220808@hyderabad.bits-pilani.ac.in |
| Dubai | ~1,500 | f20220808@dubai.bits-pilani.ac.in |

### 3.2 User Segments
1. **Freshers (1st Year)** - Looking to make friends, explore interests
2. **Sophomores/Juniors** - Active in clubs, projects, seeking collaborations
3. **Seniors** - Placement prep, mentoring, staying connected
4. **Dual Degree Students** - 5-year students, deeper connections
5. **Off-Campus Students** - PS/Thesis students wanting to stay connected

---

## 4. User Personas

### Persona 1: Arjun - The Fresher
- **Campus:** Hyderabad
- **Year:** 1st Year
- **Goals:** Make friends, find study groups, explore clubs
- **Pain Points:** Doesn't know anyone, overwhelmed by WhatsApp groups
- **Behavior:** Checks social media 15+ times/day, shares stories frequently

### Persona 2: Priya - The Community Builder
- **Campus:** Goa
- **Year:** 3rd Year
- **Goals:** Run trading community, connect with Pilani traders
- **Pain Points:** Hard to reach students across campuses
- **Behavior:** Creates content, organizes events, highly engaged

### Persona 3: Rahul - The Cross-Campus Collaborator
- **Campus:** Pilani
- **Year:** 4th Year
- **Goals:** Find teammates for hackathons, build cross-campus projects
- **Pain Points:** No easy way to discover skilled students elsewhere
- **Behavior:** Project-focused, looks for specific skills

### Persona 4: Sneha - The Social Butterfly
- **Campus:** Dubai
- **Year:** 2nd Year
- **Goals:** Stay connected with mainland friends, share experiences
- **Pain Points:** Time zone differences, feeling disconnected
- **Behavior:** Heavy story user, frequent chatter

---

## 5. User Stories

### 5.1 Authentication & Onboarding

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-001 | As a new user, I want to sign up using my BITS email so that only verified students can access the platform | P0 | Email verification sent, only @*.bits-pilani.ac.in accepted |
| US-002 | As a new user, I want to create a username and password so that I can log in securely | P0 | Username uniqueness check, password strength validation |
| US-003 | As a new user, I want to complete my profile during onboarding so that others can discover me | P0 | Campus auto-detected from email, interests selection, profile photo upload |
| US-004 | As a returning user, I want to log in with email/username and password | P0 | Session management, remember me option |
| US-005 | As a user, I want to reset my password if I forget it | P0 | Email-based password reset flow |
| US-006 | As a user, I want to log out from all devices for security | P1 | Session invalidation across all devices |

### 5.2 User Profile

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-010 | As a user, I want to view and edit my profile | P0 | Edit name, bio, interests, profile photo, cover photo |
| US-011 | As a user, I want to display my campus and batch year | P0 | Auto-extracted from email, editable batch year |
| US-012 | As a user, I want to add my interests/hobbies | P0 | Tag-based selection from predefined + custom |
| US-013 | As a user, I want to show what I'm currently focused on | P1 | "Currently" section (e.g., "Preparing for placements") |
| US-014 | As a user, I want to view other users' profiles | P0 | Public profile view with connect option |
| US-015 | As a user, I want to see mutual connections on a profile | P1 | Display shared friends count and list |
| US-016 | As a user, I want to share my achievements on profile | P1 | Achievement cards with images and descriptions |

### 5.3 Connections & Discovery

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-020 | As a user, I want to send connection requests to other users | P0 | Request sent, pending state shown |
| US-021 | As a user, I want to accept/reject connection requests | P0 | Accept adds to connections, reject removes request |
| US-022 | As a user, I want to search for users by name/username | P0 | Real-time search with filters |
| US-023 | As a user, I want to filter users by campus | P0 | Campus filter in discovery |
| US-024 | As a user, I want to filter users by interests | P1 | Interest-based filtering |
| US-025 | As a user, I want to see suggested connections | P1 | Algorithm based on campus, interests, mutual friends |
| US-026 | As a user, I want to view my connections list | P0 | Paginated list with search |
| US-027 | As a user, I want to remove a connection | P1 | Unfriend functionality |

### 5.4 Personal Messaging

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-030 | As a user, I want to send direct messages to connections | P0 | Real-time messaging, delivery status |
| US-031 | As a user, I want to see message read receipts | P1 | Read indicators (ticks) |
| US-032 | As a user, I want to share images in chat | P0 | Image upload and preview |
| US-033 | As a user, I want to react to messages with emojis | P2 | Emoji reactions on messages |
| US-034 | As a user, I want to delete messages I sent | P1 | Delete for me / Delete for everyone |
| US-035 | As a user, I want to see typing indicators | P2 | "User is typing..." display |
| US-036 | As a user, I want to search my chat history | P2 | Search within conversations |
| US-037 | As a user, I want to mute conversations | P1 | Mute notifications for specific chats |

### 5.5 Group Chats

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-040 | As a user, I want to create a group chat | P0 | Group name, photo, add members |
| US-041 | As a user, I want to add members to a group | P0 | Search and add from connections |
| US-042 | As a user, I want to remove members from my group | P1 | Admin can remove members |
| US-043 | As a user, I want to leave a group | P0 | Exit group functionality |
| US-044 | As a user, I want to make someone group admin | P1 | Admin role assignment |
| US-045 | As a user, I want to see group info and members | P0 | Group details page |
| US-046 | As a user, I want to share group invite links | P2 | Shareable invite links |

### 5.6 Stories/Status

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-050 | As a user, I want to post a story (image/text) | P0 | Upload image or create text story |
| US-051 | As a user, I want my story to expire after 24 hours | P0 | Automatic deletion after 24h |
| US-052 | As a user, I want to view my connections' stories | P0 | Story ring UI, tap to view |
| US-053 | As a user, I want to react to stories | P1 | Quick reactions, reply via DM |
| US-054 | As a user, I want to see who viewed my story | P0 | View count and viewer list |
| US-055 | As a user, I want to add text/stickers to story images | P2 | Basic story editor |
| US-056 | As a user, I want to control who can see my stories | P2 | Close friends list, hide from specific users |

### 5.7 Communities (Reddit-style)

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-060 | As a user, I want to browse available communities | P0 | Community discovery page |
| US-061 | As a user, I want to join communities based on interests | P0 | Join/leave functionality |
| US-062 | As a user, I want to create a new community | P1 | Community creation with rules |
| US-063 | As a user, I want to post in a community | P0 | Text posts, image posts |
| US-064 | As a user, I want to comment on community posts | P0 | Threaded comments |
| US-065 | As a user, I want to upvote/downvote posts and comments | P0 | Voting system affecting visibility |
| US-066 | As a user, I want to save posts for later | P1 | Bookmark functionality |
| US-067 | As a user, I want to report inappropriate content | P0 | Report to moderators |
| US-068 | As a community moderator, I want to remove posts/users | P1 | Moderation tools |
| US-069 | As a user, I want to search posts within a community | P1 | Community-specific search |

### 5.8 Personal Feed (Instagram/Facebook-style)

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-070 | As a user, I want to post photos/images to my profile | P0 | Image upload with caption |
| US-071 | As a user, I want to share text updates | P0 | Text-based posts |
| US-072 | As a user, I want to like posts from connections | P0 | Like button with count |
| US-073 | As a user, I want to comment on posts | P0 | Comment section |
| US-074 | As a user, I want to see a feed of my connections' posts | P0 | Chronological/algorithmic feed |
| US-075 | As a user, I want to share achievements with badges | P1 | Achievement post type |
| US-076 | As a user, I want to tag other users in posts | P2 | @mention functionality |
| US-077 | As a user, I want to delete my posts | P0 | Delete own content |

### 5.9 Notifications

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-080 | As a user, I want to receive notifications for new messages | P0 | Push + in-app notifications |
| US-081 | As a user, I want to be notified of connection requests | P0 | Request notifications |
| US-082 | As a user, I want to be notified of likes/comments | P1 | Engagement notifications |
| US-083 | As a user, I want to be notified of community activity | P2 | Community post notifications |
| US-084 | As a user, I want to customize notification preferences | P1 | Granular notification settings |
| US-085 | As a user, I want to see all notifications in one place | P0 | Notification center |

### 5.10 Settings & Privacy

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-090 | As a user, I want to control who can message me | P1 | Everyone / Connections only |
| US-091 | As a user, I want to make my profile private | P1 | Profile visibility settings |
| US-092 | As a user, I want to block users | P0 | Block functionality |
| US-093 | As a user, I want to deactivate my account | P1 | Temporary deactivation |
| US-094 | As a user, I want to delete my account permanently | P1 | GDPR-compliant deletion |
| US-095 | As a user, I want to download my data | P2 | Data export functionality |

---

## 6. Functional Requirements

### 6.1 Authentication Module

#### FR-001: Email Verification
- System SHALL accept only emails matching pattern: `*@(pilani|goa|hyderabad|dubai).bits-pilani.ac.in`
- System SHALL send verification email with 6-digit OTP
- OTP SHALL expire after 10 minutes
- System SHALL allow 3 OTP resend attempts per hour

#### FR-002: User Registration
- Username SHALL be 3-20 characters, alphanumeric + underscores
- Username SHALL be unique across the platform
- Password SHALL be minimum 8 characters with 1 uppercase, 1 number
- System SHALL extract campus from email domain automatically

#### FR-003: Session Management
- Session token SHALL expire after 7 days of inactivity
- System SHALL support concurrent sessions (max 5 devices)
- System SHALL provide "logout all devices" functionality

### 6.2 Profile Module

#### FR-010: Profile Data
- Profile SHALL include: name, username, bio (500 chars max), profile photo, cover photo
- Profile SHALL display: campus (auto), batch year, interests (max 10), current focus
- Profile SHALL show: connection count, post count, community count

#### FR-011: Profile Photo
- System SHALL accept JPG, PNG formats
- Maximum file size: 5MB
- System SHALL generate thumbnails (50x50, 150x150, 400x400)

### 6.3 Messaging Module

#### FR-020: Real-time Messaging
- Messages SHALL be delivered in real-time using WebSockets
- System SHALL show delivery status: Sent -> Delivered -> Read
- System SHALL support text messages up to 2000 characters
- System SHALL support image attachments up to 10MB

#### FR-021: Group Chat
- Groups SHALL support up to 256 members
- Group name: 3-50 characters
- Group SHALL have at least one admin
- System SHALL maintain message history for 1 year

### 6.4 Stories Module

#### FR-030: Story Creation
- System SHALL accept images (JPG, PNG) up to 10MB
- System SHALL accept text stories with background colors
- Stories SHALL auto-delete after 24 hours
- Users SHALL post maximum 10 stories per 24 hours

#### FR-031: Story Viewing
- System SHALL track unique views per story
- System SHALL show viewer list to story owner
- Stories SHALL display in chronological order

### 6.5 Communities Module

#### FR-040: Community Structure
- Community name: 3-50 characters, unique
- Community SHALL have description (1000 chars max)
- Community SHALL have rules section
- Community SHALL have at least one moderator

#### FR-041: Community Posts
- Posts SHALL support: text (10000 chars), images (max 4)
- Posts SHALL have voting system (+1/-1)
- Comments SHALL support 3 levels of nesting
- System SHALL rank posts by: Hot, New, Top (day/week/month/all)

### 6.6 Feed Module

#### FR-050: Feed Generation
- Feed SHALL show posts from connections and joined communities
- Feed SHALL be paginated (20 posts per page)
- System SHALL support infinite scroll
- Feed SHALL refresh on pull-down (mobile)

#### FR-051: Post Types
- Image post: 1-4 images with caption
- Text post: Up to 2000 characters
- Achievement post: Badge + description + images

### 6.7 Notification Module

#### FR-060: Notification Delivery
- System SHALL support in-app notifications
- System SHALL support browser push notifications
- System SHALL support email digests (daily/weekly)
- Notifications SHALL be marked read individually or all

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Requirement | Specification |
|-------------|---------------|
| NFR-001 | Page load time < 3 seconds on 3G connection |
| NFR-002 | API response time < 500ms for 95th percentile |
| NFR-003 | WebSocket latency < 100ms for messages |
| NFR-004 | Support 10,000 concurrent users |
| NFR-005 | 99.9% uptime SLA |

### 7.2 Scalability

| Requirement | Specification |
|-------------|---------------|
| NFR-010 | Horizontal scaling capability for all services |
| NFR-011 | Database read replicas for query distribution |
| NFR-012 | CDN for static assets and media |
| NFR-013 | Message queue for async processing |

### 7.3 Security

| Requirement | Specification |
|-------------|---------------|
| NFR-020 | All data encrypted in transit (TLS 1.3) |
| NFR-021 | Passwords hashed with bcrypt (cost factor 12) |
| NFR-022 | Rate limiting: 100 requests/minute per user |
| NFR-023 | CSRF protection on all forms |
| NFR-024 | XSS prevention with content sanitization |
| NFR-025 | SQL injection prevention with parameterized queries |

### 7.4 Compatibility

| Requirement | Specification |
|-------------|---------------|
| NFR-030 | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| NFR-031 | Responsive design: 320px to 2560px width |
| NFR-032 | Mobile-first approach |
| NFR-033 | PWA capabilities (offline support, installable) |

### 7.5 Accessibility

| Requirement | Specification |
|-------------|---------------|
| NFR-040 | WCAG 2.1 Level AA compliance |
| NFR-041 | Keyboard navigation support |
| NFR-042 | Screen reader compatibility |
| NFR-043 | Color contrast ratio minimum 4.5:1 |

---

## 8. Technical Requirements

### 8.1 Technology Stack

#### Frontend
```
Framework: Next.js 14 (React 18)
Language: TypeScript
Styling: Tailwind CSS
State Management: Zustand / React Query
Real-time: Socket.io-client
UI Components: Shadcn/ui
Forms: React Hook Form + Zod
```

#### Backend
```
Runtime: Node.js 20 LTS
Framework: Express.js
Language: TypeScript
API: REST + WebSocket
ORM: Prisma
Validation: Zod
```

#### Database
```
Primary: PostgreSQL 15
Cache: Redis 7
File Storage: Cloudflare R2
```

#### Infrastructure
```
Hosting: Vercel (Frontend) + Railway (Backend)
CDN: Cloudflare
Email: Resend
Monitoring: Sentry
CI/CD: GitHub Actions
```

### 8.2 Architecture Overview

```
+-------------------------------------------------------------+
|                        Client Layer                         |
|  +--------------+  +--------------+  +--------------------+ |
|  |   Web App    |  |  PWA/Mobile  |  | Future Native Apps | |
|  |  (Next.js)   |  |   (PWA)      |  |  (React Native)   | |
|  +--------------+  +--------------+  +--------------------+ |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      API Gateway / CDN                       |
|                       (Cloudflare)                           |
+-------------------------------------------------------------+
                              |
              +---------------+---------------+
              v               v               v
+-----------------+  +--------------+  +-----------------+
|   REST API      |  |  WebSocket   |  |   Media API     |
|   Server        |  |   Server     |  |   (Upload/CDN)  |
|   (Express)     |  |  (Socket.io) |  |                 |
+-----------------+  +--------------+  +-----------------+
              |               |               |
              +---------------+---------------+
                              v
+-------------------------------------------------------------+
|                       Data Layer                             |
|  +------------+  +------------+  +------------------------+ |
|  | PostgreSQL |  |   Redis    |  |     R2 Storage         | |
|  |  (Primary) |  |  (Cache)   |  |    (Media Files)       | |
|  +------------+  +------------+  +------------------------+ |
+-------------------------------------------------------------+
```

### 8.3 Database Schema (High-Level)

```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  bio TEXT,
  profile_photo_url VARCHAR(500),
  cover_photo_url VARCHAR(500),
  campus ENUM('pilani', 'goa', 'hyderabad', 'dubai'),
  batch_year INTEGER,
  current_focus VARCHAR(200),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- User interests (many-to-many)
user_interests (
  user_id UUID REFERENCES users(id),
  interest_id UUID REFERENCES interests(id),
  PRIMARY KEY (user_id, interest_id)
)

-- Interests master table
interests (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  category VARCHAR(50),
  icon VARCHAR(50)
)

-- Connections
connections (
  id UUID PRIMARY KEY,
  requester_id UUID REFERENCES users(id),
  addressee_id UUID REFERENCES users(id),
  status ENUM('pending', 'accepted', 'rejected'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(requester_id, addressee_id)
)

-- Direct Messages
conversations (
  id UUID PRIMARY KEY,
  type ENUM('direct', 'group'),
  name VARCHAR(50),
  photo_url VARCHAR(500),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

conversation_participants (
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES users(id),
  role ENUM('member', 'admin'),
  joined_at TIMESTAMP,
  last_read_at TIMESTAMP,
  is_muted BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (conversation_id, user_id)
)

messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  message_type ENUM('text', 'image', 'system'),
  media_url VARCHAR(500),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
)

-- Stories
stories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content_type ENUM('image', 'text'),
  media_url VARCHAR(500),
  text_content VARCHAR(500),
  background_color VARCHAR(7),
  expires_at TIMESTAMP,
  created_at TIMESTAMP
)

story_views (
  story_id UUID REFERENCES stories(id),
  viewer_id UUID REFERENCES users(id),
  viewed_at TIMESTAMP,
  PRIMARY KEY (story_id, viewer_id)
)

-- Communities
communities (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  rules TEXT,
  icon_url VARCHAR(500),
  banner_url VARCHAR(500),
  member_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP
)

community_members (
  community_id UUID REFERENCES communities(id),
  user_id UUID REFERENCES users(id),
  role ENUM('member', 'moderator', 'admin'),
  joined_at TIMESTAMP,
  PRIMARY KEY (community_id, user_id)
)

community_posts (
  id UUID PRIMARY KEY,
  community_id UUID REFERENCES communities(id),
  author_id UUID REFERENCES users(id),
  title VARCHAR(300),
  content TEXT,
  post_type ENUM('text', 'image', 'link'),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
)

post_votes (
  post_id UUID REFERENCES community_posts(id),
  user_id UUID REFERENCES users(id),
  vote_type ENUM('up', 'down'),
  PRIMARY KEY (post_id, user_id)
)

comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id),
  parent_id UUID REFERENCES comments(id),
  author_id UUID REFERENCES users(id),
  content TEXT,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
)

-- Personal Feed Posts
feed_posts (
  id UUID PRIMARY KEY,
  author_id UUID REFERENCES users(id),
  content TEXT,
  post_type ENUM('text', 'image', 'achievement'),
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
)

feed_post_media (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES feed_posts(id),
  media_url VARCHAR(500),
  media_type ENUM('image'),
  order_index INTEGER
)

feed_post_likes (
  post_id UUID REFERENCES feed_posts(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP,
  PRIMARY KEY (post_id, user_id)
)

feed_post_comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES feed_posts(id),
  author_id UUID REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP
)

-- Notifications
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  title VARCHAR(200),
  body TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
)

-- Blocks
blocks (
  blocker_id UUID REFERENCES users(id),
  blocked_id UUID REFERENCES users(id),
  created_at TIMESTAMP,
  PRIMARY KEY (blocker_id, blocked_id)
)

-- Reports
reports (
  id UUID PRIMARY KEY,
  reporter_id UUID REFERENCES users(id),
  reported_type ENUM('user', 'post', 'comment', 'message', 'community'),
  reported_id UUID,
  reason VARCHAR(50),
  description TEXT,
  status ENUM('pending', 'reviewed', 'resolved'),
  created_at TIMESTAMP
)
```

### 8.4 API Endpoints (RESTful)

#### Authentication
```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/verify-email      - Verify email with OTP
POST   /api/v1/auth/login             - Login user
POST   /api/v1/auth/logout            - Logout user
POST   /api/v1/auth/refresh           - Refresh access token
POST   /api/v1/auth/forgot-password   - Request password reset
POST   /api/v1/auth/reset-password    - Reset password with token
```

#### Users & Profiles
```
GET    /api/v1/users/me               - Get current user profile
PUT    /api/v1/users/me               - Update current user profile
GET    /api/v1/users/:username        - Get user by username
GET    /api/v1/users/search           - Search users
POST   /api/v1/users/me/photo         - Upload profile photo
POST   /api/v1/users/me/cover         - Upload cover photo
GET    /api/v1/users/me/interests     - Get user interests
PUT    /api/v1/users/me/interests     - Update user interests
```

#### Connections
```
GET    /api/v1/connections            - Get all connections
POST   /api/v1/connections/request    - Send connection request
GET    /api/v1/connections/pending    - Get pending requests
POST   /api/v1/connections/:id/accept - Accept request
POST   /api/v1/connections/:id/reject - Reject request
DELETE /api/v1/connections/:id        - Remove connection
GET    /api/v1/connections/suggestions - Get suggested connections
```

#### Messaging
```
GET    /api/v1/conversations                     - Get all conversations
POST   /api/v1/conversations                     - Create conversation
GET    /api/v1/conversations/:id                 - Get conversation details
GET    /api/v1/conversations/:id/messages        - Get messages
POST   /api/v1/conversations/:id/messages        - Send message
DELETE /api/v1/messages/:id                      - Delete message
POST   /api/v1/conversations/:id/read            - Mark as read
PUT    /api/v1/conversations/:id/mute            - Mute conversation

# Group specific
POST   /api/v1/conversations/:id/members         - Add members
DELETE /api/v1/conversations/:id/members/:userId - Remove member
PUT    /api/v1/conversations/:id/members/:userId - Update member role
POST   /api/v1/conversations/:id/leave           - Leave group
```

#### Stories
```
GET    /api/v1/stories                - Get all stories (connections)
POST   /api/v1/stories                - Create story
GET    /api/v1/stories/me             - Get my stories
DELETE /api/v1/stories/:id            - Delete story
GET    /api/v1/stories/:id/views      - Get story views
POST   /api/v1/stories/:id/view       - Record story view
```

#### Communities
```
GET    /api/v1/communities            - Get all communities
POST   /api/v1/communities            - Create community
GET    /api/v1/communities/:id        - Get community details
PUT    /api/v1/communities/:id        - Update community
DELETE /api/v1/communities/:id        - Delete community
POST   /api/v1/communities/:id/join   - Join community
POST   /api/v1/communities/:id/leave  - Leave community
GET    /api/v1/communities/:id/members - Get members

# Community Posts
GET    /api/v1/communities/:id/posts  - Get community posts
POST   /api/v1/communities/:id/posts  - Create post
GET    /api/v1/posts/:id              - Get post details
PUT    /api/v1/posts/:id              - Update post
DELETE /api/v1/posts/:id              - Delete post
POST   /api/v1/posts/:id/vote         - Vote on post

# Comments
GET    /api/v1/posts/:id/comments     - Get post comments
POST   /api/v1/posts/:id/comments     - Create comment
PUT    /api/v1/comments/:id           - Update comment
DELETE /api/v1/comments/:id           - Delete comment
POST   /api/v1/comments/:id/vote      - Vote on comment
```

#### Feed
```
GET    /api/v1/feed                   - Get personalized feed
POST   /api/v1/feed/posts             - Create feed post
GET    /api/v1/feed/posts/:id         - Get post details
DELETE /api/v1/feed/posts/:id         - Delete post
POST   /api/v1/feed/posts/:id/like    - Like post
DELETE /api/v1/feed/posts/:id/like    - Unlike post
GET    /api/v1/feed/posts/:id/comments - Get comments
POST   /api/v1/feed/posts/:id/comments - Add comment
GET    /api/v1/users/:username/posts  - Get user's posts
```

#### Notifications
```
GET    /api/v1/notifications          - Get all notifications
PUT    /api/v1/notifications/:id/read - Mark as read
PUT    /api/v1/notifications/read-all - Mark all as read
DELETE /api/v1/notifications/:id      - Delete notification
GET    /api/v1/notifications/settings - Get notification settings
PUT    /api/v1/notifications/settings - Update settings
```

#### Settings & Privacy
```
GET    /api/v1/settings               - Get user settings
PUT    /api/v1/settings               - Update settings
POST   /api/v1/users/:id/block        - Block user
DELETE /api/v1/users/:id/block        - Unblock user
GET    /api/v1/users/blocked          - Get blocked users
POST   /api/v1/reports                - Report content
POST   /api/v1/account/deactivate     - Deactivate account
DELETE /api/v1/account                - Delete account
GET    /api/v1/account/data           - Export user data
```

### 8.5 WebSocket Events

```javascript
// Connection
socket.connect()
socket.disconnect()
socket.authenticate(token)

// Messaging
socket.emit('message:send', { conversationId, content, type })
socket.on('message:new', (message) => {})
socket.on('message:delivered', (messageId) => {})
socket.on('message:read', (messageId) => {})
socket.emit('typing:start', { conversationId })
socket.emit('typing:stop', { conversationId })
socket.on('user:typing', ({ conversationId, userId }) => {})

// Presence
socket.on('user:online', (userId) => {})
socket.on('user:offline', (userId) => {})

// Notifications
socket.on('notification:new', (notification) => {})

// Stories
socket.on('story:new', (story) => {})
```

---

## 9. Data Models

### 9.1 TypeScript Interfaces

```typescript
// User
interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string | null;
  profilePhotoUrl: string | null;
  coverPhotoUrl: string | null;
  campus: 'pilani' | 'goa' | 'hyderabad' | 'dubai';
  batchYear: number;
  currentFocus: string | null;
  interests: Interest[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interest
interface Interest {
  id: string;
  name: string;
  category: string;
  icon: string;
}

// Connection
interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  requester?: User;
  addressee?: User;
}

// Conversation
interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  photoUrl: string | null;
  participants: ConversationParticipant[];
  lastMessage: Message | null;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationParticipant {
  userId: string;
  user: User;
  role: 'member' | 'admin';
  joinedAt: Date;
  lastReadAt: Date;
  isMuted: boolean;
}

// Message
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  messageType: 'text' | 'image' | 'system';
  mediaUrl: string | null;
  isDeleted: boolean;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
}

// Story
interface Story {
  id: string;
  userId: string;
  user: User;
  contentType: 'image' | 'text';
  mediaUrl: string | null;
  textContent: string | null;
  backgroundColor: string | null;
  viewCount: number;
  expiresAt: Date;
  createdAt: Date;
}

// Community
interface Community {
  id: string;
  name: string;
  description: string;
  rules: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  memberCount: number;
  isPrivate: boolean;
  createdBy: string;
  userRole: 'member' | 'moderator' | 'admin' | null;
  isJoined: boolean;
  createdAt: Date;
}

// Community Post
interface CommunityPost {
  id: string;
  communityId: string;
  community: Community;
  authorId: string;
  author: User;
  title: string;
  content: string;
  postType: 'text' | 'image' | 'link';
  mediaUrls: string[];
  upvotes: number;
  downvotes: number;
  score: number;
  commentCount: number;
  userVote: 'up' | 'down' | null;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: Date;
}

// Comment
interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string;
  author: User;
  content: string;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  replies: Comment[];
  isDeleted: boolean;
  createdAt: Date;
}

// Feed Post
interface FeedPost {
  id: string;
  authorId: string;
  author: User;
  content: string;
  postType: 'text' | 'image' | 'achievement';
  media: FeedPostMedia[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isDeleted: boolean;
  createdAt: Date;
}

interface FeedPostMedia {
  id: string;
  mediaUrl: string;
  mediaType: 'image';
  orderIndex: number;
}

// Notification
interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}
```

---

## 10. API Specifications

### 10.1 Authentication Header
```
Authorization: Bearer <access_token>
```

### 10.2 Request/Response Format
- Content-Type: `application/json`
- Date format: ISO 8601 (`2024-01-15T10:30:00Z`)
- Success: `{ "success": true, "data": {...} }`
- Error: `{ "success": false, "error": {...} }`

### 10.3 Pagination
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 10.4 Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 10.5 HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Server Error |

---

## 11. UI/UX Requirements

### 11.1 Design Principles
1. **Mobile-First**: Design for mobile, enhance for desktop
2. **Familiar Patterns**: Use Instagram/WhatsApp-like UX patterns
3. **Campus Pride**: Color accents per campus identity
4. **Fast & Fluid**: Instant feedback, smooth transitions
5. **Accessibility**: WCAG 2.1 AA compliance

### 11.2 Color Palette

```css
/* Primary Colors */
--primary: #2563EB;        /* Blue - Main brand */
--primary-dark: #1D4ED8;
--primary-light: #3B82F6;

/* Campus Colors */
--campus-pilani: #DC2626;   /* Red */
--campus-goa: #059669;      /* Green */
--campus-hyderabad: #7C3AED; /* Purple */
--campus-dubai: #D97706;    /* Orange */

/* Neutrals */
--background: #FFFFFF;
--surface: #F8FAFC;
--border: #E2E8F0;
--text-primary: #0F172A;
--text-secondary: #64748B;
--text-muted: #94A3B8;

/* Semantic */
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### 11.3 Typography
```css
/* Font Family */
font-family: 'Inter', -apple-system, sans-serif;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

### 11.4 Key Screens

#### Landing/Auth
- Landing page with value proposition
- Login form
- Register form
- Email verification (OTP)
- Onboarding flow (3-4 steps)

#### Main Navigation
- Bottom navigation (mobile): Home, Search, Create, Messages, Profile
- Side navigation (desktop): Expanded menu

#### Home/Feed
- Story bar at top
- Vertical scrolling feed
- Post cards with actions
- Pull to refresh

#### Discovery
- Search bar
- User search results
- Community search results
- Filter chips (campus, interests)

#### Messages
- Conversation list
- Chat view with messages
- Group info screen
- New message composer

#### Stories
- Story viewer (full screen, tap to navigate)
- Story creator
- Viewers list

#### Communities
- Community list/grid
- Community page with posts
- Post detail with comments
- Create community form

#### Profile
- Profile header with photo
- Tab navigation (Posts, Achievements, Communities)
- Edit profile form
- Settings screen

### 11.5 Component Library
Using Shadcn/ui components customized to brand:
- Button (variants: primary, secondary, ghost, destructive)
- Input, Textarea, Select
- Card, Avatar, Badge
- Dialog, Sheet, Popover
- Toast notifications
- Tabs, Accordion
- Dropdown menu
- Skeleton loaders

---

## 12. Security Requirements

### 12.1 Authentication Security
- Email domain validation (BITS only)
- Strong password requirements
- OTP verification with expiry
- JWT tokens with short expiry (15 min access, 7 day refresh)
- Secure HTTP-only cookies for tokens
- Rate limiting on auth endpoints

### 12.2 Data Security
- All traffic over HTTPS (TLS 1.3)
- Database encryption at rest
- Password hashing (bcrypt, cost 12)
- Parameterized queries (SQL injection prevention)
- Input sanitization (XSS prevention)
- CSRF tokens on forms
- File upload validation (type, size)

### 12.3 Privacy
- Minimal data collection
- User-controlled visibility settings
- Block functionality
- Report system
- Data export capability
- Account deletion (GDPR compliance)
- Clear privacy policy

### 12.4 API Security
- Rate limiting (100 req/min standard, 10 req/min auth)
- Request size limits
- API versioning
- CORS configuration
- Security headers (Helmet.js)

### 12.5 Content Moderation
- User reporting system
- Moderator tools for communities
- Admin dashboard for reports (Phase 2)
- Automated content filtering (Phase 3)

---

## 13. Success Metrics

### 13.1 Key Performance Indicators (KPIs)

#### Growth Metrics
| Metric | Target (6 months) | Target (1 year) |
|--------|-------------------|-----------------|
| Total Registered Users | 5,000 | 12,000 |
| Monthly Active Users (MAU) | 3,000 | 8,000 |
| Daily Active Users (DAU) | 1,500 | 4,000 |
| DAU/MAU Ratio | 50% | 50% |

#### Engagement Metrics
| Metric | Target |
|--------|--------|
| Avg. session duration | > 8 minutes |
| Messages sent per DAU | > 10 |
| Posts/comments per DAU | > 2 |
| Stories viewed per DAU | > 5 |
| Communities joined per user | > 3 |

#### Cross-Campus Metrics
| Metric | Target |
|--------|--------|
| Cross-campus connections | > 30% of total |
| Cross-campus messages | > 20% of total |
| Multi-campus communities | > 50% |

#### Retention Metrics
| Metric | Target |
|--------|--------|
| Day 1 retention | > 60% |
| Day 7 retention | > 40% |
| Day 30 retention | > 25% |

### 13.2 Technical Metrics
| Metric | Target |
|--------|--------|
| Page load time (P95) | < 3s |
| API response time (P95) | < 500ms |
| Error rate | < 0.1% |
| Uptime | 99.9% |

---

## 14. Release Plan

### 14.1 Phase 1: MVP
- Project setup (Next.js, Express, PostgreSQL)
- Database schema and migrations
- Authentication system (register, login, email verification)
- User profiles with campus and interests
- Connections (request, accept, reject, remove)
- User search and discovery
- Direct messaging (1:1) with real-time WebSocket
- Group chat creation and messaging
- Stories (create, view, expire)
- Feed posts (create, like, comment)
- Image upload system
- In-app notifications
- Communities (create, join, browse)
- Community posts, comments, and voting
- Bug fixes, optimization, and security hardening

### 14.2 Phase 2: Enhancement
- Advanced search and filters
- Story reactions and replies
- Notification preferences
- Push notifications
- PWA capabilities
- Profile achievements
- Community moderation tools

### 14.3 Phase 3: Scale
- Performance optimization
- CDN integration
- Elasticsearch for search
- Analytics dashboard
- Admin panel
- Content moderation system

### 14.4 Future Roadmap
- Native mobile apps (React Native)
- Alumni network integration
- Event management
- Job/internship board
- Marketplace
- Video calling

---

## 15. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low initial adoption | High | Medium | Pre-launch marketing, influencer partnerships, incentives |
| Email verification issues | High | Low | Multiple email provider support, manual verification backup |
| Spam/abuse | Medium | High | Moderation tools, reporting system, rate limiting |
| Performance issues at scale | High | Medium | Load testing, horizontal scaling, caching strategy |
| Data breach | Critical | Low | Security audits, encryption, minimal data collection |
| Feature creep | Medium | High | Strict MVP definition, regular prioritization reviews |
| Competition from existing platforms | Medium | Medium | BITS-specific features, community building |

---

## 16. Appendix

### 16.1 Predefined Interest Categories

```javascript
const interests = {
  "Sports": [
    "Cricket", "Football", "Basketball", "Badminton", "Tennis",
    "Table Tennis", "Chess", "Swimming", "Athletics", "Volleyball"
  ],
  "Technology": [
    "Web Development", "Mobile Development", "AI/ML", "Data Science",
    "Cybersecurity", "Blockchain", "Cloud Computing", "DevOps", "IoT"
  ],
  "Finance": [
    "Stock Trading", "Crypto", "Personal Finance", "Quant Finance",
    "Investing", "Economics"
  ],
  "Arts & Entertainment": [
    "Music", "Dance", "Photography", "Videography", "Film Making",
    "Short Films", "Writing", "Poetry", "Stand-up Comedy", "Theatre"
  ],
  "Gaming": [
    "PC Gaming", "Mobile Gaming", "Console Gaming", "Esports",
    "Game Development"
  ],
  "Academics": [
    "Research", "Competitive Programming", "Robotics", "Electronics",
    "Mathematics", "Physics"
  ],
  "Lifestyle": [
    "Fitness", "Travel", "Food", "Reading", "Anime", "Movies",
    "TV Series", "Fashion", "Cooking"
  ],
  "Social Impact": [
    "Environment", "Education", "Social Entrepreneurship", "Volunteering"
  ]
}
```

### 16.2 Default Communities to Seed

```javascript
const defaultCommunities = [
  // Campus-specific
  { name: "BITS Pilani", description: "Everything about Pilani campus" },
  { name: "BITS Goa", description: "Everything about Goa campus" },
  { name: "BITS Hyderabad", description: "Everything about Hyderabad campus" },
  { name: "BITS Dubai", description: "Everything about Dubai campus" },

  // Interest-based
  { name: "Cricket Club", description: "For all cricket enthusiasts" },
  { name: "Stock Traders", description: "Trading discussions and tips" },
  { name: "Coding & DSA", description: "DSA practice and coding discussions" },
  { name: "Placement Prep", description: "Interview prep and experiences" },
  { name: "Music Lovers", description: "Share and discuss music" },
  { name: "Filmmakers", description: "Short films and video creation" },
  { name: "Fitness Freaks", description: "Gym, nutrition, and health" },
  { name: "Anime & Manga", description: "Anime discussions and recommendations" },
  { name: "Memes", description: "BITS memes and humor" },
  { name: "Tech News", description: "Latest in technology" },
  { name: "Startups", description: "Entrepreneurship and startup ideas" },
  { name: "Research Papers", description: "Academic research discussions" },
  { name: "Gaming Zone", description: "PC, mobile, and console gaming" },
  { name: "Photography", description: "Share your clicks" },
  { name: "Travel Stories", description: "Travel experiences and tips" }
]
```

### 16.3 Email Regex Pattern

```javascript
const BITS_EMAIL_REGEX = /^[a-z]\d{8}@(pilani|goa|hyderabad|dubai)\.bits-pilani\.ac\.in$/i;

// Examples:
// Valid: f20220808@hyderabad.bits-pilani.ac.in
// Valid: f20210123@pilani.bits-pilani.ac.in
// Invalid: f20220808@bits-pilani.ac.in
// Invalid: random@hyderabad.bits-pilani.ac.in
```

### 16.4 Notification Types

```javascript
const notificationTypes = {
  // Connections
  CONNECTION_REQUEST: 'connection_request',
  CONNECTION_ACCEPTED: 'connection_accepted',

  // Messages
  NEW_MESSAGE: 'new_message',
  GROUP_ADDED: 'group_added',

  // Stories
  STORY_REACTION: 'story_reaction',
  STORY_REPLY: 'story_reply',

  // Feed
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  COMMENT_REPLY: 'comment_reply',

  // Communities
  COMMUNITY_POST: 'community_post',
  POST_UPVOTE: 'post_upvote',
  COMMENT_MENTION: 'comment_mention',

  // System
  WELCOME: 'welcome',
  SYSTEM_ANNOUNCEMENT: 'system_announcement'
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-31 | Enosh | Initial PRD creation |
