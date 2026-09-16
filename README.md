# FinAI — AI-Powered Financial Intelligence Platform

FinAI is a financial intelligence web application that combines portfolio tracking, financial news analysis, and AI-powered sentiment analysis in a single dashboard.

The platform uses **FinBERT**, a financial-domain NLP model, to classify financial news as **Positive, Neutral, or Negative**, helping users understand the sentiment surrounding stocks in their portfolio.

> FinAI provides analytical information and does not predict stock prices or provide investment advice.

---

## Problem Statement

Investors often need to use multiple platforms to:

- Track their stock portfolio
- Monitor financial news
- Understand market sentiment
- Calculate portfolio profit and loss
- Analyze portfolio performance

Reading and interpreting large amounts of financial news manually is also time-consuming.

FinAI brings these capabilities together into one intelligent financial dashboard.

---

## Our Solution

FinAI integrates:

- Portfolio Management
- Market Data
- Financial News
- AI Sentiment Analysis
- Portfolio Analytics
- Automated News Monitoring

into a single web application.

The application continuously monitors stocks in the user's portfolio and periodically analyzes recent financial news using FinBERT.

---

## Key Features

### Financial Dashboard

Provides a consolidated view of:

- Total portfolio value
- Total investment
- Profit / Loss
- Portfolio return
- Number of holdings
- Automated AI sentiment insights

### Portfolio Management

Users can:

- Add stocks
- Specify quantity
- Enter purchase price
- View latest available market price
- Calculate current portfolio value
- Calculate profit or loss
- Calculate percentage return
- Remove holdings

### Financial News Analysis

Users can search for a stock ticker such as:

```text
AAPL
MSFT
TSLA
```

FinAI retrieves related financial news and displays:

- Article title
- Description
- Publisher
- Publication date
- Article link
- AI sentiment
- Confidence score

### FinBERT Sentiment Analysis

FinAI uses:

```text
ProsusAI/finbert
```

to classify financial text into:

```text
Positive
Neutral
Negative
```

FinBERT is designed for financial language, making it more suitable for financial sentiment analysis than a general-purpose sentiment model.

### Portfolio Analytics

The Analytics page provides visual representations of:

- Portfolio allocation
- Profit / loss by holding
- Portfolio value
- Total investment
- Overall return

Charts are implemented using Chart.js.

### Automated Monitoring

FinAI uses APScheduler to periodically monitor stocks stored in the user's portfolio.

The automation pipeline:

```text
Portfolio Stocks
       ↓
Scheduled Task
       ↓
Fetch Recent News
       ↓
FinBERT Analysis
       ↓
Sentiment Aggregation
       ↓
AI Insights
       ↓
Dashboard
```

This allows the dashboard to display automatically refreshed sentiment information without requiring users to manually analyze every stock.

---

# System Architecture

```text
                         FinAI
                          │
            ┌─────────────┴─────────────┐
            │                           │
         Frontend                    Backend
            │                           │
     React + TypeScript              FastAPI
            │                           │
            │              ┌────────────┼────────────┐
            │              │            │            │
            │          Portfolio     Market       Sentiment
            │           Service      Service       Service
            │              │            │            │
            │           SQLite      Market API    FinBERT
            │                           │
            │                    Financial Data
            │                    + Financial News
            │
            └────────── REST API ───────┘
```

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Chart.js
- react-chartjs-2
- Lucide React
- CSS

## Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- APScheduler

## AI / NLP

- Hugging Face Transformers
- ProsusAI/FinBERT

## External Data

- Massive API

## Development Tools

- Git
- GitHub
- VS Code
- Swagger / OpenAPI

---

# Project Structure

```text
finance-ai/
│
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   ├── database.py
│   │   │   └── models.py
│   │   │
│   │   ├── routes/
│   │   │   ├── stocks.py
│   │   │   ├── news.py
│   │   │   ├── portfolio.py
│   │   │   └── automation.py
│   │   │
│   │   ├── services/
│   │   │   ├── market_service.py
│   │   │   ├── sentiment_service.py
│   │   │   ├── portfolio_service.py
│   │   │   └── scheduler_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

# How FinAI Works

## 1. Portfolio Management

The user adds a stock with:

```text
Ticker
Quantity
Purchase Price
```

The information is stored in SQLite.

The backend retrieves market data and calculates:

```text
Investment = Quantity × Buy Price

Current Value = Quantity × Current Price

Profit/Loss = Current Value - Investment

Return % = (Profit/Loss / Investment) × 100
```

---

## 2. Financial News Retrieval

When the user searches for a ticker:

```text
AAPL
```

the React frontend sends a request to FastAPI.

```text
React
  ↓
GET /api/news/AAPL
  ↓
FastAPI
  ↓
Market/News API
```

The backend retrieves recent financial news related to the company.

---

## 3. AI Sentiment Analysis

The article title and description are passed to FinBERT.

```text
Financial Article
       ↓
Title + Description
       ↓
Tokenization
       ↓
FinBERT
       ↓
Positive / Neutral / Negative
       ↓
Confidence Score
```

The analyzed information is returned to the frontend.

---

## 4. Automated Analysis

APScheduler runs periodically in the backend.

```text
Scheduler
    ↓
Read portfolio stocks
    ↓
Fetch recent news
    ↓
Analyze with FinBERT
    ↓
Aggregate sentiment
    ↓
Update sentiment cache
    ↓
Dashboard displays insights
```

The frontend periodically checks for updated automated analysis.

---

# API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stocks/{ticker}` | Retrieve stock market data |
| GET | `/api/news/{ticker}` | Retrieve and analyze financial news |
| GET | `/api/portfolio/` | Retrieve portfolio |
| POST | `/api/portfolio/` | Add a portfolio holding |
| DELETE | `/api/portfolio/{stock_id}` | Delete a portfolio holding |
| GET | `/api/automation/` | Retrieve automated analysis |
| GET | `/api/automation/{ticker}` | Retrieve automated analysis for a ticker |

Interactive API documentation is available through FastAPI Swagger when the backend is running.

```text
http://127.0.0.1:8000/docs
```

---

# Running the Project

## Backend

Move into the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create:

```text
.env
```

using `.env.example` as the template and provide your own API key.

Start FastAPI:

```bash
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

## Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Security

Sensitive information such as API keys is stored using environment variables.

The real `.env` file is excluded from Git using `.gitignore`.

An `.env.example` file is provided to show the required environment variables without exposing credentials.

---

# Current MVP Limitations

FinAI is currently a hackathon MVP.

Some limitations include:

- Market prices depend on the data available through the configured API plan.
- The current free market-data endpoint may provide the latest available trading-period close rather than a real-time streaming price.
- Automated sentiment results are stored in memory and are reset when the backend restarts.
- Sentiment represents the tone of financial news and should not be interpreted as a prediction of future stock-price movement.
- The application currently focuses on a single local portfolio rather than multi-user authentication and accounts.

---

# Future Enhancements

Potential future improvements include:

- User authentication
- Multiple portfolios
- Persistent sentiment history
- Real-time market feeds
- Historical stock charts
- Advanced portfolio risk analytics
- News trend analysis
- Alerts and notifications
- Cloud deployment
- Database migration to PostgreSQL
- Personalized financial intelligence

---

# Disclaimer

FinAI is an educational and analytical project.

Sentiment classifications and portfolio analytics are provided for informational purposes only and should not be considered financial or investment advice.