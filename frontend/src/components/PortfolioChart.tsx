import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Doughnut,
} from "react-chartjs-2";

import type {
  PortfolioItem,
} from "./PortfolioTable";


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);


interface PortfolioChartProps {
  portfolio: PortfolioItem[];
}


function PortfolioChart({
  portfolio,
}: PortfolioChartProps) {

  const data = {

    labels: portfolio.map(
      (stock) => stock.ticker
    ),

    datasets: [
      {
        label: "Portfolio Value",

        data: portfolio.map(
          (stock) =>
            stock.current_value
        ),

        backgroundColor: [
          "#8DD82C",
          "#B8E986",
          "#5F9E2E",
          "#DDF5B8",
          "#A8B5A2",
          "#6F8068",
        ],

        borderWidth: 0,
      },
    ],
  };


  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: "bottom" as const,
      },

    },

    cutout: "68%",

  };


  return (
    <div className="portfolio-chart">

      <Doughnut
        data={data}
        options={options}
      />

    </div>
  );
}


export default PortfolioChart;