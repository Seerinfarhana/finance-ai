import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import type { PortfolioItem } from "./PortfolioTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

interface ProfitLossChartProps {
  portfolio: PortfolioItem[];
}

function ProfitLossChart({
  portfolio,
}: ProfitLossChartProps) {

  const data = {
    labels: portfolio.map(
      (stock) => stock.ticker
    ),

    datasets: [
      {
        label: "Profit / Loss ($)",

        data: portfolio.map(
          (stock) => stock.profit_loss
        ),

        backgroundColor: portfolio.map(
          (stock) =>
            stock.profit_loss >= 0
              ? "#8DD82C"
              : "#E05A5A"
        ),

        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="profit-chart">
      <Bar
        data={data}
        options={options}
      />
    </div>
  );
}

export default ProfitLossChart;