from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler

from app.database.database import SessionLocal
from app.database.models import Portfolio
from app.services.market_service import get_stock_news
from app.services.sentiment_service import analyze_sentiment


scheduler = BackgroundScheduler()

# Stores the latest automatically analyzed results
sentiment_cache = {}


def automated_market_update():
    print(
        f"\n[FinAI Automation] Starting update at "
        f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )

    db = SessionLocal()

    try:
        # Get all stocks from portfolio
        stocks = db.query(Portfolio).all()

        if not stocks:
            print(
                "[FinAI Automation] No stocks in portfolio."
            )
            return

        # Remove duplicate ticker symbols
        tickers = list(
            set(
                stock.ticker.upper()
                for stock in stocks
            )
        )

        print(
            f"[FinAI Automation] Monitoring: {tickers}"
        )

        for ticker in tickers:

            try:
                print(
                    f"[FinAI Automation] Fetching news for {ticker}..."
                )

                news_data = get_stock_news(ticker)

                articles = news_data.get(
                    "results",
                    []
                )

                analyzed_articles = []

                # Analyze only first 3 articles
                # to keep automation lightweight
                for article in articles[:3]:

                    title = article.get(
                        "title",
                        ""
                    )

                    description = article.get(
                        "description",
                        ""
                    )

                    text = (
                        title
                        + ". "
                        + description
                    ).strip()

                    if not text:
                        continue

                    sentiment_result = (
                        analyze_sentiment(text)
                    )

                    analyzed_articles.append(
                        {
                            "title": title,

                            "publisher": article.get(
                                "publisher",
                                {}
                            ).get(
                                "name",
                                ""
                            ),

                            "published_utc":
                                article.get(
                                    "published_utc",
                                    ""
                                ),

                            "article_url":
                                article.get(
                                    "article_url",
                                    ""
                                ),

                            "sentiment":
                                sentiment_result[
                                    "sentiment"
                                ],

                            "confidence":
                                sentiment_result[
                                    "confidence"
                                ],
                        }
                    )

                positive = sum(
                    1
                    for article
                    in analyzed_articles
                    if article[
                        "sentiment"
                    ].lower()
                    == "positive"
                )

                neutral = sum(
                    1
                    for article
                    in analyzed_articles
                    if article[
                        "sentiment"
                    ].lower()
                    == "neutral"
                )

                negative = sum(
                    1
                    for article
                    in analyzed_articles
                    if article[
                        "sentiment"
                    ].lower()
                    == "negative"
                )

                sentiment_cache[ticker] = {
                    "ticker": ticker,

                    "updated_at":
                        datetime.now().isoformat(),

                    "article_count":
                        len(
                            analyzed_articles
                        ),

                    "positive": positive,

                    "neutral": neutral,

                    "negative": negative,

                    "articles":
                        analyzed_articles,
                }

                print(
                    f"[FinAI Automation] "
                    f"{ticker}: "
                    f"{positive} positive, "
                    f"{neutral} neutral, "
                    f"{negative} negative"
                )

            except Exception as error:

                print(
                    f"[FinAI Automation] "
                    f"Failed to update "
                    f"{ticker}: {error}"
                )

        print(
            "[FinAI Automation] "
            "Update completed.\n"
        )

    finally:
        db.close()


def get_cached_sentiment(
    ticker: str
):
    return sentiment_cache.get(
        ticker.upper()
    )


def get_all_cached_sentiment():
    return sentiment_cache


def start_scheduler():

    if scheduler.get_job(
        "market_update"
    ) is None:

        scheduler.add_job(
            automated_market_update,
            trigger="interval",
            minutes=5,
            id="market_update",
            replace_existing=True,
        )

    if not scheduler.running:
        scheduler.start()

    print(
        "[FinAI Automation] "
        "Scheduler started successfully."
    )


def stop_scheduler():

    if scheduler.running:
        scheduler.shutdown()

        print(
            "[FinAI Automation] "
            "Scheduler stopped."
        )