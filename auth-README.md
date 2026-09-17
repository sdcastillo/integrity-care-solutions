# Auth0 Gate (soft)

Client-side gate using Auth0 SPA SDK (auth0-spa-js). Not hard security — anyone can bypass by hitting files directly or disabling JS. Fine for keeping casual visitors out.

## Files
- `auth.js` — gate logic + config. Replace `AUTH0_DOMAIN` placeholder (client ID already set from serviceAuthorization.md).
- `callback.html` — the sign-in page. Redirects back to the page the user was trying to view.

## Setup
1. Create a new Auth0 tenant (or application) — no Google products required.
2. In the Auth0 Dashboard, create a **Single Page Application**.
3. Set these URLs:
   - Allowed Callback URLs: `https://my-integrity-hub.org/callback`
   - Allowed Logout URLs: `https://my-integrity-hub.org/`
   - Allowed Web Origins: `https://my-integrity-hub.org`
4. Copy the **Domain** into `auth.js` (client ID is already populated).
5. Merge this branch and let GitHub Pages deploy.

## How it works
- Every page loads `auth.js` (via the injected script tag in each HTML file).
- If not authenticated, the user is sent to `/callback`.
- On the callback page they click "Sign in" → redirected to Auth0 Universal Login.
- After login, Auth0 redirects back to `/callback`, we store a flag in `localStorage`, and redirect to the original page.
- To sign out: call `window.ICSAuth.logout()` (or clear `localStorage` key `ics_auth_v1`).

## Callback URL
`https://my-integrity-hub.org/callback`
