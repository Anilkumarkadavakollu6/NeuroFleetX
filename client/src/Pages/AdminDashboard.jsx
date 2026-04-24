import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../Components/AdminLayout";
import {
  Activity, BrainCircuitIcon, CloudLightning, Route, Wrench,
} from "lucide-react";
import { FiTruck } from "react-icons/fi";
import FleetHeatmap from "../Components/FleetHeatMap";
import KpiCards from "../Components/KPICards";
import HourlyChart from "../Components/HourlyChart";
import Loading from "../Components/Loading";
import api from "../utils/api";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFleet: 0,
    activeVehicles: 0,
    electrification: 0,
    needsService: 0,
  });
  const [vehicles, setVehicles] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiStats, setAiStats] = useState({
    status: "Offline",
    optimizedCount: 0,
    confidence: 0,
  });

  // ── Fetch KPI ──────────────────────────────────────────────
  const fetchKPI = useCallback(async () => {
    try {
      const response = await api.get("/admin/dashboard/kpi");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load KPI:", error);
      toast.error("Could not load dashboard KPIs.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch Vehicles ─────────────────────────────────────────
  const fetchVehicles = useCallback(async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to load vehicles:", error);
      toast.error("Could not load fleet data.");
      return [];
    }
  }, []);

  useEffect(() => {
    fetchKPI();
    fetchVehicles();
  }, [fetchKPI, fetchVehicles]);

  // ── Neural Routing ─────────────────────────────────────────
  const runNeuralRouting = async () => {
    setIsOptimizing(true);
    try {
      const fleetData = await fetchVehicles();

      const response = await fetch(
        `${import.meta.env.VITE_AI_URL || "http://127.0.0.1:5000"}/api/ai/optimize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicles: fleetData }),
        }
      );

      if (!response.ok) throw new Error("AI Engine unreachable");

      const data = await response.json();
      setAiStats({
        status: "Online",
        optimizedCount: data.activeRoutesOptimized ?? 0,
        confidence: data.aiConfidenceScore ?? 0,
      });
      toast.success(`Neural Routing Complete! Saved ${data.co2SavedKg}kg CO₂.`);
    } catch (error) {
      console.error(error);
      toast.error("Neural Engine is offline. Please start the Python server.");
      setAiStats({ status: "Offline", optimizedCount: 0, confidence: 0 });
    } finally {
      setIsOptimizing(false);
    }
  };

  // ── Export CSV ─────────────────────────────────────────────
  const exportCSV = () => {
    if (vehicles.length === 0) {
      toast.warning("No vehicle data to export.");
      return;
    }
    const headers = [
      "ID", "Name", "License Plate", "Type", "Status",
      "Location", "Battery", "Fuel", "Speed", "Engine Health",
      "Mileage", "Rate/km", "Rating",
    ];
    const rows = vehicles.map((v) => [
      v.id, v.name, v.licensePlate, v.type, v.status,
      v.currentLocation, v.batteryLevel ?? "N/A", v.fuelLevel ?? "N/A",
      v.speed ?? "N/A", v.engineHealth ?? "N/A", v.mileage ?? "N/A",
      v.ratekm ?? "N/A", v.rating ?? "N/A",
    ]);
    const csvContent =
      [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neurofleetx_fleet_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully.");
  };

  // ── Export PDF (print-based) ───────────────────────────────
  const exportPDF = () => {
    if (vehicles.length === 0) {
      toast.warning("No vehicle data to export.");
      return;
    }
    const rows = vehicles
      .map(
        (v) => `
        <tr>
          <td>${v.id}</td><td>${v.name}</td><td>${v.licensePlate}</td>
          <td>${v.type}</td><td>${v.status}</td><td>${v.currentLocation}</td>
          <td>${v.batteryLevel ?? "N/A"}</td><td>${v.fuelLevel ?? "N/A"}</td>
          <td>${v.engineHealth ?? "N/A"}%</td><td>${v.mileage ?? "N/A"}</td>
        </tr>`
      )
      .join("");

    const html = `
      <html><head><title>NeuroFleetX Fleet Report</title>
      <style>
        body { font-family: sans-serif; padding: 24px; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        p { color: #666; font-size: 12px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #111; color: #fff; padding: 8px; text-align: left; }
        td { padding: 7px 8px; border-bottom: 1px solid #eee; }
        tr:nth-child(even) td { background: #f9f9f9; }
      </style></head>
      <body>
        <h1>NeuroFleetX — Fleet Report</h1>
        <p>Generated: ${new Date().toLocaleString()} &nbsp;|&nbsp; Total Vehicles: ${vehicles.length}</p>
        <table>
          <thead><tr>
            <th>ID</th><th>Name</th><th>Plate</th><th>Type</th><th>Status</th>
            <th>Location</th><th>Battery</th><th>Fuel</th><th>Health</th><th>Mileage</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body></html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
    toast.success("PDF ready to print/save.");
  };

  // ── KPI config ─────────────────────────────────────────────
  const activePercent =
    stats.totalFleet > 0 ? (stats.activeVehicles / stats.totalFleet) * 100 : 0;
  const servicePercent =
    stats.totalFleet > 0 ? (stats.needsService / stats.totalFleet) * 100 : 0;

  const kpiData = [
    {
      title: "Total Fleet", value: stats.totalFleet.toString(),
      trend: "Synced", trendDirection: "up",
      icon: <FiTruck size={24} />, color: "blue", progress: 100,
    },
    {
      title: "Active on Road", value: stats.activeVehicles.toString(),
      trend: "Live", trendDirection: "up",
      icon: <Activity size={24} />, color: "green", progress: activePercent,
    },
    {
      title: "Electrification", value: `${stats.electrification}%`,
      trend: "EV Ratio", trendDirection: "up",
      icon: <CloudLightning size={24} />, color: "purple",
      progress: stats.electrification,
    },
    {
      title: "Maintenance", value: stats.needsService.toString(),
      trend: "Service queue", trendDirection: "down",
      icon: <Wrench size={24} />, color: "red", progress: servicePercent,
    },
    {
      title: "AI Routes",
      value: isOptimizing ? "..." : aiStats.optimizedCount.toString(),
      trend: aiStats.status === "Offline" ? "Offline" : `${aiStats.confidence}% Confidence`,
      trendDirection: aiStats.status === "Offline" ? "down" : "up",
      icon: <Route size={24} className={isOptimizing ? "animate-spin" : ""} />,
      color: aiStats.status === "Offline" ? "zinc" : "indigo",
      progress: aiStats.status === "Offline" ? 0 : aiStats.confidence,
    },
  ];

  if (loading) return <Loading />;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Urban Mobility Insights
          </h1>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2 text-sm font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={exportPDF}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* ── Neural Engine Button ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-6">
          <button
            onClick={runNeuralRouting}
            disabled={isOptimizing}
            className="group relative flex items-center gap-3 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <BrainCircuitIcon
              size={16}
              className={
                isOptimizing
                  ? "animate-pulse text-rose-500"
                  : "group-hover:text-indigo-500 transition-colors"
              }
            />
            {isOptimizing ? "Calculating..." : "Run Neural Engine"}
          </button>

          {/* AI status badge */}
          {aiStats.status === "Online" && (
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-full">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                AI Online — {aiStats.confidence}% Confidence
              </span>
            </div>
          )}
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {kpiData.map((kpi, index) => (
            <KpiCards
              key={index}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend}
              trendDirection={kpi.trendDirection}
              color={kpi.color}
              progress={kpi.progress}
              onClick={() => toast.info(`${kpi.title}: ${kpi.value}`)}
            />
          ))}
        </div>

        {/* ── Heatmap + Hourly Chart ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-125">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
              Vehicle Heatmap
            </h2>
            <div className="flex-1 rounded-lg overflow-hidden relative border border-zinc-100 dark:border-zinc-800">
              <FleetHeatmap vehicles={vehicles} />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
              Hourly Activity
            </h2>
            <div className="flex-1 relative">
              <HourlyChart />
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;