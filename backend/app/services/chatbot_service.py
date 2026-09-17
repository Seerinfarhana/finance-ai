import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()


client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


SYSTEM_PROMPT = """
You are FinAI Assistant, an AI assistant inside a financial
portfolio and news sentiment analysis application.

Your job is to explain financial information in a simple,
clear and concise way.

FinAI contains:
- Portfolio tracking
- Profit and loss calculations
- Financial news
- FinBERT financial news sentiment analysis
- Automated sentiment monitoring
- Portfolio analytics

Important rules:
1. Do not claim that you can predict future stock prices.
2. Do not tell users that they must buy or sell a stock.
3. Clearly distinguish news sentiment from stock-price movement.
4. Explain financial terms simply when the user asks.
5. When portfolio information is provided, use those values
   instead of inventing numbers.
6. If information is unavailable, say that it is unavailable.
7. Keep normal answers reasonably concise.
"""


def generate_chat_response(
    message: str,
    context: str = "",
):
    user_content = f"""
User question:
{message}

FinAI application context:
{context if context else "No additional portfolio context provided."}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",

        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": user_content,
            },
        ],

        temperature=0.3,
        max_tokens=700,
    )

    return response.choices[0].message.content