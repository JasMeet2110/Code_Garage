"use client";
import React from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminFooter from "@/components/AdminFooter";

const ReportsAnalyticsPage = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-900 text-white p-8 pt-[180px]">
        <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">
          Reports & Analytics
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Customers</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">—</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Appointments</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">—</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Revenue</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">—</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Employees</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">—</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg h-64 flex items-center justify-center">
            <span className="text-gray-500">[Appointments Trend Chart]</span>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg h-64 flex items-center justify-center">
            <span className="text-gray-500">[Revenue Trend Chart]</span>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Top Services
            </h2>
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Service</th>
                  <th className="px-4 py-2 text-left">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-gray-400">—</td>
                  <td className="px-4 py-2 text-gray-400">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Recent Activity
            </h2>
            <ul className="space-y-2">
              <li className="text-gray-400">—</li>
              <li className="text-gray-400">—</li>
              <li className="text-gray-400">—</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <AdminFooter />
  </div>
  );
};

export default ReportsAnalyticsPage;
