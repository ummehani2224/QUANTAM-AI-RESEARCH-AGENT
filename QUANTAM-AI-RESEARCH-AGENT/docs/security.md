# Security and Safety Controls: Quantum Agent

This document explains the security measures, input validations, logging systems, and API key management of the **QUANTUM AGENT** platform.

---

## 🔒 No Secrets on Client Side
The React front-end application contains **zero** hardcoded credentials or API keys:
* All integration endpoints (Yahoo Finance, news parsing, optional LLM configurations) are initiated on the backend server.
* The frontend simply calls the backend via `axios` at `/api/analyze` using relative routing or local environment configurations, keeping credentials hidden behind the server's environment block.

---

## 🛡️ Input Validation & Sanitization
* The backend utilizes **Pydantic v2** models (`AnalyzeRequest`) for strict request schema validation.
* Empty ticker symbols or excessive inputs (>10 characters) are rejected before spawning subprocesses or requesting external resources.
* Symbol inputs are automatically stripped, capitalized, and validated for safe character sets (`^[A-Z0-9\.\-]+$`) during preprocessing.

---

## 🌐 CORS Constraints
FastAPI's standard CORSMiddleware restricts cross-origin queries to approved development hosts:
* Approved Dev origins: `http://localhost:5173` (Vite) and `http://localhost:3000` (React).
* Production origins can be loaded from environment variables (`CORS_ALLOWED_ORIGINS`).

---

## 📜 Logging & System Diagnostics
The backend incorporates Python's standard `logging` module to capture trace details without logging sensitive variables:
* **Trace Information**: Logs orchestration flow milestones (e.g. cache hits, data acquisitions, and sub-agent processes).
* **Exception Traps**: Employs global try/catch wrappers for all external connections, logging technical details locally to the console and returning standardized, non-leaking HTTP status codes (`500 Internal Server Error` with generalized messages).
* **Environment Verification**: The `/health` check confirms whether `GEMINI_API_KEY` is loaded in memory as a boolean flag without printing the key itself.
