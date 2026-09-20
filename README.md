<div align="center">

# old.xalhexi.wtf

**Personal File Hub + Realtime Multi-Room Chat + Document & Media Preview Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-20232a?logo=react&logoColor=61dafb)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-0f172a?logo=tailwindcss&logoColor=38bdf8)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white)](https://vercel.com)

---

*A private, self-hosted workspace replacing the need to shuffle files and messages across Google Drive, Messenger, and Facebook.*  
*Includes a minimalist, editorial developer landing page and portfolio showcase.*

[**Live Web App: old.xalhexi.wtf**](https://old.xalhexi.wtf) • [**Workspace Hub**](https://old.xalhexi.wtf/hub) • [**Portfolio '24**](http://xalhexi.my.canva.site/)

</div>

---

## Overview

**old.xalhexi.wtf** is an all-in-one personal productivity platform and developer home built for personal and small trusted group collaboration.

- **Editorial Developer Showcase (`/`)**: Dark, brutalist, minimal developer profile highlighting engineering projects, creative portfolio on Canva, and GitHub ecosystem.
- **Private Personal Hub (`/hub`)**: Authenticated workspace featuring real-time multi-room chat, high-speed file storage, and instant document previews.
- **Whitelist Security Gate (`/login`)**: Strict access control backed by Supabase Auth and database-level `allowed_users` whitelist policies.

---

## Core Features

### 📁 File Hub & Storage
- **Direct Client-to-Supabase Uploads**: Bypasses Vercel’s 4.5MB serverless payload restriction, allowing large images, documents, and assets to be uploaded seamlessly.
- **Visual Thumbnail Grid**: Crisp, responsive card grid with live CDN-cached image thumbnails and detailed metadata (file size, type, uploader, timestamp).
- **Instant Search & Realtime Sync**: Search files by filename in real-time, with automatic synchronization across all active devices.

### 💬 Realtime Multi-Room Chat
- **Multi-Room Channels**: Dedicated topic rooms including `#General`, `#Urian`, `#xalhexi-films`, and `#Personal`.
- **Instant Live Messaging**: Sub-second message delivery powered by Supabase Realtime WebSocket subscriptions with optimistic UI updates.
- **Custom Room Creator**: Create and archive private channels on demand.

### 🔍 Document & Media Preview
- **High-Resolution Lightbox**: Zero-latency preview for PNG, JPG, JPEG, and WebP with responsive pan, zoom, and direct download options.
- **Inline PDF Reader**: Embedded reader for documents, slide decks, and study material.
- **Office Document Previews**: Integrated metadata viewer with hooks ready for self-hosted Gotenberg and OnlyOffice inline rendering.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org) | Server Components, dynamic streaming, and client transitions |
| **UI Library** | [React 19](https://react.dev) | Reactive components and state synchronization |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Editorial dark aesthetic, custom gradients, and CSS variables |
| **Icons & Notifications** | [Lucide React](https://lucide.dev) & [Sonner](https://sonner.emilkowal.ski) | Crisp UI icons and toast notifications |
| **Database & Auth** | [Supabase PostgreSQL](https://supabase.com) | User authentication, RLS security policies, and whitelist check |
| **Storage & CDN** | [Supabase Storage](https://supabase.com/storage) | Bucket-based file storage with public CDN caching |
| **Realtime Engine** | [Supabase Realtime](https://supabase.com/realtime) | WebSocket message broadcast and presence sync |
| **Deployment** | [Vercel](https://vercel.com) | Edge deployment connected to GitHub CI/CD |

---

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SUPABASE_SERVICE_ROLE_KEY>
```

> **Note**: For production deployments on Vercel, ensure these environment variables are added under **Project Settings → Environment Variables**.

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/xalhexi-sch/xalhexi-sch.github.io.git
cd xalhexi-sch.github.io

# Install dependencies with pnpm
pnpm install

# Run database migrations in Supabase SQL Editor
# (Copy schema from supabase/schema.sql)

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page, or navigate to `/login` to access the hub.

---

## Author & Ecosystem

Crafted with care by **Michael Nas** (**xalhexi**):

- **Live Site**: [old.xalhexi.wtf](https://old.xalhexi.wtf)
- **Portfolio**: [xalhexi.my.canva.site](http://xalhexi.my.canva.site/)
- **GitHub Profiles**:
  - [@xalhexi-sch](https://github.com/xalhexi-sch) (Academic & Primary Repos)
  - [@xalhexi](https://github.com/xalhexi) (Main Profile)
  - [@xalhexidev](https://github.com/xalhexidev) (Developer Projects)

---

<div align="center">
  <sub>Built for private workflows. No AI slop. 2026.</sub>
</div>
