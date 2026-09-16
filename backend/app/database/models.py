from sqlalchemy import Column, Integer, String, Float

from app.database.database import Base


class Portfolio(Base):
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True, index=True)

    ticker = Column(
        String,
        nullable=False
    )

    quantity = Column(
        Float,
        nullable=False
    )

    buy_price = Column(
        Float,
        nullable=False
    )