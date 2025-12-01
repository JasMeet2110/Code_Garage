"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Summary = {
  revenue: number;
  expenses: number;
  profit: number;
  outstanding: number;
};

type Transaction = {
  id: number;
  date: string;
  type: string;
  amount: number;
  status: string;
};

type Invoice = {
  id: number;
  customer: string;
  service: string;
  amount: number;
  status: string;
  date: string;
};

const FinancePage = () => {
  const [summary, setSummary] = useState<Summary>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    outstanding: 0,
  });

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const [revenueTrend, setRevenueTrend] = useState<
    { month: string; revenue: number }[]
  >([]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinance();
  }, [selectedMonth, selectedYear]);

  const loadFinance = async () => {
    try {
      let queryParam = "";
      if (selectedMonth) {
        const [year, month] = selectedMonth.split("-");
        queryParam = `?year=${year}&month=${month}`;
      } else if (selectedYear) {
        queryParam = `?year=${selectedYear}`;
      }

      const res = await fetch(`/api/finance${queryParam}`, { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to fetch /api/finance");
        return;
      }

      const data = await res.json();

      if (data.summary) setSummary(data.summary);
      if (data.revenueTrend) setRevenueTrend(data.revenueTrend);
      if (data.recentTransactions) setTransactions(data.recentTransactions);
      if (data.pendingInvoices) setInvoices(data.pendingInvoices);
    } catch (err) {
      console.error("Error loading finance:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };

  const formatMoney = (n: number) =>
    `$${Number(n || 0).toLocaleString("en-CA", { maximumFractionDigits: 0 })}`;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white text-xl">
        Loading Finance Overview...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/admin.png"
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

          {/* Title + Filters */}
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <h1 className="text-4xl font-bold text-orange-400 drop-shadow-md">
              Finance Overview
            </h1>

            <div className="flex items-center gap-4">
              {/* MONTH */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">Filter by Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setSelectedYear("");
                  }}
                  className="bg-black/40 text-white border border-white/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* YEAR */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">Filter by Year</label>
                <input
                  placeholder="2025"
                  min="2000"
                  max="2099"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMonth("");
                  }}
                  className="bg-black/40 text-white border border-white/20 rounded-lg px-4 py-2 w-28 focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* CLEAR */}
              <button
                onClick={clearFilters}
                className="bg-gray-600 hover:bg-gray-500 px-5 py-2 mt-6 rounded-lg text-sm font-semibold"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="glass-card">
              <h3 className="text-lg font-semibold">Revenue</h3>
              <p className="text-3xl font-bold text-green-400 mt-2">
                {formatMoney(summary.revenue)}
              </p>
            </div>

            <div className="glass-card">
              <h3 className="text-lg font-semibold">Expenses</h3>
              <p className="text-3xl font-bold text-red-400 mt-2">
                {formatMoney(summary.expenses)}
              </p>
            </div>

            <div className="glass-card">
              <h3 className="text-lg font-semibold">Profit</h3>
              <p className="text-3xl font-bold text-orange-400 mt-2">
                {formatMoney(summary.profit)}
              </p>
            </div>

            <div className="glass-card">
              <h3 className="text-lg font-semibold">Outstanding</h3>
              <p className="text-3xl font-bold text-yellow-400 mt-2">
                {formatMoney(summary.outstanding)}
              </p>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="glass-card h-80 mb-8">
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

          {/* Tables */}
          <div className="grid grid-cols-2 gap-6 mt-24">

            {/* Recent Transactions */}
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
                  {transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-4 text-center text-gray-400"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="px-4 py-2">
                          {new Date(t.date).toLocaleDateString("en-CA", {
                            month: "short",
                            day: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-2 text-gray-300">{t.type}</td>
                        <td className="px-4 py-2">{formatMoney(t.amount)}</td>
                        <td
                          className={`px-4 py-2 ${
                            t.status === "Completed"
                              ? "text-green-400"
                              : t.status === "Pending"
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          {t.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pending Invoices */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Outstanding Invoices
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
                  {invoices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-4 text-center text-gray-400"
                      >
                        No outstanding invoices.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="px-4 py-2">#{inv.id}</td>
                        <td className="px-4 py-2 text-gray-300">
                          {inv.customer || "-"}
                        </td>
                        <td className="px-4 py-2">{formatMoney(inv.amount)}</td>
                        <td className="px-4 py-2 text-yellow-400">
                          {inv.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .glass-card {
          @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-md;
        }
      `}</style>
    </div>
  );
};

export default FinancePage;
