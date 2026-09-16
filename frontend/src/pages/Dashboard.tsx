import {
  useEffect,
  useState,
} from "react";

import AddStockModal from "../components/AddStockModal";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import AIInsights, {
  type AutomatedSentiment,
} from "../components/AIInsights";

import PortfolioTable, {
  type PortfolioItem,
} from "../components/PortfolioTable";

import {
  getPortfolio,
  deleteStock,
  getAutomationStatus,
} from "../services/api";

function Dashboard() {

  const [portfolio, setPortfolio] =
    useState<PortfolioItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showAddStock, setShowAddStock] =
    useState(false);

  const [
    automationResults,
    setAutomationResults,
  ] = useState<
    Record<string, AutomatedSentiment>
  >({});

  const [
    automationLoading,
    setAutomationLoading,
  ] = useState(true);


  async function loadPortfolio() {

    try {

      const data =
        await getPortfolio();

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


  async function loadAutomation() {

    try {

      setAutomationLoading(true);

      const data =
        await getAutomationStatus();

      setAutomationResults(
        data.results || {}
      );

    } catch (error) {

      console.error(
        "Failed to load automation:",
        error
      );

    } finally {

      setAutomationLoading(false);

    }
  }


  useEffect(() => {

    const initialLoad = setTimeout(() => {
      void loadPortfolio();
      void loadAutomation();
    }, 0);


    const automationInterval =
      setInterval(() => {

        void loadAutomation();

      }, 30000);


    return () => {

      clearTimeout(initialLoad);

      clearInterval(
        automationInterval
      );

    };

  }, []);


  async function handleDeleteStock(
    id: number
  ) {

    const confirmed =
      window.confirm(
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


  const totalReturn =
    totalInvestment > 0
      ? (
          totalProfit /
          totalInvestment
        ) * 100
      : 0;


  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Header />
        <section className="dashboard-hero">
          <div className="dashboard-hero-content">
            <div>
              <span className="hero-badge">
                FINAI INTELLIGENCE
              </span>

              <h2>
                Smarter financial decisions,
                powered by AI.
              </h2>

              <p>
                Track your portfolio, analyze
                financial news, and understand
                market sentiment from one
                intelligent dashboard.
              </p>
            </div>

            <div className="hero-ai-status">
              <div className="hero-status-icon">
                AI
              </div>

              <div>
                <span>
                  AI Engine
                </span>

                <strong>
                  FinBERT Active
                </strong>
              </div>
            </div>
          </div>
        </section>

        {loading ? (

          <div className="loading">
            Loading portfolio...
          </div>

        ) : (

          <>

            <section className="stats-grid">

              <StatCard
                title="Portfolio Value"
                value={`$${totalValue.toFixed(
                  2
                )}`}
                subtitle="Current market value"
              />

              <StatCard
                title="Total Investment"
                value={`$${totalInvestment.toFixed(
                  2
                )}`}
                subtitle="Amount invested"
              />

              <StatCard
                title="Total Profit / Loss"
                value={`${
                  totalProfit >= 0
                    ? "+"
                    : ""
                }$${totalProfit.toFixed(
                  2
                )}`}
                subtitle={`${totalReturn.toFixed(
                  2
                )}% return`}
                positive={
                  totalProfit >= 0
                }
              />

              <StatCard
                title="Holdings"
                value={
                  portfolio.length.toString()
                }
                subtitle="Stocks in portfolio"
              />

            </section>


            <AIInsights
              results={
                automationResults
              }
              loading={
                automationLoading
              }
              onRefresh={
                loadAutomation
              }
            />


            <PortfolioTable
              portfolio={portfolio}
              onAddStock={() =>
                setShowAddStock(true)
              }
              onDeleteStock={
                handleDeleteStock
              }
            />

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

export default Dashboard;