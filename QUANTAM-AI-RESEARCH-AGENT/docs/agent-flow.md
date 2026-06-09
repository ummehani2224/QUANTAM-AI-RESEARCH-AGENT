# Multi-Agent Consensus Flow: Quantum Agent

This document explains the technical details of the sub-agent calculations, multi-timeframe checks, and Master Agent consensus weighting.

---

## 🔄 Agent Processing Pipeline

```
[ User Input ]
       │
       ▼
[stock_service.py] ➔ Fetches real price details, fundamentals & timeframes
[news_service.py]  ➔ Harvests headlines (with XML RSS fallback)
       │
       ├─> Run [Technical Agent]   ➔ Calculate SMA-20 trends, Volatility, S/R, then Groq prompt
       ├─> Run [Fundamental Agent] ➔ Calculate PE, growth, margins, then Groq prompt
       └─> Run [Sentiment Agent]   ➔ Calculate news ratios, then Groq prompt
       │
       ▼
[master_agent.py]  ➔ Calculate consensus confidence & mathematical risk, then Groq synthesis
       │
       ▼
[Dashboard UI]     ➔ Render KPI cards, TradingView chart, agent metrics & Master report
```

---

## 🦾 Sub-Agent Analysis Logic

### 1. Technical Analysis Agent
* **Indicator Math**: Computes RSI, MACD, and moving averages (50/200 MA). Calculates support (20-day local minimum) and resistance (20-day local maximum) levels.
* **Multi-Timeframe Trend Structure**: Exposes trends across timeframes (`15m`, `1h`, `4h`, `1d`, `1w`). For each timeframe, checks if current price is above/below the 20-period Simple Moving Average (SMA-20):
  * Price > SMA-20: `Bullish` (or `Strong Bullish` if SMA slope is positive and price is > 1.02 $\times$ SMA-20).
  * Price < SMA-20: `Bearish` (or `Strong Bearish` if SMA slope is negative and price is < 0.98 $\times$ SMA-20).
  * Else: `Neutral`.
* **Groq Upgrades**: Sends this structured data to Groq to generate a narrative technical summary, signals list, and risk factors.

### 2. Fundamental Analysis Agent
* **Indicator Math**: Evaluates margins, market cap scale, valuation multiples, and year-over-year revenue/earnings growth rates.
* **Groq Upgrades**: Prompts Groq to evaluate the financial records, scoring financial health, valuation safety, and growth momentum, and outputs strengths vs weaknesses lists.

### 3. Sentiment Analysis Agent
* **Indicator Math**: Scans harvested headlines, calculating positive, negative, and neutral ratios.
* **Groq Upgrades**: Prompts Groq to summarize the news stream, extract corporate events, and list positive vs negative sentiment drivers.

---

## 🧠 Master Agent Synthesis

The Master Agent combines sub-agent outputs using mathematical consensus filters:

### 1. Master Confidence Calculation (Weighted Average)
$$\text{Master Confidence} = (C_{\text{tech}} \times 0.40) + (C_{\text{fund}} \times 0.35) + (C_{\text{sent}} \times 0.25)$$

### 2. Master Risk Calculation (Multi-Factor Scoring)
$$\text{Risk Score} = \text{Disagreement Risk} + \text{Volatility Risk} + \text{News Uncertainty}$$
* **Disagreement Risk (Max 70 points)**: Maps sub-agent biases to numeric values (+1.0 to -1.0) and scores the range:
  $$\text{Disagreement Risk} = (\max(\text{signals}) - \min(\text{signals})) \times 35$$
* **Volatility Risk (Max 20 points)**: Volatility $\ge 35\%$: +20 points; Volatility $\ge 20\%$: +10 points.
* **News Uncertainty (Max 10 points)**: Balanced sentiment ratio ($0.4 \le \text{Positive Ratio} \le 0.6$): +10 points.

*Risk Classification mapping:*
* Risk Score $\ge 65$ ➔ **High**
* Risk Score $\ge 35$ ➔ **Medium**
* Else ➔ **Low**
