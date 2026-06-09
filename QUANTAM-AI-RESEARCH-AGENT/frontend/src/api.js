// api.js — Axios API client
// All backend calls go through this file.
// If you change the backend URL, you only need to update it here.

import axios from "axios";

// The base URL of our FastAPI backend
// Change this if you deploy the backend to a different server
const BASE_URL = "http://localhost:8000/api";

// Create an axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Wait up to 30 seconds for a response
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Analyze a stock using all 4 agents.
 * Sends: { symbol: "AAPL" }
 * Receives: { stock, technical, fundamental, sentiment, final_decision }
 */
export async function analyzeStock(symbol) {
  const response = await api.post("/analyze", { symbol });
  return response.data;
}

/**
 * Check if the backend server is running.
 * Returns: { status: "ok", message: "..." }
 */
export async function checkHealth() {
  const response = await api.get("/health");
  return response.data;
}

/**
 * Perform a root health check (GET /health) to verify connectivity.
 */
export async function checkBackendHealth() {
  const response = await axios.get("http://localhost:8000/health", { timeout: 3000 });
  return response.data;
}

/**
 * Get raw stock data and chart data for a symbol.
 */
export async function getStockData(symbol) {
  const response = await api.get(`/stock/${symbol}`);
  return response.data;
}

export default api;
