This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy on Akash

This project includes a `Dockerfile` and `deploy-akash.yaml` (SDL) to deploy on the decentralized Akash Network using the Akash Console.

### 1. Build & Push Image

Replace `<YOUR_DOCKER_IMAGE>` in `deploy-akash.yaml` with your repo, e.g. `docker.io/youruser/vericert:latest`.

```bash
docker build -t youruser/vericert:latest .
docker push youruser/vericert:latest
```

### 2. Open Akash Console

Go to https://console.akash.network -> Deploy -> Create Deployment.

Choose "SDL Builder" or "Upload" and paste the contents of `deploy-akash.yaml` (with the image replaced).

### 3. Adjust Resources (Optional)

Modify `resources` in the SDL if you need smaller specs. The current SDL asks for:
- CPU: 2 units
- Memory: 6Gi
- Storage: 10Gi

### 4. Submit & Select Provider

After the lease is created, pick a provider bid and approve it with your wallet.

### 5. Access the App

The exposed port 3000 is mapped to port 80 globally. Once the lease is active, use the provider URI shown in the Console.

### Notes

- We enabled `output: "standalone"` in `next.config.ts` for a slimmer runtime image.
- `@napi-rs/canvas` requires native libs; the Dockerfile installs them for Alpine.
- If you change dependencies, rebuild & push a new tag, then update the SDL with the new image tag and redeploy.

### Quick Redeploy

1. Update code
2. `docker build -t youruser/vericert:v2 .`
3. `docker push youruser/vericert:v2`
4. Duplicate previous deployment in Akash Console, update image tag, deploy.

### GitHub Actions (CI)

A workflow `.github/workflows/docker-build.yml` builds & pushes images on every push to `main`.

Required GitHub repo secrets:
- `DOCKERHUB_USERNAME` – your Docker Hub username
- `DOCKERHUB_TOKEN` – a PAT (Docker Hub access token) with write access

After a push, grab the short SHA tag (printed in logs) to update `deploy-akash.yaml` if you want an immutable deployment instead of `latest`.

