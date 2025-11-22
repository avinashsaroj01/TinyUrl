import React from "react";
import LinkForm from "../components/LinkForm";
import LinkTable from "../components/LinkTable";

const Dashboard = () => {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">TinyLink Dashboard</h1>

      {/* Add New Link Section */}
      <LinkForm />

      {/* List of Links Table */}
      <LinkTable />
    </div>
  );
};

export default Dashboard;
