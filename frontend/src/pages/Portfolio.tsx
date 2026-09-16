import {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/Sidebar";
import AddStockModal from "../components/AddStockModal";

import PortfolioTable, {
  type PortfolioItem,
} from "../components/PortfolioTable";

import {
  getPortfolio,
  deleteStock,
} from "../services/api";

function Portfolio() {
  const [portfolio, setPortfolio] =
    useState<PortfolioItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showAddStock, setShowAddStock] =
    useState(false);

  async function loadPortfolio() {
    try {
      const data = await getPortfolio();

      setPortfolio(data);
    } catch (error) {
      console.error(
        "Failed to load portfolio:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    const initialLoad = setTimeout(() => {

      void loadPortfolio();

    }, 0);


    return () => {

      clearTimeout(
        initialLoad
      );

    };

  }, []);

  async function handleDeleteStock(
    id: number
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this stock?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteStock(id);

      await loadPortfolio();
    } catch (error) {
      console.error(
        "Failed to delete stock:",
        error
      );
    }
  }

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

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">

        <div className="portfolio-page-header">
          <div>
            <h1>Portfolio</h1>

            <p>
              Manage and monitor your stock
              holdings
            </p>
          </div>

          <button
            className="add-button"
            onClick={() =>
              setShowAddStock(true)
            }
          >
            + Add New Stock
          </button>
        </div>

        {loading ? (
          <div className="loading">
            Loading portfolio...
          </div>
        ) : (
          <>
            <section className="portfolio-summary">

              <div className="portfolio-summary-card">
                <p>Total Investment</p>

                <h2>
                  $
                  {totalInvestment.toFixed(
                    2
                  )}
                </h2>
              </div>

              <div className="portfolio-summary-card">
                <p>Current Value</p>

                <h2>
                  ${totalValue.toFixed(2)}
                </h2>
              </div>

              <div className="portfolio-summary-card">
                <p>Total Profit / Loss</p>

                <h2
                  className={
                    totalProfit >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {totalProfit >= 0
                    ? "+"
                    : ""}
                  $
                  {totalProfit.toFixed(2)}
                </h2>
              </div>

              <div className="portfolio-summary-card">
                <p>Total Holdings</p>

                <h2>
                  {portfolio.length}
                </h2>
              </div>

            </section>

            {portfolio.length === 0 ? (
              <div className="empty-portfolio">
                <h2>
                  Your portfolio is empty
                </h2>

                <p>
                  Add your first stock to
                  start tracking your
                  portfolio.
                </p>

                <button
                  className="add-button"
                  onClick={() =>
                    setShowAddStock(true)
                  }
                >
                  + Add Stock
                </button>
              </div>
            ) : (
              <PortfolioTable
                portfolio={portfolio}
                onAddStock={() =>
                  setShowAddStock(true)
                }
                onDeleteStock={
                  handleDeleteStock
                }
              />
            )}
          </>
        )}

        {showAddStock && (
          <AddStockModal
            onClose={() =>
              setShowAddStock(false)
            }
            onStockAdded={
              loadPortfolio
            }
          />
        )}

      </main>
    </div>
  );
}

export default Portfolio;