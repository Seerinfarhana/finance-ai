from fastapi import APIRouter
from app.services.market_service import get_stock_snapshot


router = APIRouter()


@router.get("/{ticker}")
def get_stock(ticker: str):

    data = get_stock_snapshot(
        ticker.upper()
    )

    return data