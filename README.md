# AI Quiz Generator

An AI-powered web application designed to help students automatically generate high-yield multiple-choice quizzes from their study materials and lecture notes.

---

## 1. Project Overview

Students frequently spend excessive time manually formulating practice questions rather than testing and reinforcing their understanding. **AI Quiz Generator** streamlines this process by extracting knowledge from raw text notes and uploaded PDF documents, generating structured practice quizzes with multiple-choice questions, and providing instant grading with thorough explanations for every question.

### Status & Roadmap

| Feature / Capability | Status | Phase |
|---|---|---|
| **Project Foundation & Monorepo Structure** | **Completed** | Phase 1 |
| **Strict TypeScript & ESLint Environment** | **Completed** | Phase 1 |
| **Tailwind CSS UI Foundation & Design System** | **Completed** | Phase 1 |
| **Backend Express Server & Health API (`/api/v1/health`)** | **Completed** | Phase 1 |
| **Vitest & Supertest Testing Harness** | **Completed** | Phase 1 |
| **Zod Schema & Error-Handling Middleware** | **Completed** | Phase 1 |
| **AI Quiz Generation Service (OpenAI SDK)** | *Planned* | Phase 2 |
| **PDF Lecture Note Extraction (`pdf-parse`)** | *Planned* | Phase 2 |
| **Interactive Quiz Runner UI & Real-Time Grading** | *Planned* | Phase 3 |
| **Local Storage Quiz Persistence & History View** | *Planned* | Phase 3 |
| **Database Persistence (PostgreSQL & Prisma ORM)** | *Future Extension* | Phase 4 |

---

