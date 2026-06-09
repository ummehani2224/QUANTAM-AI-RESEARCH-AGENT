# master_agent.py
# The Master Agent acts as the final aggregator of sub-agent decisions.
# Implements mathematical confidence and risk formulas alongside Groq LLM synthesis.
# Preserves strict fallbacks to avoid failure.

import os
import json
import logging
from services.llm_service import query_groq

logger = logging.getLogger("quantum_agent.master_agent")

def analyze(technical: dict, fundamental: dict, sentiment: dict) -> dict:
    """
    Synthesizes outcomes from Technical, Fundamental, and Sentiment agents.
    
    1. Calculates Master Confidence using weights: 40% Tech, 35% Fund, 25% Sent.
    2. Calculates Master Risk Score based on agent disagreement range, 
       volatility, and news ratio uncertainty.
    3. Prompts Groq to generate the final Executive Summary, Key Drivers, and Watchlist.
       Strictly forbids direct BUY/SELL/HOLD recommendations to avoid investment advice.
       
    Falls back to mathematical aggregations on Groq errors.
    """
    # ── 1. Calculate Master Confidence (Weighted Consensus) ──
    tech_conf = technical.get("confidence", 50)
    fund_conf = fundamental.get("confidence", 50)
    sent_conf = sentiment.get("confidence", 50)
    
    calculated_confidence = int(
        (tech_conf * 0.40) + 
        (fund_conf * 0.35) + 
        (sent_conf * 0.25)
    )

    # ── 2. Calculate Master Risk Score (Explainable Logic) ──
    # A. Disagreement risk mapping
    def score_map(val: str) -> float:
        v = val.lower() if val else ""
        if v in {"bullish", "strong", "positive"}:
            return 1.0
        elif v in {"bearish", "weak", "negative"}:
            return -1.0
        return 0.0 # Neutral / Average

    t_score = score_map(technical.get("trend"))
    f_score = score_map(fundamental.get("fundamental"))
    s_score = score_map(sentiment.get("sentiment"))
    
    scores = [t_score, f_score, s_score]
    disagreement_range = max(scores) - min(scores) # 0.0 to 2.0
    disagreement_risk = disagreement_range * 35 # 0, 35, or 70 points
    
    # B. Volatility risk mapping
    volatility = technical.get("volatility", 20.0)
    volatility_risk = 20 if volatility >= 35.0 else (10 if volatility >= 20.0 else 0)
    
    # C. News uncertainty risk mapping
    pos_ratio = sentiment.get("positive_ratio", 0.5)
    news_uncertainty = 10 if (0.4 <= pos_ratio <= 0.6 and len(sentiment.get("positive_drivers", [])) > 0) else 0
    
    # Combine
    total_risk_score = disagreement_risk + volatility_risk + news_uncertainty
    if total_risk_score >= 65:
        calculated_risk = "High"
    elif total_risk_score >= 35:
        calculated_risk = "Medium"
    else:
        calculated_risk = "Low"

    # ── 3. Rule-Based Bias Fallback ──
    weighted_score = (t_score * 0.40) + (f_score * 0.35) + (s_score * 0.25)
    if weighted_score >= 0.25:
        calculated_bias = "Bullish"
    elif weighted_score <= -0.25:
        calculated_bias = "Bearish"
    else:
        calculated_bias = "Neutral"

    # Key drivers fallback list
    rule_drivers = [
        f"Technical Agent indicates {technical.get('trend')} trend with {technical.get('trend_strength','moderate').lower()} strength.",
        f"Fundamental Agent reports {fundamental.get('fundamental')} company metrics (Health: {fundamental.get('health_score')}/100).",
        f"Sentiment Agent evaluates news narrative as {sentiment.get('sentiment')}."
    ]
    
    rule_watchlist = [
        f"Monitor Support boundary at ${technical.get('support_level', 0.0):.2f} and Resistance ceiling at ${technical.get('resistance_level', 0.0):.2f}."
    ]

    distance_to_support = technical.get("distance_to_support", 5.0)
    distance_to_resistance = technical.get("distance_to_resistance", 5.0)
    
    rule_risks = []
    if volatility >= 35.0:
        rule_risks.append(f"High asset volatility ({volatility:.1f}%) creates structural correction risks.")
    if distance_to_resistance < 3.0:
        rule_risks.append(f"Approaching key overhead resistance ceiling at ${technical.get('resistance_level', 0.0):.2f}.")
    if technical.get("trend_strength") == "Weak":
        rule_risks.append("Weak technical trend direction increases market exposure risk.")
    if sentiment.get("sentiment") == "Negative":
        rule_risks.append("Bearish public news sentiment could depress buying interest.")
    if not rule_risks:
        rule_risks = ["Macroeconomic headwinds or regulatory risk changes in this sector."]

    rule_catalysts = []
    if distance_to_support < 3.0:
        rule_catalysts.append(f"Approaching historical support level at ${technical.get('support_level', 0.0):.2f} could trigger buying support.")
    if fundamental.get("growth_score", 50) >= 75:
        rule_catalysts.append("Strong YoY company revenue expansion acts as an ongoing upward valuation catalyst.")
    if not rule_catalysts:
        rule_catalysts = ["Upcoming corporate earnings release or sector product announcements."]
    
    calculated_summary = (
        f"Orchestrated analysis indicates a **{calculated_bias}** market bias with "
        f"an aggregated confidence score of **{calculated_confidence}%** and a **{calculated_risk}** risk profile. "
        f"Technical momentum aligns as {technical.get('trend')}, coupled with a fundamental health index of {fundamental.get('health_score')}/100 "
        f"and sentiment drivers matching {sentiment.get('sentiment')}."
    )

    # ── LLM Synthesis & Fallback orchestrator ──
    groq_api_key = os.getenv("GROQ_API_KEY")
    if groq_api_key:
        try:
            logger.info("GROQ_API_KEY detected. Prompting Groq Master Synthesis agent...")
            
            prompt = f"""
You are an institutional financial analyst. Synthesize the reports from 3 specialized sub-agents:

[TECHNICAL ANALYSIS REPORT]
- Trend Bias: {technical.get('trend')}
- Confidence: {technical.get('confidence')}%
- Support Level: ${technical.get('support_level')}
- Resistance Level: ${technical.get('resistance_level')}
- Distance to Support: {technical.get('distance_to_support')}%
- Distance to Resistance: {technical.get('distance_to_resistance')}%
- Annualized Volatility: {technical.get('volatility')}%
- Multi-Timeframe Trend Structures: {technical.get('timeframe_analysis')}
- Signals Triggered: {technical.get('signals')}
- Technical Risk Factors: {technical.get('risk_factors')}
- Summary: {technical.get('summary')}

[FUNDAMENTAL ANALYSIS REPORT]
- Solvency/Posture: {fundamental.get('fundamental')}
- Confidence: {fundamental.get('confidence')}%
- Health Score: {fundamental.get('health_score')}/100
- Valuation Score: {fundamental.get('valuation_score')}/100
- Growth Score: {fundamental.get('growth_score')}/100
- Strengths: {fundamental.get('strengths')}
- Weaknesses: {fundamental.get('weaknesses')}
- Summary: {fundamental.get('summary')}

[HEADLINE SENTIMENT REPORT]
- Narrative Verdict: {sentiment.get('sentiment')}
- Confidence: {sentiment.get('confidence')}%
- Sentiment Drivers (Positive): {sentiment.get('positive_drivers')}
- Sentiment Drivers (Negative): {sentiment.get('negative_drivers')}
- Events Tagged: {sentiment.get('events')}
- Summary: {sentiment.get('summary')}

[CALCULATED CONSENSUS]
- Weighted Consensus Confidence: {calculated_confidence}%
- Evaluated Risk Classification: {calculated_risk}

Synthesize these inputs.
CRITICAL INSTRUCTIONS:
- You must NOT provide direct investment advice.
- You must NOT recommend BUY, HOLD, or SELL. Only explain market intelligence.
- Determine the overall Market Bias as Bullish, Bearish, or Neutral.
- The risk level should be consistent with the calculated risk: {calculated_risk}.
- The confidence should be consistent with the calculated weighted confidence: {calculated_confidence}%.

Return ONLY a valid JSON object matching this structure:
{{
  "market_bias": "Bullish" | "Bearish" | "Neutral",
  "confidence": {calculated_confidence} (keep this exact value),
  "risk": "{calculated_risk}" (keep this exact value),
  "key_drivers": ["list of primary consensus drivers across technicals, fundamentals, and news"],
  "watchlist_factors": ["list of target watchlist triggers, price levels, or catalysts to monitor"],
  "potential_risks": ["list of structural risks or downside catalysts specific to this analysis"],
  "future_catalysts": ["list of upside drivers or catalyst events to monitor"],
  "summary": "comprehensive executive synthesis narrative integrating all agents (2 paragraphs)"
}}

Return ONLY the raw JSON. Do not write markdown tags or backticks (no ```json).
"""
            llm_text = query_groq(prompt)
            llm_res = json.loads(llm_text)
            
            return {
                "market_bias": llm_res.get("market_bias", calculated_bias),
                "confidence": int(llm_res.get("confidence", calculated_confidence)),
                "risk": llm_res.get("risk", calculated_risk),
                "key_drivers": llm_res.get("key_drivers", rule_drivers),
                "watchlist_factors": llm_res.get("watchlist_factors", rule_watchlist),
                "potential_risks": llm_res.get("potential_risks", rule_risks),
                "future_catalysts": llm_res.get("future_catalysts", rule_catalysts),
                "summary": llm_res.get("summary", calculated_summary),
                "fallback_active": False
            }
            
        except Exception as e:
            logger.warning(f"Groq Master Agent synthesis failed: {str(e)}. Fallback to rule engine.")
            # Fall back to standard rule engine calculations
            
    # ── Fallback Return ──
    return {
        "market_bias": calculated_bias,
        "confidence": calculated_confidence,
        "risk": calculated_risk,
        "key_drivers": rule_drivers,
        "watchlist_factors": rule_watchlist,
        "potential_risks": rule_risks,
        "future_catalysts": rule_catalysts,
        "summary": calculated_summary,
        "fallback_active": True
    }
