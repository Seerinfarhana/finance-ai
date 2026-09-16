from transformers import pipeline


sentiment_pipeline = pipeline(
    "text-classification",
    model="ProsusAI/finbert"
)


def analyze_sentiment(text: str):

    if not text:
        return {
            "sentiment": "neutral",
            "confidence": 0
        }

    result = sentiment_pipeline(text[:1000])[0]

    return {
        "sentiment": result["label"],
        "confidence": round(result["score"], 4)
    }