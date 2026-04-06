# Budget Tracker

A **Next.js** web app for tracking monthly income, spending categories, and individual expenses. Data syncs in real time with **Firebase Authentication** and **Cloud Firestore**.

## Features

- **Year / month navigation** — Browse budgets by calendar year and month.
- **Categories & expenses** — Per-month categories with spending caps, transactions, and reordering.
- **Default categories** — Define a template list that can apply to future months.
- **Dashboard** — Summary view with month cards and budget progress.
- **Authentication** — Sign in with **email**, **Google**, or **guest (anonymous)**. Guest accounts receive sample data for the current period so the app is easy to try without signing up.

## Tech stack

| Layer     | Choice                                                                                     |
| --------- | ------------------------------------------------------------------------------------------ |
| Framework | [Next.js](https://nextjs.org/) 14 (Pages Router)                                           |
| UI        | React 18, [Tailwind CSS](https://tailwindcss.com/), [Headless UI](https://headlessui.com/) |
| Charts    | [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)  |
| Backend   | [Firebase](https://firebase.google.com/) Auth + Firestore                                  |
| Auth UI   | [react-firebaseui](https://github.com/firebase/firebaseui-web-react)                       |

**Node.js:** 18 or newer (see `package.json` → `engines`).

## Prerequisites

1. [Node.js](https://nodejs.org/) 18+
2. A [Firebase](https://console.firebase.google.com/) project with:
   - **Authentication** — Enable **Email/Password**, **Google**, and **Anonymous** (guest mode shows a clear in-app error if Anonymous is disabled).
   - **Cloud Firestore** — Create a database and set [security rules](https://firebase.google.com/docs/firestore/security/get-started) appropriate for your deployment (e.g. users can only read/write their own documents).

## Getting started

Clone the repository, install dependencies, and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If another process is already using port 3000, Next.js may choose **3001** — use the URL shown in the terminal.

### Firebase configuration

Client SDK settings live in `firebase/firebase.js` (project id, api key, etc.). For a fork or production deploy, create your own Firebase project and replace that config, or move values into environment variables and inject them at build time.

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Development server (hot reload) |
| `npm run build` | Production build                |
| `npm run start` | Serve the production build      |
| `npm run lint`  | Run ESLint (Next.js config)     |

## Project layout (overview)

```
pages/              # Routes: home, dashboard, month/[month]
components/         # UI (modals, cards, navbar, charts, …)
context/            # Auth + user data providers
firebase/           # Firebase init + Firestore helpers
hooks/              # Page/feature hooks (dashboard, month, category card, …)
helperFunctions/    # Small pure helpers
styles/             # Global CSS (+ Tailwind)
utils/              # Shared constants (e.g. month names)
```

## Deploying

You can host the static/SSR output on [Vercel](https://vercel.com/) or any platform that supports Next.js. Configure the same Firebase project (or environment-specific project) and ensure Firestore rules and Auth providers match your production domain if you use authorized domains for OAuth.
