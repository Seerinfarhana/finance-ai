import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import { Search } from "lucide-react";

import Sidebar from "../components/Sidebar";

import NewsCard, {
  type NewsArticle,
} from "../components/NewsCard";

import SentimentChart from "../components/SentimentChart";

import { getNews } from "../services/api";


function News() {

  // ==========================================
  // READ TICKER FROM URL
  // Example: /news?ticker=AAPL
  // ==========================================

  const [searchParams] =
    useSearchParams();

  const searchedTicker =
    searchParams.get("ticker") || "AAPL";


  // ==========================================
  // STATE
  // ==========================================

  const [ticker, setTicker] =
    useState(searchedTicker);

  const [articles, setArticles] =
    useState<NewsArticle[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // NORMAL NEWS SEARCH
  // Used when user enters ticker manually
  // ==========================================

  async function loadNews() {

    const normalizedTicker =
      ticker
        .trim()
        .toUpperCase();

    if (!normalizedTicker) {

      setError(
        "Please enter a ticker symbol."
      );

      return;
    }

    try {

      setLoading(true);
      setError("");

      const data =
        await getNews(
          normalizedTicker
        );

      setArticles(
        data.articles || []
      );

    } catch (error) {

      console.error(
        "Failed to load news:",
        error
      );

      setError(
        "Unable to load financial news."
      );

      setArticles([]);

    } finally {

      setLoading(false);

    }
  }


  // ==========================================
  // DASHBOARD SEARCH
  //
  // If Dashboard sends:
  // /news?ticker=AAPL
  //
  // automatically analyze AAPL
  // ==========================================

  useEffect(() => {

    const tickerFromUrl =
      searchParams.get("ticker");

    if (!tickerFromUrl) {
      return;
    }

    const normalizedTicker =
      tickerFromUrl
        .trim()
        .toUpperCase();

    if (!normalizedTicker) {
      return;
    }

    

    async function analyzeFromSearch() {

      try {

        setLoading(true);
        setError("");

        const data =
          await getNews(
            normalizedTicker
          );

        setArticles(
          data.articles || []
        );

      } catch (error) {

        console.error(
          "Failed to load news:",
          error
        );

        setError(
          "Unable to load financial news."
        );

        setArticles([]);

      } finally {

        setLoading(false);

      }
    }


    analyzeFromSearch();

  }, [searchParams]);


  // ==========================================
  // SENTIMENT CALCULATIONS
  // ==========================================

  const positiveCount =
    articles.filter(
      (article) =>
        article.sentiment
          .toLowerCase() ===
        "positive"
    ).length;


  const neutralCount =
    articles.filter(
      (article) =>
        article.sentiment
          .toLowerCase() ===
        "neutral"
    ).length;


  const negativeCount =
    articles.filter(
      (article) =>
        article.sentiment
          .toLowerCase() ===
        "negative"
    ).length;


  const totalArticles =
    articles.length;


  // ==========================================
  // OVERALL NEWS SENTIMENT
  // ==========================================

  let overallSentiment =
    "Neutral";


  if (
    positiveCount >
      neutralCount &&
    positiveCount >
      negativeCount
  ) {

    overallSentiment =
      "Positive";

  } else if (
    negativeCount >
      positiveCount &&
    negativeCount >
      neutralCount
  ) {

    overallSentiment =
      "Negative";
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="app-layout">

      <Sidebar />


      <main className="main-content">


        {/* PAGE HEADER */}

        <div className="news-page-header">

          <div>

            <h1>
              Financial News Intelligence
            </h1>

            <p>
              AI-powered financial news
              sentiment analysis using
              FinBERT
            </p>

          </div>

        </div>


        {/* SEARCH BAR */}

        <div className="news-search">

          <Search size={19} />

          <input
            type="text"
            value={ticker}
            placeholder="Enter ticker, e.g. AAPL"
            maxLength={10}
            onChange={(event) =>
              setTicker(
                event.target.value
                  .toUpperCase()
              )
            }
            onKeyDown={(event) => {

              if (
                event.key === "Enter"
              ) {
                loadNews();
              }

            }}
          />


          <button
            type="button"
            onClick={loadNews}
            disabled={loading}
          >

            {loading
              ? "Analyzing..."
              : "Analyze News"}

          </button>

        </div>


        {/* ERROR */}

        {error && (

          <p className="news-error">
            {error}
          </p>

        )}


        {/* LOADING */}

        {loading && (

          <div className="news-loading">

            <h3>
              FinBERT is analyzing
              the news...
            </h3>

            <p>
              Processing financial
              articles for{" "}
              {ticker}.
            </p>

          </div>

        )}


        {/* NO NEWS FOUND */}

        {!loading &&
          !error &&
          totalArticles === 0 && (

            <div className="news-loading">

              <h3>
                Search for financial news
              </h3>

              <p>
                Enter a stock ticker such
                as AAPL, MSFT, GOOGL, or
                TSLA to analyze its latest
                financial news.
              </p>

            </div>

          )}


        {/* NEWS RESULTS */}

        {!loading &&
          totalArticles > 0 && (

            <>

              {/* SENTIMENT ANALYSIS */}

              <section className="sentiment-section">


                {/* SENTIMENT SUMMARY */}

                <div className="sentiment-summary">


                  <div className="sentiment-summary-header">

                    <div>

                      <p className="summary-label">
                        Overall News Sentiment
                      </p>

                      <h2
                        className={
                          `overall-${overallSentiment.toLowerCase()}`
                        }
                      >
                        {overallSentiment}
                      </h2>

                    </div>


                    <div className="article-count">

                      {totalArticles}

                      <span>
                        Articles
                      </span>

                    </div>

                  </div>


                  {/* SENTIMENT COUNTS */}

                  <div className="sentiment-stats">


                    {/* POSITIVE */}

                    <div>

                      <span
                        className="
                          sentiment-dot
                          positive-dot
                        "
                      />

                      <p>
                        Positive
                      </p>

                      <strong>
                        {positiveCount}
                      </strong>

                    </div>


                    {/* NEUTRAL */}

                    <div>

                      <span
                        className="
                          sentiment-dot
                          neutral-dot
                        "
                      />

                      <p>
                        Neutral
                      </p>

                      <strong>
                        {neutralCount}
                      </strong>

                    </div>


                    {/* NEGATIVE */}

                    <div>

                      <span
                        className="
                          sentiment-dot
                          negative-dot
                        "
                      />

                      <p>
                        Negative
                      </p>

                      <strong>
                        {negativeCount}
                      </strong>

                    </div>


                  </div>

                </div>


                {/* SENTIMENT CHART */}

                <div className="sentiment-chart-card">

                  <div>

                    <h3>
                      Sentiment Distribution
                    </h3>

                    <p>
                      FinBERT classification
                    </p>

                  </div>


                  <SentimentChart
                    positive={
                      positiveCount
                    }
                    neutral={
                      neutralCount
                    }
                    negative={
                      negativeCount
                    }
                  />

                </div>


              </section>


              {/* NEWS TITLE */}

              <div className="news-results-heading">

                <h2>
                  Latest News for{" "}
                  {ticker}
                </h2>

                <span>
                  {totalArticles}{" "}
                  {totalArticles === 1
                    ? "article"
                    : "articles"}
                </span>

              </div>


              {/* NEWS CARDS */}

              <div className="news-grid">

                {articles.map(
                  (
                    article,
                    index
                  ) => (

                    <NewsCard
                      key={
                        `${article.article_url}-${index}`
                      }
                      article={
                        article
                      }
                    />

                  )
                )}

              </div>


            </>

          )}


      </main>

    </div>

  );
}


export default News;