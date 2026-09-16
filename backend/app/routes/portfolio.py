from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from pydantic import (
    BaseModel,
    Field,
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Portfolio

from app.services.market_service import (
    get_stock_snapshot,
)

from app.services.portfolio_service import (
    calculate_portfolio,
)


router = APIRouter()


# -------------------------
# Request Model
# -------------------------

class PortfolioCreate(BaseModel):
    ticker: str = Field(
        min_length=1,
        max_length=10
    )

    quantity: float = Field(
        gt=0
    )

    buy_price: float = Field(
        gt=0
    )


# -------------------------
# ADD STOCK
# -------------------------

@router.post("/")
def add_stock(
    stock: PortfolioCreate,
    db: Session = Depends(get_db),
):

    ticker = (
        stock.ticker
        .strip()
        .upper()
    )

    if not ticker:
        raise HTTPException(
            status_code=400,
            detail="Ticker is required."
        )

    # Check whether ticker exists
    try:

        market_data = (
            get_stock_snapshot(ticker)
        )

        results = market_data.get(
            "results",
            []
        )

        if not results:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"No market data found "
                    f"for ticker {ticker}."
                ),
            )

    except HTTPException:
        raise

    except Exception as error:

        print(
            f"Ticker validation error: "
            f"{error}"
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to validate ticker. "
                "Please try again."
            ),
        )

    new_stock = Portfolio(
        ticker=ticker,
        quantity=stock.quantity,
        buy_price=stock.buy_price,
    )

    db.add(new_stock)
    db.commit()
    db.refresh(new_stock)

    return new_stock


# -------------------------
# GET PORTFOLIO
# -------------------------

@router.get("/")
def get_portfolio(
    db: Session = Depends(get_db),
):

    stocks = (
        db.query(Portfolio)
        .all()
    )

    portfolio_data = []

    for stock in stocks:

        current_price = (
            stock.buy_price
        )

        try:

            market_data = (
                get_stock_snapshot(
                    stock.ticker
                )
            )

            results = market_data.get(
                "results",
                []
            )

            if results:

                current_price = (
                    results[0].get(
                        "c",
                        stock.buy_price
                    )
                )

        except Exception as error:

            print(
                f"Price fetch failed "
                f"for {stock.ticker}: "
                f"{error}"
            )

        calculations = (
            calculate_portfolio(
                stock.quantity,
                stock.buy_price,
                current_price,
            )
        )

        portfolio_data.append(
            {
                "id": stock.id,

                "ticker":
                    stock.ticker,

                "quantity":
                    stock.quantity,

                "buy_price":
                    stock.buy_price,

                "current_price":
                    current_price,

                **calculations,
            }
        )

    return portfolio_data


# -------------------------
# DELETE STOCK
# -------------------------

@router.delete("/{stock_id}")
def delete_stock(
    stock_id: int,
    db: Session = Depends(get_db),
):

    stock = (
        db.query(Portfolio)
        .filter(
            Portfolio.id
            == stock_id
        )
        .first()
    )

    if stock is None:

        raise HTTPException(
            status_code=404,
            detail="Stock not found."
        )

    db.delete(stock)
    db.commit()

    return {
        "message":
            "Stock deleted successfully."
    }