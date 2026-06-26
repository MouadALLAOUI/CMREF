# Production Checklist — Biblio (Frontend)

## 1. Environment Variables

Create `.env.production` (or set these in your hosting dashboard):

```env
REACT_APP_API_URL=https://api.votredomaine.com/api
REACT_APP_ENV=Production
REACT_APP_REVERB_APP_KEY=
REACT_APP_REVERB_HOST=
REACT_APP_REVERB_PORT=
REACT_APP_REVERB_SCHEME=https
```

- **REACT_APP_API_URL** — Must point to the production Laravel backend (`https://.../api`). No trailing slash.
- **REACT_APP_ENV** — Set to anything except `"Development"` to disable `logger` (no-op) and suppress console noise.
- **Reverb/WebSocket** — Leave empty if not using real-time features in production.

## 2. Netlify-Specific Setup

Create `biblio/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures all SPA client-side routes (`/dash/...`, `/REP/...`, etc.) fall back to `index.html` instead of returning 404.

If you prefer a `_redirects` file instead, create `biblio/public/_redirects`:

```
/*    /index.html    200
```

## 3. Backend CORS Configuration

In `nexgen-lms/.env` (production server), update:

```env
FRONTEND_URL=https://your-app.netlify.app
CORS_ALLOWED_ORIGINS=https://your-app.netlify.app
```

Both `FRONTEND_URL` and `CORS_ALLOWED_ORIGINS` must include **your exact Netlify domain** (no trailing slash). Supports comma-separated values for multiple domains:

```env
CORS_ALLOWED_ORIGINS=https://your-app.netlify.app,https://your-custom-domain.com
```

The backend `config/cors.php` already sets:
- `supports_credentials = true` (required for Sanctum SPA auth)
- `allowed_origins` from the above env vars

## 4. Build & Deploy

```bash
cd biblio
npm run build
```

Output goes to `build/`. Upload this folder to your hosting or connect your Git repo to Netlify (build command: `npm run build`, publish directory: `build`).

## 5. Verify

- [ ] Login flow works (Sanctum CSRF cookie + token)
- [ ] All CRUD pages load data (no CORS errors in console)
- [ ] File uploads (chèque images) reach the backend
- [ ] Multi-season selection persists
- [ ] Season access manager shows only active seasons
- [ ] DOCX export downloads correctly (100% client-side, no backend needed)
- [ ] `REACT_APP_ENV` is NOT `"Development"` — no `console.log` spew

## 6. HTTPS

- **Required** for Sanctum `withCredentials: true` to work across origins.
- Netlify provides HTTPS automatically on `*.netlify.app` domains and custom domains.
- The backend API must also serve over HTTPS.

## 7. Troubleshooting

| Symptom | Likely Fix |
|---|---|
| Login returns 419 | Backend CSRF excluded `api/*`? Check `bootstrap/app.php` |
| CORS error in console | Add the Netlify domain to `CORS_ALLOWED_ORIGINS` on the backend |
| Blank page on route refresh | Add the `/* → /index.html` redirect rule |
| `REACT_APP_API_URL` not found | Variables must be set **before** build (CRA embeds them at build time, not runtime) |
| Mixed content (HTTP/HTTPS) | Ensure both frontend and backend use HTTPS |
