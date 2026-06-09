# Deployment Guide: Quantum Agent

This document explains the steps to deploy the **QUANTUM AGENT** multi-agent financial platform on **Vercel** (frontend) and **Render** (backend).

---

## 🖥️ Frontend: Vercel Deployment

Vercel is the recommended hosting platform for static React (Vite) websites.

### 📋 Prerequisites
* A free Vercel account linked to your GitHub account.
* Workspace repository pushed to GitHub.

### 🚀 Deploy Steps
1. Navigate to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** ➔ **Project**.
3. Import your `QUANTAM-AI-RESEARCH-AGENT` repository.
4. Set the following options:
   * **Framework Preset**: Vite
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Click **Deploy**. Vercel will build and launch the dashboard.

---

## ⚙️ Backend: Render Deployment

Render is the recommended hosting platform for Python web applications.

### 📋 Prerequisites
* A free Render account.
* Ticker service runs on port `8000`.

### 🚀 Deploy Steps
1. Go to the [Render Dashboard](https://dashboard.render.com).
2. Click **New** ➔ **Web Service**.
3. Link your GitHub repository.
4. Configure variables:
   * **Language**: Python
   * **Root Directory**: `backend`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
5. Set environment variables under **Environment**:
   * `GROQ_API_KEY`: *(Required: your Groq API key for llama-3.3-70b-versatile)*
   * `GEMINI_API_KEY`: *(Optional: your Gemini key for LLM sentiment fallback)*
6. Click **Deploy Web Service**.

### ⚠️ Post-Deployment CORS Configuration
Once your backend is deployed, note the Render URL (e.g. `https://quantum-agent-api.onrender.com`). Update the `BASE_URL` in [frontend/src/api.js](file:///c:/Users/singh/QUANTAM-AI-RESEARCH-AGENT/frontend/src/api.js) to point to your backend url.
For production CORS compliance, ensure the backend allows the frontend's Vercel URL in its middleware configuration.
