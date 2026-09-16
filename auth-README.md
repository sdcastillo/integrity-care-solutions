# Google Auth Gate (soft)

Client-side gate using Google Identity Services. Not hard security — anyone can bypass by hitting files directly or disabling JS. Fine for keeping casual visitors out.

## Files
- `auth.js` — gate logic + config. Replace `CLIENT_ID = 'ABC123'` with your real OAuth client ID.
- `callback.html` — the sign-in page. Redirects back to the page the user was trying to view.

## Setup
1. In Google Cloud Console (same project as predictiveinsightsai.com), create a **new** OAuth 2.0 Client ID (Web application).
2. Add `https://my-integrity-hub.org` as an Authorized JavaScript origin.
3. Copy the client ID into `auth.js` (`CLIENT_ID`).
4. Merge this branch and let GitHub Pages deploy.

## How it works
- Every page loads `auth.js` (via the injected script tag in each HTML file).
- If not authenticated, the user is sent to `/callback`.
- On the callback page they click "Sign in with Google".
- We check the email ends in `@gmail.com`, set a flag in `localStorage`, and redirect back.
- To sign out: clear `localStorage` key `ics_auth_v1` (or add a sign-out link later).

## Callback URL
`https://my-integrity-hub.org/callback`
