# Shelves Builder prototype

## Run locally

```bash
pnpm install
pnpm dev
```

## Publish a review link with Vercel

1. Create a new GitHub repository and push this folder to it.
2. In Vercel, select **Add New → Project**, then import that repository.
3. Vercel detects Vite automatically. Leave the defaults (`pnpm run build`, output directory `dist`) and select **Deploy**.
4. Send the generated `https://…vercel.app` URL to reviewers.

The prototype stores saved layouts and the login session in each reviewer's browser, so those records are not shared between reviewers.
