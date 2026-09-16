from fastapi import APIRouter

from app.services.scheduler_service import (
    get_all_cached_sentiment,
    get_cached_sentiment,
)


router = APIRouter()


@router.get("/")
def get_automation_status():

    cache = (
        get_all_cached_sentiment()
    )

    return {
        "status": "running",
        "tracked_stocks": len(cache),
        "results": cache,
    }


@router.get("/{ticker}")
def get_ticker_automation(
    ticker: str
):

    result = get_cached_sentiment(
        ticker
    )

    if result is None:
        return {
            "ticker": ticker.upper(),
            "message":
                "No automated analysis available yet.",
        }

    return result
