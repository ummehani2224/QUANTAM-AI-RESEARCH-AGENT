# Groq LLM Integration and Fallback Architecture

This document explains the design, routing mechanisms, prompt interfaces, and fallback controls for the LLM integration inside the **QUANTUM AGENT** platform.

---

## 🤖 Reasoning Backbone: llama-3.3-70b-versatile

The reasoning engine utilizes **llama-3.3-70b-versatile** hosted on the **Groq API** gateway, providing high-speed inference, complex context processing, and native JSON mode configuration.

---

## 🛰️ Integration Topography

Rather than introducing heavy libraries, the platform connects directly to the Groq Chat Completions endpoint (`https://api.groq.com/openai/v1/chat/completions`) using the synchronous `httpx` HTTP client.

* **Mode**: Strict JSON enforcement (`response_format={"type": "json_object"}`).
* **Conviction Check**: Strict 10.0-second timeouts to avoid page load freeze on front-end dashboards.

---

## 🛡️ Robust Fallback Architecture

To ensure Capgemini deep dive suitability, the platform implements an **automatic rule-based local fallback**. If the LLM API is unavailable, rate-limited, times out, or fails format checks, the engine immediately calls the local, offline rules engine.

```
[Agent Triggered]
       │
       ▼
Check: GROQ_API_KEY ? ──(No)──> [Run Local Rule-Based Engine] ──> [Format Schema Output]
       │
      (Yes)
       ▼
Query Groq (llama-3.3-70b-versatile)
  - Enforce JSON response
  - Set 10s timeout limit
       │
       ├─> SUCCESS ──> [Parse JSON] ──> [Validate Schema] ──> [Merge Math metrics] ──> Return
       │
       └─> FAILURE (Rate limit, Timeout, Parsing error)
             │
             ▼
        [Catch Exception] ➔ [Log Diagnostic Details] ➔ [Invoke Local Rule Engine] ➔ Return
```

---

## 📝 Agent Prompts & Outputs

Each agent formats calculations into structured JSON prompts.

### 1. Technical Analysis Agent
* **Input variables**: Price, moving averages (50/200 MA), RSI, MACD parameters, support/resistance levels, distances, volatility, and timeframe SMA-20 trends.
* **LLM Prompts & Output**:
  ```json
  {
    "trend": "Bullish" | "Bearish" | "Neutral",
    "confidence": 0-100,
    "summary": "narrative technical structure details...",
    "signals": ["Price above 50-day MA", "MACD bullish momentum"],
    "risk_factors": ["High volatility index"]
  }
  ```

### 2. Fundamental Analysis Agent
* **Input variables**: PE Ratio, Revenue growth %, Earnings growth %, Total revenue, Net income, Market Capitalization scale.
* **LLM Prompts & Output**:
  ```json
  {
    "health_score": 0-100,
    "valuation_score": 0-100,
    "growth_score": 0-100,
    "summary": "financial summary narrative...",
    "strengths": ["Strong double-digit net profit margin"],
    "weaknesses": ["Elevated premium multiple valuation"]
  }
  ```

### 3. Sentiment Analysis Agent
* **Input variables**: List of harvested news headlines, publishers, dates, and preliminary tagged sentiment ratios.
* **LLM Prompts & Output**:
  ```json
  {
    "sentiment": "Positive" | "Negative" | "Neutral",
    "confidence": 0-100,
    "summary": "media narrative synthesis...",
    "positive_drivers": ["earnings expansion"],
    "negative_drivers": ["regulatory litigation risk"]
  }
  ```

### 4. Master Agent Synthesis
* **Input variables**: Outputs of Technical, Fundamental, and Sentiment agents. Also inputs calculated weighted confidence and risk score.
* **LLM Prompts & Output**:
  ```json
  {
    "market_bias": "Bullish" | "Bearish" | "Neutral",
    "confidence": 0-100,
    "risk": "Low" | "Medium" | "High",
    "key_drivers": ["Technicals show strong uptrend...", "Stable fundamental metrics..."],
    "watchlist_factors": ["Monitor support level at $X...", "Upcoming earnings catalyst..."],
    "summary": "final executive synthesis narrative..."
  }
  ```
  *(Important: Direct BUY/SELL/HOLD advice is strictly censored under all modes to maintain compliance).*
