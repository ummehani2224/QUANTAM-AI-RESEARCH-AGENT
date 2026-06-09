# Explainable Confidence Scoring: Quantum Agent

This document explains the mathematical consensus scoring methodology used by the Master Agent.

---

## 📐 Weighted Consensus Model

To ensure transparency and prevent LLM confidence score drift, the Master Agent calculates the overall **Consensus Confidence** mathematically in Python code, using the following weighting matrix:

$$\text{Master Confidence} = (C_{\text{tech}} \times 0.40) + (C_{\text{fund}} \times 0.35) + (C_{\text{sent}} \times 0.25)$$

* **$C_{\text{tech}}$**: Technical conviction score (based on indicators alignment and multi-timeframe checks).
* **$C_{\text{fund}}$**: Fundamental conviction score (based on valuation PE multiples and growth consistency).
* **$C_{\text{sent}}$**: Headline sentiment conviction score (based on news volume consensus).

---

## 📊 Weight Distribution Rationale

The weights are allocated according to institutional risk management guidelines:

| Agent Specialty | Weight | Core Contribution |
| :--- | :---: | :--- |
| **Technical Analysis** | **40%** | Dictates immediate price structures, support boundaries, momentum, and multi-timeframe entry parameters. |
| **Fundamental Analysis** | **35%** | Evaluates long-term corporate health, balance sheet solvency, revenue multiples, and profit margins. |
| **News Sentiment** | **25%** | Maps real-time news narrative bias and corporate event headlines, capturing volatility triggers. |

---

## ⚙️ Execution and Safety Controls
* **Hallucination Prevention**: The Master Agent runs the consensus score calculation in python code **prior** to prompting the LLM, and passes the calculated confidence as a fixed parameter.
* **Fallback Consistency**: If the Groq API fails and the local fallback engine triggers, the identical mathematical formula is returned, guaranteeing that confidence outputs remain consistent regardless of connection status.
