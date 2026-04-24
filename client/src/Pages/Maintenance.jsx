import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import AdminLayout from "../Components/AdminLayout";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const Maintenance = () => {
  const pieData = {
    labels: ["Healthy", "Due Soon", "Critical"],
    datasets: [
      {
        data: [75, 15, 10],
        backgroundColor: ["#10b981", "#f59e0b", "#f43f5e"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Average Fleet Wear (%)",
        data: [12, 18, 24, 35, 42, 58],
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHitRadius: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  const activeAlerts = [
    {
      id: "V-1044",
      type: "EV",
      issue: "Battery Degradation High",
      status: "Critical",
      action: "Schedule Replacement",
    },
    {
      id: "V-2013",
      type: "ICE",
      issue: "Brake Pads Worn",
      status: "Critical",
      action: "Immediate Service",
    },
    {
      id: "V-1046",
      type: "EV",
      issue: "Tire Pressure Low",
      status: "Due",
      action: "Inflate Tires",
    },
    {
      id: "V-2011",
      type: "ICE",
      issue: "Oil Change Overdue",
      status: "Due",
      action: "Change Oil",
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Health & Maintenance
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Monitor fleet diagnostics and upcoming service requirements.
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors">
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[300px]">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col items-center justify-center relative">
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 absolute top-5 left-5">
              Fleet Status
            </h2>
            <div className="h-48 w-48 mt-4">
              <Doughnut
                data={pieData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  cutout: "75%",
                }}
              />
            </div>

            <div className="flex gap-4 mt-4 text-xs font-medium text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                Healthy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Due
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>{" "}
                Critical
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Average Fleet Wear
              </h2>
              <span className="text-xs font-medium text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md">
                +16% this month
              </span>
            </div>
            <div className="flex-1 relative">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/50">
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              Actionable Alerts
            </h2>
            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {activeAlerts.length} Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Vehicle ID</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Detected Issue</th>
                  <th className="px-6 py-3 font-medium">Severity</th>
                  <th className="px-6 py-3 font-medium">Action Needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                {activeAlerts.map((alert, index) => (
                  <tr
                    key={index}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold">{alert.id}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                        {alert.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{alert.issue}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                          alert.status === "Critical"
                            ? "bg-rose-500/10 text-rose-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline">
                        {alert.action} →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Maintenance;
