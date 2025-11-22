import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import HealthCheckPage from "./pages/HealthCheckPage";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard page - lists all links and allows creation/deletion */}
          <Route path="/" element={<Dashboard />} />

          {/* Stats page - shows details for a single link, required path: /code/:code */}
          <Route path="/code/:code" element={<StatsPage />} />
          <Route path="/healthz" element={<HealthCheckPage />} />

          {/* Simple 404 page for unmatched client-side routes */}
          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
                <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
