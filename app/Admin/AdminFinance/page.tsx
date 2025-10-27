"use client";
import React, { useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#eab308", "#3b82f6", "#a855f7"];

const FinancePage = () => {
  const [summary, setSummary] = useState({
    revenue: 24500,
    expenses: 17800,
    profit: 6700,
    outstanding: 3200,
  });

  const [revenueTrend, setRevenueTrend] = useState([
    { month: "Jan", revenue: 1800 },
    { month: "Feb", revenue: 2200 },
    { month: "Mar", revenue: 2700 },
    { month: "Apr", revenue: 3100 },
    { month: "May", revenue: 3500 },
    { month: "Jun", revenue: 3800 },
    { month: "Jul", revenue: 4100 },
    { month: "Aug", revenue: 4400 },
    { month: "Sep", revenue: 4700 },
    { month: "Oct", revenue: 5000 },
  ]);

  const [expenseBreakdown, setExpenseBreakdown] = useState([
    { category: "Parts", value: 6500 },
    { category: "Salaries", value: 8200 },
    { category: "Utilities", value: 2000 },
    { category: "Supplies", value: 1500 },
    { category: "Misc", value: 1600 },
  ]);

  const [transactions, setTransactions] = useState([
    { date: "Oct 19", type: "Revenue", amount: 850, status: "Completed" },
    { date: "Oct 18", type: "Expense", amount: 320, status: "Completed" },
    { date: "Oct 17", type: "Revenue", amount: 1240, status: "Completed" },
    { date: "Oct 15", type: "Expense", amount: 210, status: "Pending" },
  ]);

  const [invoices, setInvoices] = useState([
    { id: "#INV-1024", customer: "Emma Wilson", amount: 420, status: "Pending" },
    { id: "#INV-1025", customer: "David Miller", amount: 580, status: "Pending" },
    { id: "#INV-1026", customer: "Raj Singh", amount: 360, status: "Overdue" },
  ]);

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/Admin.png"
          alt="Garage Background"
          fill
          priority
          className="object-cover brightness-[0.45] blur-sm"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <AdminSidebar />

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10 relative z-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold text-orange-400 mb-8 drop-shadow-md">
            Finance Overview
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="glass-card">
              <h3 className="text-lg font-semibold">Revenue</h3>
              <p className="text-3xl font-bold text-green-400 mt-2">
                ${summary.revenue.toLocaleString()}
              </p>
            </div>
            <div className="glass-card">
              <h3 className="text-lg font-semibold">Expenses</h3>
              <p className="text-3xl font-bold text-red-400 mt-2">
                ${summary.expenses.toLocaleString()}
              </p>
            </div>
            <div className="glass-card">
              <h3 className="text-lg font-semibold">Profit</h3>
              <p className="text-3xl font-bold text-orange-400 mt-2">
                ${summary.profit.toLocaleString()}
              </p>
            </div>
            <div className="glass-card">
              <h3 className="text-lg font-semibold">Outstanding</h3>
              <p className="text-3xl font-bold text-yellow-400 mt-2">
                ${summary.outstanding.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <div className="glass-card h-80">
              <h2 className="text-xl font-bold text-orange-400 mb-4">
                Monthly Revenue Trend
              </h2>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown */}
            <div className="glass-card h-80">
              <h2 className="text-xl font-bold text-orange-400 mb-4">
                Expense Breakdown
              </h2>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    dataKey="value"
                    nameKey="category"
                    outerRadius={100}
                    label
                  >
                    {expenseBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-2 gap-6 mt-24">
            {/* Transactions */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Recent Transactions
              </h2>
              <table className="min-w-full text-sm text-gray-300">
                <thead>
                  <tr className="text-orange-400 border-b border-white/10">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-4 py-2">{t.date}</td>
                      <td className="px-4 py-2 text-gray-300">{t.type}</td>
                      <td className="px-4 py-2">${t.amount}</td>
                      <td
                        className={`px-4 py-2 ${
                          t.status === "Completed"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {t.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pending Invoices */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Pending Invoices
              </h2>
              <table className="min-w-full text-sm text-gray-300">
                <thead>
                  <tr className="text-orange-400 border-b border-white/10">
                    <th className="px-4 py-2 text-left">Invoice #</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, i) => (
                    <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-4 py-2">{inv.id}</td>
                      <td className="px-4 py-2 text-gray-300">{inv.customer}</td>
                      <td className="px-4 py-2">${inv.amount}</td>
                      <td
                        className={`px-4 py-2 ${
                          inv.status === "Pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {inv.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Styles */}
      <style jsx>{`
        .glass-card {
          @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-md;
        }
      `}</style>
    </div>
  );
};

export default FinancePage;
