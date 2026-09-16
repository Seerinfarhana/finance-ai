import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface SentimentChartProps {
  positive: number;
  neutral: number;
  negative: number;
}

function SentimentChart({
  positive,
  neutral,
  negative,
}: SentimentChartProps) {
  const data = {
    labels: [
      "Positive",
      "Neutral",
      "Negative",
    ],

    datasets: [
      {
        data: [
          positive,
          neutral,
          negative,
        ],

        backgroundColor: [
          "#8DD82C",
          "#B8BDB8",
          "#E05A5A",
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
    <div className="sentiment-chart">
      <Doughnut
        data={data}
        options={options}
      />
    </div>
  );
}

export default SentimentChart;