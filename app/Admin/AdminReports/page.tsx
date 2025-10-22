"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#ef4444", "#eab308"];

const ReportsAnalyticsPage = () => {
  // Simulated data (later replace with API fetches)
  const [summary, setSummary] = useState({
    totalCustomers: 124,
    totalAppointments: 87,
    totalRevenue: 15320,
    employees: 6,
    salaryExpense: 24500,
  });

  const [appointmentsTrend, setAppointmentsTrend] = useState([
    { month: "Jan", count: 12 },
    { month: "Feb", count: 18 },
    { month: "Mar", count: 22 },
    { month: "Apr", count: 15 },
    { month: "May", count: 28 },
    { month: "Jun", count: 25 },
    { month: "Jul", count: 30 },
    { month: "Aug", count: 27 },
    { month: "Sep", count: 35 },
    { month: "Oct", count: 32 },
  ]);

  const [revenueTrend, setRevenueTrend] = useState([
    { month: "Jan", revenue: 2000 },
    { month: "Feb", revenue: 2500 },
    { month: "Mar", revenue: 3000 },
    { month: "Apr", revenue: 2700 },
    { month: "May", revenue: 3500 },
    { month: "Jun", revenue: 4200 },
    { month: "Jul", revenue: 4800 },
    { month: "Aug", revenue: 5100 },
    { month: "Sep", revenue: 5300 },
    { month: "Oct", revenue: 5800 },
  ]);

  const [topServices, setTopServices] = useState([
    { name: "Oil Change", count: 42 },
    { name: "Brake Repair", count: 36 },
    { name: "Diagnostics", count: 28 },
    { name: "Battery Replacement", count: 20 },
    { name: "Suspension", count: 18 },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    "Emma Wilson booked an appointment for Oil Change",
    "New employee hired: Alex Carter (Technician)",
    "Invoice #1023 paid: $450 (John Doe)",
    "Customer feedback received: 5⭐ from Raj Singh",
    "Appointment completed: Brake Repair (Oct 20)",
  ]);

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

      {/* Main */}
      <main className="ml-72 flex-1 p-10 relative z-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold text-orange-400 mb-8 drop-shadow-md">
            Reports & Analytics
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="glass-card">
              <h3 className="text-lg font-semibold">Total Customers</h3>
              <p className="text-3xl font-bold text-orange-400 mt-2">{summary.totalCustomers}</p>
            </div>
            <div className="glass-card">
              <h3 className="text-lg font-semibold">Appointments</h3>
              <p className="text-3xl font-bold text-orange-400 mt-2">{summary.totalAppointments}</p>
            </div>
            <div className="glass-card">
              <h3 className="text-lg font-semibold">Revenue (CAD)</h3>
              <p className="text-3xl font-bold text-orange-400 mt-2">${summary.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="glass-card">
              <h3 className="text-lg font-semibold">Employees</h3>
              <p className="text-xl font-bold text-orange-400 mt-2">{summary.employees} Active</p>
              <p className="text-sm text-gray-400 mt-1">Monthly Salary: ${summary.salaryExpense.toLocaleString()}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="glass-card h-80">
              <h2 className="text-xl font-bold text-orange-400 mb-4">
                Appointments Trend
              </h2>
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
            </div>

            <div className="glass-card h-80">
              <h2 className="text-xl font-bold text-orange-400 mb-4">
                Revenue Trend
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
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-6 mt-24">
            {/* Top Services */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Top Services This Month
              </h2>
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
                    {topServices.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <table className="min-w-full text-sm text-gray-300 mt-4">
                <thead>
                  <tr className="text-orange-400">
                    <th className="text-left px-2">Service</th>
                    <th className="text-right px-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topServices.map((s, i) => (
                    <tr key={i} className="border-t border-white/10">
                      <td className="px-2 py-1">{s.name}</td>
                      <td className="px-2 py-1 text-right">{s.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Activity */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Recent Activity
              </h2>
              <ul className="space-y-3">
                {recentActivity.map((item, index) => (
                  <li key={index} className="text-gray-300 bg-white/5 px-4 py-2 rounded-lg">
                    {item}
                  </li>
                ))}
              </ul>
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

export default ReportsAnalyticsPage;
