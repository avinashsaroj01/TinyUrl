import React, { useState, useEffect, useCallback } from "react";
import StatCard from "../components/StatCard";
import { fetchHealthStatus } from "../features/links/linksApi"; // Import the new fetch function

const HealthCheckPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatUptime = (seconds) => {
    if (typeof seconds !== "number" || seconds < 0) return "N/A";

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    const sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";

    return dDisplay + hDisplay + mDisplay + sDisplay;
  };

  const fetchHealthData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
    
      const data = await fetchHealthStatus();
      setHealth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
    // Optional: Poll every 30 seconds for a "live" feel
    const intervalId = setInterval(fetchHealthData, 30000);
    return () => clearInterval(intervalId); // Cleanup interval
  }, [fetchHealthData]);

  if (loading && !health) {
    return (
      <div className="text-center py-20">
        <svg
          className="animate-spin h-8 w-8 text-indigo-500 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-gray-500">Checking system health...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-300 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-red-700">Health Check Failed</h2>
        <p className="mt-2 text-red-600">
          Could not connect to the system health endpoint: {error}
        </p>
        <button
          onClick={fetchHealthData}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const dbStatus = health?.database_status;
  const dbIcon =
    dbStatus === "connected" ? (
      <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-2"></span>
    ) : (
      <span className="inline-block h-3 w-3 rounded-full bg-red-500 mr-2"></span>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        System Health Monitor
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Server Status"
          value={health?.ok ? "Operational" : "Degraded"}
          description={
            health?.ok
              ? "All core services running."
              : "Check backend logs for details."
          }
        />
        <StatCard
          title="Database Connection"
          value={
            <>
              {dbIcon}
              {dbStatus}
            </>
          }
          description={
            dbStatus === "connected"
              ? "Ready for CRUD operations."
              : "Connection failed or lost."
          }
        />
        <StatCard
          title="Server Uptime"
          value={health?.uptime ? formatUptime(health.uptime) : "Loading..."}
          description="Time since the Node.js server last restarted."
        />
        <StatCard
          title="Version"
          value={health?.version || "N/A"}
          description={`Environment: ${health?.environment || "unknown"}`}
        />
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Raw Health Details (JSON)
        </h2>
        <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto text-gray-700">
          {JSON.stringify(health, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default HealthCheckPage;
