import {
  BrainCircuit,
  RefreshCw,
} from "lucide-react";

export interface AutomatedSentiment {
  ticker: string;
  updated_at: string;
  article_count: number;
  positive: number;
  neutral: number;
  negative: number;
}

interface AIInsightsProps {
  results: Record<
    string,
    AutomatedSentiment
  >;

  loading: boolean;

  onRefresh: () => void;
}

function AIInsights({
  results,
  loading,
  onRefresh,
}: AIInsightsProps) {

  const stocks = Object.values(results);

  function getOverallSentiment(
    stock: AutomatedSentiment
  ) {
    if (
      stock.positive > stock.neutral &&
      stock.positive > stock.negative
    ) {
      return "Positive";
    }

    if (
      stock.negative > stock.positive &&
      stock.negative > stock.neutral
    ) {
      return "Negative";
    }

    return "Neutral";
  }

  function formatUpdatedTime(
    date: string
  ) {
    if (!date) {
      return "Waiting for update";
    }

    return new Date(
      date
    ).toLocaleString();
  }

  return (
    <section className="ai-insights-card">

      <div className="ai-insights-header">

        <div className="ai-title">

          <div className="ai-icon">
            <BrainCircuit size={21} />
          </div>

          <div>
            <h2>
              AI Market Insights
            </h2>

            <p>
              Automated FinBERT sentiment
              analysis for your portfolio
            </p>
          </div>

        </div>

        <div className="automation-actions">

          <div className="auto-status">
            <span className="status-dot" />
            Automated Monitoring Active
            </div>

          <button
            className="refresh-button"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh insights"
          >
            <RefreshCw
                size={17}
                className={
                    loading
                    ? "spinning"
                    : ""
                }
                />

                {loading
                ? "Checking..."
                : "Refresh"}
          </button>

        </div>

      </div>

      {loading && stocks.length === 0 ? (

        <div className="insights-empty">
          Loading AI insights...
        </div>

      ) : stocks.length === 0 ? (

        <div className="insights-empty">

          <BrainCircuit size={30} />

          <h3>
            Waiting for automated analysis
          </h3>

          <p>
            FinAI will automatically analyze
            financial news for your portfolio
            stocks during the next scheduled
            update.
          </p>

        </div>

      ) : (

        <div className="insights-grid">

          {stocks.map((stock) => {

            const sentiment =
              getOverallSentiment(stock);

            return (
              <div
                className="insight-stock-card"
                key={stock.ticker}
              >

                <div className="insight-stock-top">

                  <div className="insight-ticker">

                    <div className="stock-icon">
                      {stock.ticker.charAt(0)}
                    </div>

                    <div>
                      <strong>
                        {stock.ticker}
                      </strong>

                      <span>
                        {stock.article_count}{" "}
                        articles analyzed
                      </span>
                    </div>

                  </div>

                  <span
                    className={`sentiment-badge ${sentiment.toLowerCase()}`}
                  >
                    {sentiment}
                  </span>

                </div>

                <div className="insight-counts">

                  <div>
                    <span className="positive-number">
                      {stock.positive}
                    </span>

                    <small>
                      Positive
                    </small>
                  </div>

                  <div>
                    <span className="neutral-number">
                      {stock.neutral}
                    </span>

                    <small>
                      Neutral
                    </small>
                  </div>

                  <div>
                    <span className="negative-number">
                      {stock.negative}
                    </span>

                    <small>
                      Negative
                    </small>
                  </div>

                </div>

                <div className="insight-updated">
                  Last updated:{" "}
                  {formatUpdatedTime(
                    stock.updated_at
                  )}
                </div>

              </div>
            );
          })}

        </div>

      )}

    </section>
  );
}

export default AIInsights;