# API Contract & Schema Design: Quantum Agent

This document lists the backend REST endpoints and JSON structures.

---

## 🛰️ API Endpoints

### 1. `POST /api/analyze`
Executes full multi-agent analysis for a stock ticker.

* **Request Payload**:
  ```json
  {
    "symbol": "AAPL"
  }
  ```
  *(Supported symbols: US symbols like `AAPL`, `TSLA`; Indian NSE symbols like `RELIANCE.NS`, `INFY`)*

* **Response Payload (200 OK)**:
  ```json
  {
    "stock": "AAPL",
    "current_price": 189.45,
    "change_pct": 1.25,
    "technical": {
      "trend": "Bullish",
      "confidence": 85,
      "reason": "Price is above the 50-day and 200-day MAs.",
      "trend_strength": "Strong",
      "support": 178.50,
      "resistance": 195.00,
      "volatility": 18.4,
      "signals": [
        "Price above 50-day & 200-day MAs (Long-Term Bullish)",
        "RSI at 58.0 (Neutral Momentum)"
      ]
    },
    "fundamental": {
      "fundamental": "Strong",
      "confidence": 90,
      "reason": "Double-digit margins and attractive valuation.",
      "health_score": 85,
      "valuation_score": 75,
      "growth_score": 80,
      "metrics": {
        "pe_ratio": 29.5,
        "revenue_growth_pct": 8.1,
        "earnings_growth_pct": 10.2,
        "market_cap": "$2.95T",
        "total_revenue": 383285000000.0,
        "net_income": 96996000000.0
      }
    },
    "sentiment": {
      "sentiment": "Positive",
      "confidence": 80,
      "reason": "Majority positive news coverage (6/8 articles bullish).",
      "positive_ratio": 0.75,
      "negative_ratio": 0.12,
      "events": [
        "Earnings Report",
        "Product Launch"
      ]
    },
    "final_decision": {
      "market_bias": "Bullish",
      "confidence": 85,
      "risk": "Low",
      "key_drivers": [
        "Technical structure is Bullish with strong strength...",
        "Company fundamentals are evaluated as Strong..."
      ],
      "watchlist_factors": [
        "Monitor critical support at $178.50 and resistance boundary at $195.00.",
        "Upcoming catalysts identified: Earnings Report, Product Launch."
      ],
      "summary": "Consolidated analysis indicates a Bullish market bias..."
    }
  }
  ```

---

### 2. `GET /api/stock/{symbol}`
Fetches raw market statistics and resampled historical closures for charts.

* **Response Payload (200 OK)**:
  ```json
  {
    "stock": {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 189.45,
      "change": 2.34,
      "change_pct": 1.25,
      "volume": 55234000,
      "market_cap": "$2.95T",
      "pe_ratio": 29.5,
      "revenue_growth": 8.1,
      "earnings_growth": 10.2,
      "rsi": 58.0,
      "macd": 1.2,
      "moving_avg_50": 182.3,
      "moving_avg_200": 175.0,
      "support": 178.50,
      "resistance": 195.00,
      "volatility": 18.4,
      "source": "Yahoo Finance (Real-Time)"
    },
    "timeframes": {
      "15m": [188.1, 188.5, 189.0, 189.45],
      "1h": [185.0, 186.2, 187.5, 189.45],
      "4h": [182.5, 184.8, 189.45],
      "1d": [180.2, 181.1, 189.45],
      "1w": [172.0, 178.4, 189.45]
    }
  }
  ```

---

### 3. `GET /api/health`
Verifies backend configuration and external API connectivity status.

* **Response Payload (200 OK)**:
  ```json
  {
    "status": "ok",
    "message": "QUANTUM AGENT Backend is fully operational",
    "environment": {
      "gemini_api_key_configured": true
    }
  }
  ```