## 2. Technology Stack

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript 5.9](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool:** [Vite 8](https://vite.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Testing:** [Vitest](https://vitest.dev/) with `@testing-library/react` and `jsdom`
- **Linter:** [ESLint 10](https://eslint.org/) with `typescript-eslint`

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (v24 LTS compatible)
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** [TypeScript 5.9](https://www.typescriptlang.org/) (Strict Mode)
- **AI Integration:** [OpenAI Node SDK](https://github.com/openai/openai-node)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Configuration:** [dotenv](https://github.com/motdotla/dotenv)
- **PDF Extraction:** `pdf-parse`
- **Testing:** [Vitest](https://vitest.dev/) & [Supertest](https://github.com/ladjs/supertest)
- **Dev Execution:** `tsx` (fast ESM/TypeScript watcher)

---

## 3. Project Structure

```
AI-Quiz-Generator/
├── frontend/                     # React + TypeScript + Vite client
│   ├── public/                   # Static assets (favicons, etc.)
│   ├── src/
│   │   ├── assets/               # Image and graphic assets
│   │   ├── components/           # Reusable UI components (Header, etc.)
│   │   ├── layouts/              # Page layout wrappers
│   │   ├── pages/                # High-level route pages
│   │   ├── services/             # API client services (Axios)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── types/                # Shared TypeScript type definitions
│   │   ├── utils/                # Helper utilities (localStorage manager)
│   │   ├── test/                 # Test setup and mocks
│   │   ├── App.tsx               # Main application component
│   │   ├── App.test.tsx          # Component unit tests
│   │   ├── main.tsx              # React DOM entry point
│   │   └── index.css             # Tailwind CSS entry stylesheet
│   ├── .env                      # Local frontend environment variables
│   ├── .env.example              # Example public frontend variables
│   ├── eslint.config.js          # ESLint flat configuration
│   ├── package.json              # Frontend scripts & dependencies
│   ├── tsconfig.json             # Root TypeScript project references
│   ├── tsconfig.app.json         # Strict TypeScript compiler options
│   ├── vite.config.ts            # Vite bundler configuration
│   └── vitest.config.ts          # Vitest frontend testing configuration
│
├── backend/                      # Express + TypeScript server
│   ├── src/
│   │   ├── config/               # Environment & configuration parser (Zod)
│   │   ├── controllers/          # Request handlers (Health, etc.)
│   │   ├── middleware/           # Express middleware (CORS, error handler)
│   │   ├── routes/               # Modular Express route definitions
│   │   ├── schemas/              # Zod validation schemas
│   │   ├── services/             # Business logic (AI client, PDF processing)
│   │   ├── utils/                # Server utilities (Logger)
│   │   ├── app.ts                # Express application factory
│   │   ├── server.ts             # Server entry point & listener
│   │   └── health.test.ts        # Supertest integration tests
│   ├── .env                      # Local backend environment variables
│   ├── .env.example              # Backend environment variable template
│   ├── package.json              # Backend scripts & dependencies
│   └── tsconfig.json             # Backend TypeScript configuration
│
├── .gitignore                    # Global repository ignore rules
└── README.md                     # Root project documentation
```

---

## 4. Prerequisites

Before running the application, make sure you have the following installed on your machine:

- **Node.js:** v20.x or higher (Tested on `v24.22.1`)
- **npm:** v10.x or higher (Tested on `11.19.1`)
- **Terminal:** Windows PowerShell (or Command Prompt)

> **Windows PowerShell Tip:**
> If PowerShell blocks `npm.ps1` script execution due to execution policy, use `npm.cmd` instead.

---

## 5. Installation & Setup

Open **Windows PowerShell** and navigate to your project root:

```powershell
Set-Location "C:\Users\LOQ\Desktop\AI-Quiz-Generator"
```

### Step 1: Install Frontend Dependencies

```powershell
Set-Location "frontend"
npm.cmd install
Set-Location ".."
```

### Step 2: Install Backend Dependencies

```powershell
Set-Location "backend"
npm.cmd install
Set-Location ".."
```

---

## 6. Environment Configuration

### Frontend Configuration
The frontend uses `frontend/.env.example`. A default `frontend/.env` is already configured for local development:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

> **Security Rule:** Never put private API keys (such as OpenAI keys) into frontend environment files. Vite bundles client variables prefixed with `VITE_` directly into the public browser build.

### Backend Configuration
The backend uses `backend/.env.example`. A working template is provided in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

*Note: For Phase 1 (foundation), the backend starts and responds to health requests without requiring a live OpenAI API key.*

---

## 7. Running the Application

To run both services simultaneously, open **two separate PowerShell terminals**.

### Terminal 1: Start the Backend Server

```powershell
Set-Location "C:\Users\LOQ\Desktop\AI-Quiz-Generator\backend"
npm.cmd run dev
```

- **Backend URL:** [http://localhost:5000](http://localhost:5000)
- **Health Check Endpoint:** [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

### Terminal 2: Start the Frontend Client

```powershell
Set-Location "C:\Users\LOQ\Desktop\AI-Quiz-Generator\frontend"
npm.cmd run dev
```

- **Frontend URL:** [http://localhost:5173](http://localhost:5173)

Open [http://localhost:5173](http://localhost:5173) in your browser. You will see the AI Quiz Generator dashboard and can click **Check Status** to test live communication with the backend health endpoint.

---

## 8. Verifying the Health Endpoint

### In the Browser
Navigate to [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health). You will receive:

```json
{
  "status": "ok",
  "message": "AI Quiz Generator backend is running",
  "timestamp": "2026-11-03T04:50:25.036Z",
  "uptime": 1.55,
  "environment": "development",
  "version": "1.0.0"
}
```

### In PowerShell
Run:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/health" -Method Get
```

---

## 9. Testing & Building

### Running Frontend Tests & Lint
```powershell
Set-Location "C:\Users\LOQ\Desktop\AI-Quiz-Generator\frontend"
npm.cmd run lint      # Runs ESLint type and style checks
npm.cmd test          # Runs Vitest component unit tests
npm.cmd run build     # Builds production bundles to /frontend/dist
```

### Running Backend Tests & Build
```powershell
Set-Location "C:\Users\LOQ\Desktop\AI-Quiz-Generator\backend"
npm.cmd run lint      # Runs TypeScript compiler check (tsc --noEmit)
npm.cmd test          # Runs Supertest API integration tests
npm.cmd run build     # Compiles TypeScript to /backend/dist
npm.cmd start         # Runs compiled production server
```

---

## 10. Troubleshooting Common Issues

### 1. `npm.ps1 cannot be loaded because running scripts is disabled`
- **Reason:** PowerShell execution policy restricts running unsigned PowerShell script wrappers.
- **Solution:** Always run `npm.cmd` instead of `npm`, e.g., `npm.cmd run dev`.

### 2. `ERESOLVE unable to resolve dependency tree`
- **Reason:** Mismatched major versions of TypeScript or `@typescript-eslint`.
- **Solution:** Both `frontend` and `backend` are locked to stable `typescript@^5.9.3` and compatible `typescript-eslint@^8.72.0`. Do not run `npm install typescript@latest` without checking peer dependencies.

### 3. `Port 5000 or Port 5173 is already in use`
- **Solution:** Check what process is occupying the port and stop it:
```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object OwningProcess
Stop-Process -Id <OwningProcessId> -Force
```

### 4. CORS Errors in the Browser
- **Reason:** Frontend URL does not match the backend's allowed origins.
- **Solution:** Verify `FRONTEND_URL=http://localhost:5173` is set in `backend/.env`.

