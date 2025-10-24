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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#ef4444", "#eab308"];

export default function ReportsAnalyticsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [appointmentsTrend, setAppointmentsTrend] = useState<any[]>([]);
  const [topServices, setTopServices] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    fetchReports();
  }, [selectedMonth]);

  const fetchReports = async () => {
    try {
      const queryParam = selectedMonth ? `?month=${selectedMonth}` : "";
      const res = await fetch(`/api/reports${queryParam}`, { cache: "no-store" });
      const data = await res.json();
      setSummary(data.summary);
      setAppointmentsTrend(data.appointmentsTrend || []);
      setTopServices(data.topServices || []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  const months = [
    { label: "All Year", value: "" },
    { label: "January", value: "2025-01" },
    { label: "February", value: "2025-02" },
    { label: "March", value: "2025-03" },
    { label: "April", value: "2025-04" },
    { label: "May", value: "2025-05" },
    { label: "June", value: "2025-06" },
    { label: "July", value: "2025-07" },
    { label: "August", value: "2025-08" },
    { label: "September", value: "2025-09" },
    { label: "October", value: "2025-10" },
    { label: "November", value: "2025-11" },
    { label: "December", value: "2025-12" },
  ];

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      {/* Background */}
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

      <main className="ml-72 flex-1 p-10 relative z-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-orange-400 drop-shadow-md">
              Reports & Analytics
            </h1>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="glass-card">
                <h3 className="text-lg font-semibold">Total Customers</h3>
                <p className="text-3xl font-bold text-orange-400 mt-2">
                  {summary.total_customers}
                </p>
              </div>
              <div className="glass-card">
                <h3 className="text-lg font-semibold">Appointments</h3>
                <p className="text-3xl font-bold text-orange-400 mt-2">
                  {summary.total_appointments}
                </p>
              </div>
              <div className="glass-card">
                <h3 className="text-lg font-semibold">Employees</h3>
                <p className="text-3xl font-bold text-orange-400 mt-2">
                  {summary.total_employees}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Avg Salary: ${summary.avg_salary}
                </p>
              </div>
              <div className="glass-card">
                <h3 className="text-lg font-semibold">Top Service</h3>
                <p className="text-xl font-bold text-orange-400 mt-2">
                  {topServices[0]?.name || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Appointments Trend */}
          <div className="glass-card h-80 mb-10">
            <h2 className="text-xl font-bold text-orange-400 mb-4">
              Appointments Trend (Monthly)
            </h2>
            {appointmentsTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center mt-12">
                No appointment data available.
              </p>
            )}
          </div>

          {/* Top Services Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Top Services ({selectedMonth || "All Year"})
              </h2>
              {topServices.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topServices}
                      dataKey="count"
                      nameKey="name"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {topServices.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center py-12">
                  No completed services found for this month.
                </p>
              )}
            </div>

            {/* Table next to Pie */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Service Breakdown
              </h2>
              <table className="min-w-full text-sm text-gray-300 mt-4">
                <thead>
                  <tr className="text-orange-400">
                    <th className="text-left px-2">Service</th>
                    <th className="text-right px-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topServices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="text-center text-gray-400 py-4"
                      >
                        No data available.
                      </td>
                    </tr>
                  ) : (
                    topServices.map((s, i) => (
                      <tr
                        key={i}
                        className="border-t border-white/10 hover:bg-white/5"
                      >
                        <td className="px-2 py-1">{s.name}</td>
                        <td className="px-2 py-1 text-right">{s.count}</td>
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
}
