import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const HourlyChart = () => {
  const labels = [
    "6 AM",
    "8 AM",
    "10 AM",
    "12 PM",
    "2 PM",
    "4 PM",
    "6 PM",
    "8 PM",
    "10 PM",
  ];
  const dataValues = [120, 450, 380, 300, 280, 520, 610, 340, 150];

  const data = {
    labels,
    datasets: [
      {
        label: "Active Rentals",
        data: dataValues,
        borderColor: "#00d2ff",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );

          return gradient;
        },

        pointRadius: 0,
        pointHitRadius: 20,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#00d2ff",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 3,
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
      tooltip: {
        backgroundColor: "#18181b",
        titleColor: "#a1a1aa",
        bodyColor: "#ffffff",
        titleFont: { size: 13, weight: "normal" },
        bodyFont: { size: 16, weight: "bold" },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        intersect: true,
        mode: "index",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(161, 161, 170, 0.1)", // Extremely subtle horizontal grid lines
          drawBorder: false,
        },
        ticks: {
          color: "#71717a", // zinc-500
          font: { size: 12 },
          maxTicksLimit: 6, // Keeps the y-axis uncluttered
        },
      },
      x: {
        grid: {
          display: false, // Removes vertical lines completely
          drawBorder: false,
        },
        ticks: {
          color: "#71717a",
          font: { size: 12 },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <div className="absolute inset-0 w-full h-full pb-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default HourlyChart;
