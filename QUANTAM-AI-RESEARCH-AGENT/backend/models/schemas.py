# schemas.py
# Defines the data models for validating HTTP request and response shapes.

from pydantic import BaseModel
from typing import List, Dict, Any


# ─── Request Schema ───────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    """
    Input schema for the stock analyzer.
    Example: { "symbol": "AAPL" }
    """
    symbol: str  # e.g. "AAPL", "TSLA", "RELIANCE.NS"


# ─── Agent Output Schemas ─────────────────────────────────────────────────────

class TechnicalResult(BaseModel):
    """Output from the Technical Analysis Agent (combines code indicator math and LLM output)"""
    trend: str                      # "Bullish", "Bearish", "Neutral"
    confidence: int                 # 0–100 score
    reason: str                     # Backward compatibility fallback
    summary: str                    # Detailed trend & structure commentary
    trend_strength: str             # "Strong", "Moderate", "Weak"
    support: float                  # Old field
    resistance: float               # Old field
    support_level: float            # Support price level (20-period min)
    resistance_level: float         # Resistance price level (20-period max)
    distance_to_support: float      # Percentage distance to support
    distance_to_resistance: float    # Percentage distance to resistance
    volatility: float               # Annualized daily returns volatility %
    signals: List[str]              # Primary positive/negative indicators
    risk_factors: List[str]          # Technical risk warning indicators
    timeframe_analysis: Dict[str, str] # Multi-timeframe trend mappings (15m, 1h, 4h, 1d, 1w)
    fallback_active: bool = False   # True if fallback engine was activated


class FundamentalResult(BaseModel):
    """Output from the Fundamental Analysis Agent"""
    fundamental: str                # "Strong", "Weak", "Average"
    confidence: int                 # 0–100 score
    reason: str                     # Backward compatibility fallback
    summary: str                    # Balance sheet & growth commentary
    health_score: int               # 0–100 financial health index
    valuation_score: int            # 0–100 valuation multiples index
    growth_score: int               # 0–100 expansion rate index
    strengths: List[str]            # Primary balance sheet strengths
    weaknesses: List[str]          # Core capital/solvency risks
    metrics: Dict[str, Any]         # Dictionary of raw data metrics
    fallback_active: bool = False   # True if fallback engine was activated


class SentimentResult(BaseModel):
    """Output from the Sentiment Analysis Agent"""
    sentiment: str                  # "Positive", "Negative", "Neutral"
    confidence: int                 # 0–100 consensus score
    reason: str                     # Backward compatibility fallback
    summary: str                    # News/media narrative summary
    positive_drivers: List[str]     # Key positive drivers extracted
    negative_drivers: List[str]     # Key negative concerns/drivers
    positive_ratio: float           # Portion of positive stories (0.0 to 1.0)
    negative_ratio: float           # Portion of negative stories (0.0 to 1.0)
    events: List[str]               # Specific corporate/macro events tagged
    articles: List[Dict[str, Any]] = [] # Real news articles fetched
    fallback_active: bool = False   # True if fallback engine was activated



class FinalDecision(BaseModel):
    """Output from the Master Agent that combines all signals"""
    market_bias: str                # "Bullish", "Neutral", "Bearish" (Explainable intelligence)
    confidence: int                 # Weighted consensus score
    risk: str                       # Risk assessment level ("Low", "Medium", "High")
    key_drivers: List[str]          # Main drivers derived from sub-agents
    watchlist_factors: List[str]    # Pivotal trigger events to track
    summary: str                    # Executive synthesis commentary
    potential_risks: List[str] = [] # Specific downside triggers/risks
    future_catalysts: List[str] = [] # Upcoming upside catalysts/events
    fallback_active: bool = False   # True if fallback engine was activated


# ─── Full Response Schema ─────────────────────────────────────────────────────

class SystemStatus(BaseModel):
    """System health, connection status, caching indicators, and execution timings"""
    backend_status: str             # "Online"
    groq_status: str                # "Online", "Offline", "Fallback Mode"
    yfinance_status: str            # "Online", "Offline"
    news_status: str                # "Online", "Offline"
    cache_status: str               # "Hit" | "Miss"
    cache_ttl_sec: int              # Remaining TTL in seconds
    execution_time_sec: float       # High-precision timer timing

class AnalyzeResponse(BaseModel):
    """
    Combined responses package sent to client.
    """
    stock: str
    current_price: float
    change_pct: float
    technical: TechnicalResult
    fundamental: FundamentalResult
    sentiment: SentimentResult
    final_decision: FinalDecision
    system_status: SystemStatus = None # System performance & fallback statistics
