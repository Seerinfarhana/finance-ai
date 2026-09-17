import os

from groq import Groq


client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_sentiment(text: str):

    if not text.strip():
        return {
            "sentiment": "neutral",
            "confidence": 0.0,
        }


    prompt = f"""
Classify the sentiment of the following financial
news text.

Return ONLY one word:

positive
neutral
negative

Do not provide an explanation.

Financial news:

{text[:1500]}
"""


    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You classify financial news "
                        "sentiment as positive, neutral, "
                        "or negative."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0,
            max_tokens=10,
        )


        result = (
            response.choices[0]
            .message.content
            .strip()
            .lower()
        )


        if "positive" in result:
            sentiment = "positive"

        elif "negative" in result:
            sentiment = "negative"

        else:
            sentiment = "neutral"


        return {
            "sentiment": sentiment,
            "confidence": None,
        }


    except Exception as error:

        print(
            f"Sentiment analysis failed: {error}"
        )

        return {
            "sentiment": "neutral",
            "confidence": None,
        }