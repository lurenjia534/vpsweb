# VPS_MONITOR

A brutalist real-time VPS monitoring dashboard built with **Next.js 15** and **React 19**. Register an account to sync your VPS connections to a local database, then add WebSocket endpoints to view live CPU, memory, disk and network metrics with `framer-motion` animations.

## Features

- Register and log in to manage VPS connections with server-side persistence.
- Real-time status updates over WebSocket.
- Add and remove connections using an animated modal dialog.
- Responsive layout optimized for desktop and mobile.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open <http://localhost:3000> in your browser to view the app.

## Build and Start

Create an optimized production build:

```bash
npm run build
```

Then start the server:

```bash
npm start
```

## Architecture

- **Frontend:** Next.js 15 and React 19 with Tailwind CSS and framer-motion.
- **Backend:** Next.js API routes for login, registration and connection management.
- **Database:** SQLite via better-sqlite3 and Drizzle ORM to store users and VPS connections.
- **Auth:** Passwords hashed with bcrypt and authenticated via JWT tokens.
- **Real-time:** Metrics streamed from your servers over WebSockets.

## Project Structure

- `src/app` – application pages and global layout. Includes API routes under
  `src/app/api` for authentication and connection management.
- `src/components` – React UI pieces such as `VPSCard` and `AddVPSModal`.
- `src/hooks` – custom hooks like `useWebSocketManager`.
- `src/lib` – shared libraries for the backend including the API client,
  authentication helpers and SQLite database setup.
- `src/types` – common TypeScript interfaces.
- `src/utils` – utility helpers.

## Adding a VPS Connection

Click the **+ ADD VPS** button on the homepage and enter a name and the WebSocket URL of your VPS probe (for example `ws://127.0.0.1:8080/ws`). Connections are stored in the database and linked to your account.

---

Crafted with ❤️ for quick VPS monitoring experiments.
