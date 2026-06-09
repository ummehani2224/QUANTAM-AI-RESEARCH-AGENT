# QUANTUM Financial Intelligence - Troubleshooting Guide 🔍

This guide provides actionable steps to diagnose and fix the most common configuration, startup, and connection issues.

---

## 🚨 Quick Diagnostics Check

If the frontend page shows a **"FastAPI Backend Gateway Offline"** warning banner, check the following sections in order.

---

## 1. Backend Not Running
### Symptoms
* The React dashboard shows `🚨 FastAPI Backend Gateway Offline`.
* Requests to `http://localhost:8000/health` time out or return connection refused.

### Solutions
* **Windows (Recommended)**: Double-click the `start_all.bat` launcher in the root folder, or double-click `start_backend.bat`.
* **Manual Command Line**:
  ```bash
  cd backend
  python main.py
  ```
* Ensure that the command prompt window remains open. If it closes immediately, check Section 6 (Failed Imports) or Section 2 (Python Environment).

---

## 2. Python Environment and Broken Python 3.14
### Symptoms
* Running `python main.py` or double-clicking the backend batch script crashes immediately with:
  `ModuleNotFoundError: No module named 'encodings'` or `Fatal Python error: Failed to import encodings module`.

### Diagnosis
* Some Windows installations have a corrupted default Python environment (specifically Python 3.14.5).

### Solutions
1. **Use Batch Launcher**: The pre-configured `start_backend.bat` checks if the default python is broken and automatically falls back to your working Python 3.12 path:
   `C:\Users\DELL\AppData\Local\Programs\Python\Python312\python.exe`.
2. **Manual Execution**: Run using the explicit path:
   ```bash
   "C:\Users\DELL\AppData\Local\Programs\Python\Python312\python.exe" main.py
   ```
3. **Change System Path**: Set your environment variables (`PATH`) to prioritize Python 3.12 over Python 3.14.

---

## 3. Missing Dependencies
### Symptoms
* Frontend fails to compile with errors like `Cannot find module 'framer-motion'` or `Cannot find module 'lucide-react'`.
* Backend fails to start with `ModuleNotFoundError: No module named 'fastapi'`.

### Solutions
* **Frontend**:
  Add missing dependencies to your package.json (already done) and run install:
  ```bash
  cd frontend
  npm install
  ```
* **Backend**:
  Install required modules using the working python executable:
  ```bash
  cd backend
  "C:\Users\DELL\AppData\Local\Programs\Python\Python312\python.exe" -m pip install -r requirements.txt
  ```

---

## 4. Missing API Keys
### Symptoms
* The UI displays a warning: `⚠️ Offline Heuristic Fallback Engine Active`.
* Timing statuses report `Groq Status: Fallback Mode` or `Offline`.
* News summary narratives look generic or missing.

### Solutions
* Copy `.env.example` to `.env` in the root workspace directory.
* Edit `.env` to supply valid keys:
  ```env
  GEMINI_API_KEY=AIzaSy...
  GROQ_API_KEY=gsk_...
  ```
* Restart the backend server after creating or editing the `.env` file to ensure the configuration is loaded.

---

## 5. Port Mismatch & CORS Issues
### Symptoms
* The backend is running on `localhost:8000` and frontend on `localhost:5173`, but the browser blocks requests with `Access-Control-Allow-Origin` errors or `Network Error`.
* Frontend loads but cannot communicate.

### Analysis
* Vite shifts the frontend port dynamically to `5174` or `5175` if `5173` is occupied. If the backend CORS whitelist is restricted to `5173`, requests will be blocked.

### Solutions
* We whitelisted all standard fallback ports (`5173`, `5174`, `5175`, `3000`) for both `localhost` and `127.0.0.1` in `backend/main.py`.
* If you are running on custom configurations, update `main.py`'s `allow_origins` array.

---

## 6. Failed Imports / Git Pull Conflict Resolution
### Symptoms
* Scripts crash with `ImportError`.

### Solutions
* Make sure you resolve any git merge conflict indicators (`<<<<<<<`, `=======`, `>>>>>>>`) in your files.
* Running `git status` will show any conflicted files.
* Use `git checkout --ours <file>` or `git checkout --theirs <file>` if you want to overwrite conflicts cleanly.
