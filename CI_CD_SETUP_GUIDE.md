# BrixxSpace CI/CD Setup & Secrets Configuration Guide

This guide details how to configure GitHub Actions Secrets and manage the automated testing and deployment pipelines for **BrixxSpace** (Frontend & Backend).

---

## 1. Pipelines Overview

| Workflow | File | Trigger | Purpose |
| :--- | :--- | :--- | :--- |
| **Continuous Integration (CI)** | `.github/workflows/ci.yml` | Pull Request / Push to `main`/`develop` | Runs ESLint, TypeScript check, Vitest unit & integration tests, and verifies production bundle build. |
| **Frontend Deployment** | `.github/workflows/frontend-deploy.yml` | Merge/Push to `main` or Manual Dispatch | Builds Vite app and deploys to **Firebase Hosting** (`brixxspace72.web.app`). |
| **Backend Deployment** | `.github/workflows/backend-deploy.yml` | Merge/Push to `main` or Manual Dispatch | Dispatches deploy signal to **Render** Web Service or deploys to **Vercel Serverless**. |
| **Healthcheck & Uptime** | `.github/workflows/healthcheck.yml` | Daily Schedule or Manual Dispatch | Pings the live production URLs to ensure 100% uptime. |

---

## 2. GitHub Repository Secrets Setup

Navigate to your GitHub repository:
👉 **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 2.1. Frontend Secrets (Firebase Hosting)

| Secret Name | Description | Where to Find |
| :--- | :--- | :--- |
| `FIREBASE_SERVICE_ACCOUNT_BRIXXSPACE72` | Firebase Service Account JSON key | **Google Cloud Console** / **Firebase Console** → Project Settings → Service accounts → Generate private key |
| `FIREBASE_TOKEN` *(Alternative)* | Firebase CLI deploy token | Run `firebase login:ci` locally in terminal to generate token |
| `VITE_API_URL` | Production Backend API URL | e.g. `https://api.brixxspace.com/api` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | Cloudinary Dashboard |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Upload Preset | Cloudinary Settings → Upload |

### 2.2. Backend Secrets (Render / Vercel)

| Secret Name | Description | Where to Find |
| :--- | :--- | :--- |
| `RENDER_DEPLOY_HOOK_URL` | Render Web Service Deploy Hook | **Render Dashboard** → Your Web Service → Settings → Deploy Hook |
| `VERCEL_TOKEN` *(If using Vercel)* | Vercel Personal Access Token | **Vercel Dashboard** → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel Organization ID | Found in `backend/.vercel/project.json` after running `vercel link` |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Found in `backend/.vercel/project.json` |

---

## 3. Running Tests Locally

### Frontend Test Suite
```bash
# Run all frontend tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run TypeScript type check
npm run typecheck

# Run production build validation
npm run build
```

### Backend Test Suite
```bash
# Run all backend tests
cd backend
npm test

# Run in watch mode
npm run test:watch
```

---

## 4. Release & Deployment Flow

```
1. Feature Development  ──>  git checkout -b feature/awesome-feature
2. Local Verification   ──>  npm test (Frontend & Backend)
3. Pull Request (PR)    ──>  Automated GitHub Actions CI validation runs
4. Merge to main        ──>  CI passes -> Frontend deploys to Firebase -> Backend deploys to Render/Vercel
5. Healthcheck          ──>  Automatic smoke test confirms 200 OK status
```
