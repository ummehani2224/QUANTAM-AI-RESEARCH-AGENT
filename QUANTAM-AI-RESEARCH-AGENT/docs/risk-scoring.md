# Explainable Risk Scoring: Quantum Agent

This document explains the mathematical risk calculation methodology used by the Master Agent.

---

## 🛡️ Risk Assessment Framework

The platform calculates risk mathematically in Python code rather than letting the LLM estimate it. The **Total Risk Score (0-100)** is calculated based on three primary components: **Agent Disagreement**, **Market Volatility**, and **News Uncertainty**.

---

## 🧮 Mathematical Components

$$\text{Risk Score} = \text{Disagreement Risk} + \text{Volatility Risk} + \text{News Uncertainty Risk}$$

### 1. Agent Disagreement Risk (Max 70 points)
Measures alignment between the sub-agent verdicts. We convert agent verdicts into numeric signals:
* **Technical**: Bullish (1.0), Neutral (0.0), Bearish (-1.0)
* **Fundamental**: Strong (1.0), Average (0.0), Weak (-1.0)
* **Sentiment**: Positive (1.0), Neutral (0.0), Negative (-1.0)

We calculate the disagreement range:
$$\text{Range} = \max(\text{scores}) - \min(\text{scores})$$
$$\text{Disagreement Risk} = \text{Range} \times 35$$

* If all agents agree (e.g., all bullish): Range = 0 ➔ **0 points**.
* If slightly divergent (e.g., Bullish and Neutral): Range = 1.0 ➔ **35 points**.
* If completely contradictory (e.g., Bullish and Bearish): Range = 2.0 ➔ **70 points**.

---

### 2. Market Volatility Risk (Max 20 points)
Evaluates annualized daily returns volatility (%) calculated by the Technical Agent:
* **$\ge 35\%$ (High Volatility)**: Add **20 points**.
* **$\ge 20\%$ (Moderate Volatility)**: Add **10 points**.
* **$< 20\%$ (Low Volatility)**: Add **0 points**.

---

### 3. News Uncertainty Risk (Max 10 points)
Evaluates sentiment ratio alignment:
* If news ratio is highly balanced (Positive ratio is between $0.4$ and $0.6$, suggesting mixed reports), we add **10 points** for news flow uncertainty.
* Otherwise: **0 points**.

---

## 🎯 Final Classification Mapping

The resulting **Risk Score** is mapped directly to a classification level:

| Risk Score | Risk Level | Rationale |
| :---: | :---: | :--- |
| **$\ge 65$** | **High** | Major agent disagreement (contradictory signals) or elevated volatility. |
| **$35 - 64$** | **Medium** | Minor agent divergence or moderate price volatility. |
| **$< 35$** | **Low** | Full agent alignment, low volatility, and clear news consensus. |

*Note: The calculated risk level is supplied to the LLM to guide the synthesis narration, guaranteeing full alignment between dashboard metrics and text summaries.*
