import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("POLYGON_API_KEY")

BASE_URL = "https://api.massive.com"


def get_stock_snapshot(ticker: str):

    url = f"{BASE_URL}/v2/aggs/ticker/{ticker}/prev"

    params = {
        "adjusted": "true",
        "apiKey": API_KEY
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    return response.json()
def get_stock_news(ticker: str):

    url = f"{BASE_URL}/v2/reference/news"

    params = {
        "ticker": ticker,
        "limit": 10,
        "order": "desc",
        "sort": "published_utc",
        "apiKey": API_KEY
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    return response.json()