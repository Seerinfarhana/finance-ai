import { ExternalLink } from "lucide-react";

export interface NewsArticle {
  title: string;
  description: string;
  publisher: string;
  published_utc: string;
  article_url: string;
  sentiment: string;
  confidence: number;
}

interface NewsCardProps {
  article: NewsArticle;
}

function NewsCard({ article }: NewsCardProps) {
  const sentiment =
    article.sentiment.toLowerCase();

  return (
    <div className="news-card">
      <div className="news-top">
        <span
          className={`sentiment-badge ${sentiment}`}
        >
          {article.sentiment}
        </span>

        <span className="confidence">
          {(article.confidence * 100).toFixed(1)}%
          confidence
        </span>
      </div>

      <h3>{article.title}</h3>

      <p className="news-description">
        {article.description ||
          "No description available."}
      </p>

      <div className="news-footer">
        <div>
          <strong>{article.publisher}</strong>

          <span>
            {article.published_utc
              ? new Date(
                  article.published_utc
                ).toLocaleDateString()
              : ""}
          </span>
        </div>

        {article.article_url && (
          <a
            href={article.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more"
          >
            Read article
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  );
}

export default NewsCard;