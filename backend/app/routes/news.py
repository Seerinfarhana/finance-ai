from fastapi import APIRouter
from app.services.market_service import get_stock_news
from app.services.sentiment_service import analyze_sentiment

router = APIRouter()


@router.get("/{ticker}")
def get_news(ticker: str):

    data = get_stock_news(ticker.upper())

    articles = data.get("results", [])

    analyzed_articles = []

    for article in articles:

        title = article.get("title", "")
        description = article.get("description", "")

        # Combine title and description for sentiment analysis
        text = title + ". " + description

        sentiment = analyze_sentiment(text)

        analyzed_articles.append({
            "title": title,
            "description": description,
            "publisher": article.get("publisher", {}).get("name", ""),
            "published_utc": article.get("published_utc", ""),
            "article_url": article.get("article_url", ""),
            "sentiment": sentiment["sentiment"],
            "confidence": sentiment["confidence"]
        })

    return {
        "ticker": ticker.upper(),
        "count": len(analyzed_articles),
        "articles": analyzed_articles
    }