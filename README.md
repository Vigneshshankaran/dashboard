# SeniorCare Dashboard

A web dashboard for monitoring senior residents — live health vitals, fall alerts, devices, guardians, and monitors. Built with React, TypeScript, and Material UI.

---

## How to run the app

You only need these two commands (run them inside this folder):

```bash
npm install     # one time only — downloads everything the app needs
npm run dev     # starts the app — open http://localhost:4200 in your browser
```

Sign in with your **email and password** on the login screen.

Other useful commands:

| Command | What it does |
|---|---|
| `npm run dev` | Runs the app on your computer for development |
| `npm run build` | Packages the app for putting on a real server |
| `npm run lint` | Checks the code for common mistakes |

---

## File structure (plain-English tour)

Think of the project like a house: a few rooms matter day-to-day, and the rest is plumbing you rarely touch.

```
dashboard/
│
├── index.html            ← The single web page the whole app lives inside
├── package.json          ← Shopping list of tools/libraries the app uses
├── vite.config.ts        ← Settings for the dev server (port 4200 + connects to the backend)
├── .env                  ← The backend web address the app talks to
│
├── docs/
│   └── API_SCHEMA.md     ← Full list of backend endpoints — check & update here
│
├── public/               ← Images/icons served as-is (favicon etc.)
├── dist/                 ← Auto-generated "ready to ship" copy of the app (never edit)
├── node_modules/         ← Auto-downloaded libraries (never edit)
│
└── src/                  ← ★ ALL the actual app code lives here ★
    │
    ├── main.tsx          ← The "power switch" — starts the app
    ├── App.tsx           ← The "traffic controller" — decides: not logged in?
    │                        show Login. Logged in? show the dashboard, and
    │                        switches between pages when you click the sidebar
    │
    ├── pages/            ← One file = one full screen you can visit
    │   ├── Login.tsx     ←   Sign-in screen (email & password)
    │   ├── Dashboard.tsx ←   Home screen with overview metrics
    │   ├── Seniors.tsx   ←   List of seniors + detailed resident profiles
    │   ├── Users.tsx     ←   Manage user accounts
    │   ├── Devices.tsx   ←   Manage wearable/monitoring devices
    │   ├── Guardians.tsx ←   Family members / guardians
    │   ├── Monitors.tsx  ←   Staff who watch over seniors
    │   ├── Alerts.tsx    ←   Fall alerts and notifications
    │   └── Profile.tsx   ←   Your own account settings
    │
    ├── components/       ← Reusable building blocks shared by the pages
    │   ├── Layout.tsx    ←   The overall frame (sidebar + top bar + content area)
    │   ├── Sidebar.tsx   ←   Left navigation menu
    │   ├── Topbar.tsx    ←   Bar across the top (title, your avatar, logout)
    │   ├── MetricsGrid.tsx   Stat cards on the dashboard
    │   ├── SystemStatus.tsx  "Is everything online?" panel
    │   ├── QuickActions.tsx  Shortcut buttons
    │   └── FallAlertModal.tsx Pop-up when a fall is detected
    │
    ├── api/              ← Everything about talking to the backend server
    │   ├── client.ts     ←   The "telephone" — sends requests, attaches your
    │   │                     login token, handles errors
    │   ├── services.ts   ←   The "phone book" — every backend action the app
    │   │                     can ask for (sign in, get seniors, get alerts…)
    │   ├── types.ts      ←   Descriptions of the data shapes sent/received
    │   └── index.ts      ←   Front door of this folder (re-exports the above)
    │
    ├── theme/
    │   └── theme.ts      ← Colors, fonts, and styling rules for the whole app
    │
    ├── assets/           ← Images used inside the app
    └── index.css         ← A few global page styles
```

### How a typical action flows through the app

When you click **Seniors** in the sidebar:

1. **Sidebar.tsx** tells **App.tsx** "the user picked Seniors"
2. **App.tsx** shows the **pages/Seniors.tsx** screen inside **Layout.tsx**
3. **Seniors.tsx** asks **api/services.ts** for the list of seniors
4. **api/client.ts** phones the backend server (address set in `.env` / `vite.config.ts`) and includes your login token
5. The data comes back and the page draws it on screen

### Logging in

There is **one way to sign in: email + password** (the old mobile-OTP option was removed). After a successful sign-in the app stores a token in your browser, and every later request to the backend carries that token automatically. **Logout** (top-right menu) clears it.

---

## Putting it on the internet (production)

The app calls the backend via `/api` on its own domain — the host forwards
those calls to the real backend server-side, so the browser never makes a
cross-origin request and **CORS is never an issue**.

- **Vercel:** already configured — `vercel.json` forwards `/api/*` to the
  backend and serves `index.html` for page URLs. Just deploy the repo.
- **Netlify:** already configured — `public/_redirects` does the same.
- **Other hosts:** either set up an equivalent `/api` reverse proxy, or set
  `VITE_API_BASE_URL` in `.env` to the full backend URL before
  `npm run build` — but then the backend team must allow your site's domain
  in their CORS settings.

If the backend address ever changes, update it in three places:
`vercel.json`, `public/_redirects`, and `vite.config.ts` (dev proxy).

## Where to change common things

| I want to change… | Edit this file |
|---|---|
| Colors / fonts | `src/theme/theme.ts` |
| The sidebar menu items | `src/components/Sidebar.tsx` and `src/App.tsx` |
| The login screen | `src/pages/Login.tsx` |
| What a page shows | The matching file in `src/pages/` |
| The backend server address | `.env` and `vite.config.ts` |
| A backend endpoint or data shape | `docs/API_SCHEMA.md` + `src/api/services.ts` + `src/api/types.ts` |
