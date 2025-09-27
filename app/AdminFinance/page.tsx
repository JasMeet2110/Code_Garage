"use client";
import React from "react";
import AdminSidebar from "@/components/AdminSidebar";


const FinancePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Left admin sidebar */}
      <AdminSidebar />

      {/* Right content area */}
      <div className="flex-1 min-w-0 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-500 mb-8">
            Finance Overview
          </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Revenue</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">—</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Expenses</h3>
            <p className="text-3xl font-bold text-red-400 mt-2">—</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Profit</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">—</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Outstanding</h3>
            <p className="text-3xl font-bold text-yellow-400 mt-2">—</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg h-64 flex items-center justify-center">
            <span className="text-gray-500">[Monthly Revenue Chart]</span>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg h-64 flex items-center justify-center">
            <span className="text-gray-500">[Expense Breakdown Chart]</span>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Transactions */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Recent Transactions
            </h2>
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-gray-400">—</td>
                  <td className="px-4 py-2 text-gray-400">—</td>
                  <td className="px-4 py-2 text-gray-400">—</td>
                  <td className="px-4 py-2 text-green-400">Completed</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pending Invoices */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Pending Invoices
            </h2>
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Invoice #</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-gray-400">—</td>
                  <td className="px-4 py-2 text-gray-400">—</td>
                  <td className="px-4 py-2 text-gray-400">—</td>
                  <td className="px-4 py-2 text-yellow-400">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
  </div>
  );
};

export default FinancePage;
