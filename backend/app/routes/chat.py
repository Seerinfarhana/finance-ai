from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Portfolio
from app.services.chatbot_service import generate_chat_response
from app.services.market_service import get_stock_snapshot
from app.services.portfolio_service import calculate_portfolio
from app.services.scheduler_service import get_all_cached_sentiment


router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=1000,
    )


@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    try:

        # ---------------------------------
        # 1. GET PORTFOLIO
        # ---------------------------------

        stocks = db.query(Portfolio).all()

        portfolio_context = []

        total_investment = 0
        total_current_value = 0


        # ---------------------------------
        # 2. GET MARKET DATA
        # ---------------------------------

        for stock in stocks:

            current_price = stock.buy_price

            try:

                market_data = get_stock_snapshot(
                    stock.ticker
                )

                results = market_data.get(
                    "results",
                    []
                )

                if results:

                    current_price = results[0].get(
                        "c",
                        stock.buy_price,
                    )

            except Exception as error:

                print(
                    f"Chatbot price fetch failed "
                    f"for {stock.ticker}: {error}"
                )


            # Calculate portfolio values

            calculations = calculate_portfolio(
                stock.quantity,
                stock.buy_price,
                current_price,
            )


            total_investment += calculations[
                "investment"
            ]

            total_current_value += calculations[
                "current_value"
            ]


            portfolio_context.append(
                f"""
Ticker: {stock.ticker}
Quantity: {stock.quantity}
Buy Price: ${stock.buy_price:.2f}
Current Price: ${current_price:.2f}
Investment: ${calculations['investment']:.2f}
Current Value: ${calculations['current_value']:.2f}
Profit/Loss: ${calculations['profit_loss']:.2f}
Return: {calculations['percentage']:.2f}%
"""
            )


        # ---------------------------------
        # 3. PORTFOLIO SUMMARY
        # ---------------------------------

        total_profit_loss = (
            total_current_value
            - total_investment
        )


        if total_investment > 0:

            total_return = (
                total_profit_loss
                / total_investment
            ) * 100

        else:

            total_return = 0


        # ---------------------------------
        # 4. GET FINBERT SENTIMENT
        # ---------------------------------

        sentiment_cache = (
            get_all_cached_sentiment()
        )

        sentiment_context = []


        for ticker, sentiment_data in sentiment_cache.items():

            sentiment_context.append(
                f"""
Ticker: {ticker}
Articles Analyzed: {sentiment_data.get('article_count', 0)}
Positive Articles: {sentiment_data.get('positive', 0)}
Neutral Articles: {sentiment_data.get('neutral', 0)}
Negative Articles: {sentiment_data.get('negative', 0)}
Last Updated: {sentiment_data.get('updated_at', 'Unknown')}
"""
            )


        # ---------------------------------
        # 5. CREATE PORTFOLIO CONTEXT
        # ---------------------------------

        if portfolio_context:

            portfolio_section = f"""
CURRENT USER PORTFOLIO

{''.join(portfolio_context)}

PORTFOLIO SUMMARY

Total Investment:
${total_investment:.2f}

Current Portfolio Value:
${total_current_value:.2f}

Total Profit/Loss:
${total_profit_loss:.2f}

Overall Return:
{total_return:.2f}%
"""

        else:

            portfolio_section = """
CURRENT USER PORTFOLIO

The user's portfolio is currently empty.
"""


        # ---------------------------------
        # 6. CREATE SENTIMENT CONTEXT
        # ---------------------------------

        if sentiment_context:

            sentiment_section = f"""
AUTOMATED FINBERT NEWS SENTIMENT

{''.join(sentiment_context)}

IMPORTANT:
These values represent sentiment from analyzed
financial news articles.

They do not predict future stock-price movement.
"""

        else:

            sentiment_section = """
AUTOMATED FINBERT NEWS SENTIMENT

No automated sentiment analysis is currently
available.

The scheduler may not have completed its
first analysis yet.
"""


        # ---------------------------------
        # 7. COMBINE CONTEXT
        # ---------------------------------

        context = f"""
{portfolio_section}

{sentiment_section}
"""


        # ---------------------------------
        # 8. ASK GROQ
        # ---------------------------------

        answer = generate_chat_response(
            request.message,
            context,
        )


        # ---------------------------------
        # 9. RETURN RESPONSE
        # ---------------------------------

        return {
            "message": request.message,
            "response": answer,
        }


    except Exception as error:

        print(
            f"Chatbot error: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to generate chatbot response.",
        )