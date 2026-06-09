# test_backend.py
# Verification script to test that all backend services and agents function end-to-end.
# Run this within the backend directory.

import sys
import os

# Add the backend directory to the path so we can import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..", "QUANTAM-AI-RESEARCH-AGENT", "backend")))

print("Python path configured. Testing imports...")

try:
    from services import stock_service, news_service
    from agents import technical_agent, fundamental_agent, sentiment_agent, master_agent
    print("Success: All modules imported cleanly.")
except Exception as e:
    print(f"Error during imports: {str(e)}")
    sys.exit(1)

def run_test(symbol):
    print(f"\n--- Testing Symbol: {symbol} ---")
    try:
        # Resolve Ticker
        resolved = stock_service.resolve_symbol(symbol)
        print(f"1. Resolved Ticker: {resolved}")

        # Fetch market stats and OHLCV timeframes
        stock_data = stock_service.get_stock_data(resolved)
        print(f"2. Stock Data: Price: {stock_data['price']}, Change: {stock_data['change_pct']}%, Market Cap: {stock_data['market_cap']}")
        
        timeframes = stock_service.get_multiple_timeframes(resolved)
        print(f"3. History Timeframes: Got 15m ({len(timeframes.get('15m', []))} items), 1d ({len(timeframes.get('1d', []))} items), 1w ({len(timeframes.get('1w', []))} items)")

        # Fetch News
        news_data = news_service.get_news(resolved)
        print(f"4. News Headlines: Fetched {news_data['total_articles']} articles from {news_data['source']}")
        for a in news_data['articles'][:2]:
            print(f"   - [{a['sentiment']}] {a['title']}")

        # Technical Analysis
        tech_res = technical_agent.analyze(stock_data, timeframes)
        print(f"5. Technical Agent Verdict: {tech_res['trend']} (Strength: {tech_res['trend_strength']}, Conf: {tech_res['confidence']}%)")
        print(f"   - Support Level (20d min): {tech_res['support_level']} (Dist: {tech_res['distance_to_support']}%)")
        print(f"   - Resistance Level (20d max): {tech_res['resistance_level']} (Dist: {tech_res['distance_to_resistance']}%)")
        print(f"   - Timeframe Trends: {tech_res['timeframe_analysis']}")
        print(f"   - Tech Risk Factors: {tech_res['risk_factors'][:2]}")
        print(f"   - Summary: {tech_res['summary'][:150]}...")

        # Fundamental Analysis
        fund_res = fundamental_agent.analyze(stock_data)
        print(f"6. Fundamental Agent Verdict: {fund_res['fundamental']} (Health: {fund_res['health_score']}, Valuation: {fund_res['valuation_score']}, Growth: {fund_res['growth_score']})")
        print(f"   - Strengths: {fund_res['strengths'][:2]}")
        print(f"   - Weaknesses: {fund_res['weaknesses'][:2]}")
        print(f"   - Summary: {fund_res['summary'][:150]}...")

        # Sentiment Analysis
        sent_res = sentiment_agent.analyze(news_data)
        print(f"7. Sentiment Agent Verdict: {sent_res['sentiment']} (Pos ratio: {sent_res['positive_ratio']}, Neg ratio: {sent_res['negative_ratio']})")
        print(f"   - Pos Drivers: {sent_res['positive_drivers'][:2]}")
        print(f"   - Neg Drivers: {sent_res['negative_drivers'][:2]}")
        print(f"   - Events: {sent_res['events']}")
        print(f"   - Summary: {sent_res['summary'][:150]}...")

        # Master Synthesis
        master_res = master_agent.analyze(tech_res, fund_res, sent_res)
        print(f"8. Master Synthesis Report:")
        print(f"   - Market Bias: {master_res['market_bias']}")
        print(f"   - Risk: {master_res['risk']}")
        print(f"   - Confidence: {master_res['confidence']}%")
        print(f"   - Key Drivers: {master_res['key_drivers'][:2]}")
        print(f"   - Watchlist Factors: {master_res['watchlist_factors'][:2]}")
        print(f"   - Summary: {master_res['summary']}")

        print(f"\nSUCCESS: End-to-end verification completed successfully for {symbol}!")

    except Exception as e:
        print(f"FAILURE: Exception encountered during test execution: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Test a US stock
    run_test("AAPL")
    # Test an Indian stock
    run_test("INFY")
