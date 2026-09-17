# Integrity Care Resources — Backup Instructions

Use this when you want to save a local copy of the repo (including the Auth0 gate work) for later use or offline backup.

## Quick clone + zip

```bash
git clone https://github.com/sdcastillo/integrity-care-solutions.git
cd integrity-care-solutions
git checkout feature/google-auth-gate
cd ..
zip -r integrity-care-solutions-backup.zip integrity-care-solutions
```

## Notes

- The branch `feature/google-auth-gate` contains the Auth0 client-side gate (`auth.js`, `callback.html`) and the expanded Who We Serve content.
- `serviceAuthorization.md` holds the Auth0 client ID (public by design). Do **not** commit the client secret.
- Large media files (images, heif) are included; the zip will be several hundred MB.
- After zipping, you can upload `integrity-care-solutions-backup.zip` to Google Drive or any other storage.

## Related

- Live site (main): https://my-integrity-hub.org
- Auth branch PR: https://github.com/sdcastillo/integrity-care-solutions/pull/3
