Chime — Real‑Time Chat Application

A modern, production‑ready chat app focused on speed, reliability, and developer joy. Chime ships with a clean UI, Firebase‑powered real‑time messaging, authentication, and an auto‑deploy pipeline (v0.dev → GitHub → Vercel) so changes go live instantly.

Elevator pitch: Chime is a lightweight, extensible chat starter you can ship today and scale tomorrow—DMs, rooms, presence, typing indicators, media, the works.

✨ Features

Real‑time messages with Firestore snapshots (sub‑second delivery).

Auth via Firebase Authentication (Email/Password, Google optional).

DMs & Rooms (1:1 and multi‑user channels).

Typing indicators with per‑room ephemeral state.

Presence (online/away/last seen).

Read receipts (delivered/seen + seenBy[]).

Attachments (images/files) via Firebase Storage with secure rules.

Search & pagination (fast scrollback using indexed queries).

Responsive UI (mobile‑first, keyboard‑friendly).

Offline support (Firestore persistence + optimistic UI).

Auto‑deploy workflow (v0.dev → GitHub → Vercel).

Optional add‑ons: push notifications (FCM), link unfurling, message reactions, message editing/deleting with audit trail.

🔗 Live Demo

Vercel preview: https://vercel.com/mellisas-projects-b938dd2d/v0-chime-chat-application

Repository: https://github.com/beltasia/chime

🧱 Architecture Overview

Stack

Framework: Next.js + React (App Router)

Language: TypeScript

Realtime & Auth: Firebase (Firestore, Auth)

Presence: Firebase Realtime Database (recommended) or Firestore fallback

Storage: Firebase Storage (attachments)

Styling: Tailwind CSS

Deployment: Vercel

Data Flow (high‑level)

UI (React components)
   ↓              ↑
   ↓ Firestore snapshots (realtime updates)
   ↓              ↑
Firebase SDK  —  Auth (users) / Firestore (rooms/messages) / RTDB (presence)
   ↓
Vercel (hosting) — CI/CD via GitHub pushes


