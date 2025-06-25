# VPS_MONITOR

A brutalist real-time VPS monitoring dashboard built with **Next.js 15** and **React 19**. Add WebSocket endpoints for your servers and view live CPU, memory, disk, and network statistics with smooth animations powered by `framer-motion`.

## Features

- Manage VPS connections in the browser (persisted via `localStorage`).
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

## Project Structure

- `src/app` – application pages and global layout.
- `src/components` – React components (`VPSCard`, `AddVPSModal`).
- `src/hooks` – custom hooks (`useWebSocketManager`).
- `src/utils` – utility helpers.

## Adding a VPS Connection

Click the **+ ADD VPS** button on the homepage and enter a name and the WebSocket URL of your VPS probe (for example `ws://127.0.0.1:8080/ws`). Metrics are stored locally; no server-side configuration is required.

---

Crafted with ❤️ for quick VPS monitoring experiments.
