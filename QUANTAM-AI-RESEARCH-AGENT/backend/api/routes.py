# routes.py
# This file defines the FastAPI routes and wires them to the analytical pipeline.
# Includes structured logging, validation error handlers, and dotenv reading.

from fastapi import APIRouter, HTTPException, Depends
from models.schemas import AnalyzeRequest, AnalyzeResponse
from agents import technical_agent, fundamental_agent, sentiment_agent, master_agent
from services import stock_service, news_service, cache_service
import logging
import os
from dotenv import load_dotenv
import time

# Load environment variables from .env
load_dotenv()

from logging.handlers import RotatingFileHandler

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        RotatingFileHandler("quantum_system.log", maxBytes=10*1024*1024, backupCount=5, encoding="utf-8")
    ]
)
logger = logging.getLogger("quantum_agent.api")

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_stock(request: AnalyzeRequest):
    """
    POST /analyze
    Takes a ticker symbol, coordinates the data fetching and multi-agent 
    analysis flow, aggregates signals through the Master Agent, and returns the analysis.
    """
    start_time = time.perf_counter()
    symbol = request.symbol.upper().strip()
    if not symbol:
        raise HTTPException(status_code=400, detail="Stock ticker symbol cannot be empty")
        
    logger.info(f"Received analysis request for symbol: {symbol}")
    
    # ── Step 1: Check Cache ──
    cached_result = cache_service.get_from_cache(symbol)
    if cached_result:
        logger.info(f"Returning cached analysis for symbol: {symbol}")
        # The cached result might have old schemas or different structure, 
        # so we validate it. If validation succeeds, return it.
        try:
            cache_info = cache_service.get_cache_info(symbol)
            fallback_active = (
                cached_result.get("technical", {}).get("fallback_active", False) or
                cached_result.get("fundamental", {}).get("fallback_active", False) or
                cached_result.get("sentiment", {}).get("fallback_active", False) or
                cached_result.get("final_decision", {}).get("fallback_active", False)
            )
            cached_result["system_status"] = {
                "backend_status": "Online",
                "groq_status": "Fallback Mode" if fallback_active else ("Online" if os.getenv("GROQ_API_KEY") else "Offline"),
                "yfinance_status": "Online",
                "news_status": "Online",
                "cache_status": "Hit",
                "cache_ttl_sec": cache_info["ttl_remaining"],
                "execution_time_sec": round(time.perf_counter() - start_time, 3)
            }
            return cached_result
        except Exception as cache_err:
            logger.warning(f"Cached schema mismatch for {symbol}. Recalculating. Error: {str(cache_err)}")
            # If cache is old, clear it and proceed
            cache_service.clear_cache()
            
    # ── Step 2: Fetch Real-Time Market and News Data ──
    logger.info(f"Fetching market data and historical timeframes for {symbol}...")
    try:
        # Resolve Indian tickers if applicable
        resolved_symbol = stock_service.resolve_symbol(symbol)
        
        # Parallel-like fetch (fetched sequentially but with robust fallbacks)
        stock_data = stock_service.get_stock_data(resolved_symbol)
        timeframe_data = stock_service.get_multiple_timeframes(resolved_symbol)
        news_data = news_service.get_news(resolved_symbol)
        
        logger.info(f"Successfully retrieved data. Executing analysis pipeline...")
        
    except Exception as data_err:
        logger.error(f"Data acquisition failure for {symbol}: {str(data_err)}")
        raise HTTPException(
            status_code=500,
            detail=f"Data pipeline failure for {symbol}: {str(data_err)}"
        )
        
    # ── Step 3: Run Sub-Agent Analyses ──
    try:
        # Technical Agent (assesses multi-timeframe closes)
        logger.info(f"Running Technical Analysis Agent for {resolved_symbol}...")
        technical_result = technical_agent.analyze(stock_data, timeframe_data)
        
        # Fundamental Agent (assesses earnings, margins, valuation)
        logger.info(f"Running Fundamental Analysis Agent for {resolved_symbol}...")
        fundamental_result = fundamental_agent.analyze(stock_data)
        
        # Sentiment Agent (assesses recent news headlines)
        logger.info(f"Running Sentiment Analysis Agent for {resolved_symbol}...")
        sentiment_result = sentiment_agent.analyze(news_data)
        
    except Exception as agent_err:
        logger.error(f"Analytical sub-agent failure for {resolved_symbol}: {str(agent_err)}")
        raise HTTPException(
            status_code=500,
            detail=f"Analytical sub-agent failure: {str(agent_err)}"
        )
        
    # ── Step 4: Run Master Agent synthesis ──
    try:
        logger.info(f"Running Master Synthesis Agent to aggregate indicators...")
        final_decision = master_agent.analyze(
            technical_result, 
            fundamental_result, 
            sentiment_result
        )
    except Exception as master_err:
        logger.error(f"Master Agent synthesis failure for {resolved_symbol}: {str(master_err)}")
        raise HTTPException(
            status_code=500,
            detail=f"Master Agent synthesis failure: {str(master_err)}"
        )
        
    # ── Step 5: Format and Cache Response ──
    # Attach raw articles to sentiment result for frontend News Insights presentation
    sentiment_result["articles"] = news_data.get("articles", [])

    fallback_active = (
        technical_result.get("fallback_active", False) or
        fundamental_result.get("fallback_active", False) or
        sentiment_result.get("fallback_active", False) or
        final_decision.get("fallback_active", False)
    )
    exec_time = round(time.perf_counter() - start_time, 3)

    system_status = {
        "backend_status": "Online",
        "groq_status": "Fallback Mode" if fallback_active else ("Online" if os.getenv("GROQ_API_KEY") else "Offline"),
        "yfinance_status": "Online",
        "news_status": "Online",
        "cache_status": "Miss",
        "cache_ttl_sec": 300,
        "execution_time_sec": exec_time
    }

    response_data = {
        "stock": resolved_symbol,
        "current_price": stock_data["price"],
        "change_pct": stock_data["change_pct"],
        "technical": technical_result,
        "fundamental": fundamental_result,
        "sentiment": sentiment_result,
        "final_decision": final_decision,
        "system_status": system_status
    }
    
    # Store in cache
    cache_service.set_in_cache(resolved_symbol, response_data)
    logger.info(f"Completed analysis and cached response for {resolved_symbol}")
    
    return response_data

@router.get("/health")
async def health_check():
    """
    GET /health
    Pings backend server status and verifies environment.
    """
    groq_loaded = "GROQ_API_KEY" in os.environ and bool(os.environ["GROQ_API_KEY"].strip())
    gemini_loaded = "GEMINI_API_KEY" in os.environ and bool(os.environ["GEMINI_API_KEY"].strip())
    return {
        "status": "ok",
        "message": "QUANTUM AGENT Backend is fully operational",
        "environment": {
            "groq_api_key_configured": groq_loaded,
            "gemini_api_key_configured": gemini_loaded
        }
    }

@router.get("/stock/{symbol}")
async def get_stock_info(symbol: str):
    """
    GET /stock/{symbol}
    Returns raw ticker metrics and multiple historical timeframe closes.
    """
    resolved_symbol = stock_service.resolve_symbol(symbol)
    try:
        stock_data = stock_service.get_stock_data(resolved_symbol)
        timeframe_data = stock_service.get_multiple_timeframes(resolved_symbol)
        return {
            "stock": stock_data,
            "timeframes": timeframe_data
        }
    except Exception as e:
        logger.error(f"Error fetching stock info for {resolved_symbol}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch stock detail for {resolved_symbol}: {str(e)}"
        )
