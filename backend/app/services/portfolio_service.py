def calculate_portfolio(
    quantity: float,
    buy_price: float,
    current_price: float
):

    investment = quantity * buy_price

    current_value = quantity * current_price

    profit_loss = current_value - investment

    if investment > 0:
        percentage = (profit_loss / investment) * 100
    else:
        percentage = 0

    return {
        "investment": round(investment, 2),
        "current_value": round(current_value, 2),
        "profit_loss": round(profit_loss, 2),
        "percentage": round(percentage, 2)
    }