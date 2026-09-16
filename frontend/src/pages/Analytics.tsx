import {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import PortfolioChart from "../components/PortfolioChart";
import ProfitLossChart from "../components/ProfitLossChart";

import type {
  PortfolioItem,
} from "../components/PortfolioTable";

import {
  getPortfolio,
} from "../services/api";


function Analytics() {

  const [portfolio, setPortfolio] =
    useState<PortfolioItem[]>([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    async function loadPortfolio() {

      try {

        const data =
          await getPortfolio();

        setPortfolio(data);

      } catch (error) {

        console.error(
          "Failed to load analytics:",
          error
        );

      } finally {

        setLoading(false);

      }
    }

    loadPortfolio();

  }, []);


  const totalInvestment =
    portfolio.reduce(
      (total, stock) =>
        total + stock.investment,
      0
    );


  const totalValue =
    portfolio.reduce(
      (total, stock) =>
        total + stock.current_value,
      0
    );


  const totalProfit =
    totalValue - totalInvestment;


  const totalReturn =
    totalInvestment > 0
      ? (
          totalProfit /
          totalInvestment
        ) * 100
      : 0;


  const bestStock =
    portfolio.length > 0
      ? portfolio.reduce(
          (best, stock) =>
            stock.percentage >
            best.percentage
              ? stock
              : best
        )
      : null;


  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <div className="analytics-header">

          <h1>
            Portfolio Analytics
          </h1>

          <p>
            Understand your portfolio
            performance and allocation
          </p>

        </div>


        {loading ? (

          <div className="loading">
            Loading analytics...
          </div>

        ) : portfolio.length === 0 ? (

          <div className="empty-analytics">

            <h2>
              No portfolio data yet
            </h2>

            <p>
              Add stocks from your dashboard
              to view analytics.
            </p>

          </div>

        ) : (

          <>

            <section className="stats-grid">

              <StatCard
                title="Portfolio Value"
                value={`$${totalValue.toFixed(
                  2
                )}`}
                subtitle="Current value"
              />

              <StatCard
                title="Total Investment"
                value={`$${totalInvestment.toFixed(
                  2
                )}`}
                subtitle="Amount invested"
              />

              <StatCard
                title="Profit / Loss"
                value={`${
                  totalProfit >= 0
                    ? "+"
                    : ""
                }$${totalProfit.toFixed(2)}`}
                subtitle={`${totalReturn.toFixed(
                  2
                )}% return`}
                positive={
                  totalProfit >= 0
                }
              />

              <StatCard
                title="Best Performer"
                value={
                  bestStock
                    ? bestStock.ticker
                    : "-"
                }
                subtitle={
                  bestStock
                    ? `${bestStock.percentage.toFixed(
                        2
                      )}% return`
                    : ""
                }
                positive={
                  bestStock
                    ? bestStock.percentage >= 0
                    : undefined
                }
              />

            </section>


            <section className="analytics-grid">

              <div className="analytics-card">

                <div className="analytics-card-header">

                  <h2>
                    Portfolio Allocation
                  </h2>

                  <p>
                    Distribution by current
                    market value
                  </p>

                </div>

                <PortfolioChart
                  portfolio={portfolio}
                />

              </div>


              <div className="analytics-card">

                <div className="analytics-card-header">

                  <h2>
                    Profit / Loss
                  </h2>

                  <p>
                    Performance of each
                    holding
                  </p>

                </div>

                <ProfitLossChart
                  portfolio={portfolio}
                />

              </div>

            </section>

          </>

        )}

      </main>

    </div>
  );
}

export default Analytics;