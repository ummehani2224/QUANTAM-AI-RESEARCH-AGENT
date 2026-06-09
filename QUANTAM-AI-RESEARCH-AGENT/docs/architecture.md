# System Architecture: Quantum Agent

This document explains the technical architecture and design decisions of the **QUANTUM AGENT** platform.

---

## 🏛️ Overall Topography

The system follows a decoupled, client-server topography:

```
[ React Client ] ──(HTTP/JSON)──> [ FastAPI Gateway ]
       │                                 │
(Embeds TradingView Widget)              ├─> [ LLM Service ] (Queries Groq Cloud API)
                                         │       │
                                         │       └─> Fallback: Local Rules Engine
                                         │
                                         ├─> [ Technical Agent ] (Multi-timeframe math)
                                         ├─> [ Fundamental Agent ] (Corporate solvency)
                                         └─> [ Sentiment Agent ] (News sentiment & RSS)
```

---

## 🧠 Core Pipeline Orchestration

When a client queries a stock symbol:

1. **Exchange Ticker Suffix Normalization**: Cleans the input and auto-resolves Indian shares (e.g. `INFY` to `INFY.NS`) for matching Yahoo Finance conventions.
2. **In-Memory Cache Check**: Checks the thread-safe Cache Service (5-minute TTL) to prevent rate-limiting and retrieve historical queries instantly.
3. **Data Acquisition**: Fetches statistics, daily prices (1 year history), multi-timeframe closes (`15m`, `1h`, `4h`, `1d`, `1w`), and news headlines from `yfinance`.
4. **News Harvest Fallback**: If `yfinance` ticker news is empty, triggers a secondary XML feed query parsing `https://feeds.finance.yahoo.com/rss.xml?s=SYMBOL` to ensure articles are always present.
5. **Specialized Evaluation**: Spawns Technical, Fundamental, and Sentiment agents.
6. **Consensus Synthesis (Master Agent)**: Computes weighted average confidence and mathematical risk parameters, then runs Groq LLM completions to produce executive narrative intelligence.

---

## 🛡️ LLM Fallback Engineering
To qualify for buildathon evaluation, the platform implements an **automatic rule-based local fallback**. If the Groq API fails (e.g., timeout, connection error, rate limits), the engine catches the exception and immediately calculates results using standard rules, ensuring the app never crashes.

---

## 💾 Caching Strategy
* **Storage**: In-memory thread-safe dictionary (`_cache = {}`).
* **Expiry**: TTL set to `300` seconds (5 minutes). Evaluates timestamp on lookup; expired entries are cleared immediately.
* **Impact**: Decreases response times for popular tickers to <10ms and preserves external API allocations.
