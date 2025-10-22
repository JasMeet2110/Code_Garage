"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaBoxOpen,
  FaUsers,
  FaUserTie,
  FaMoneyBillWave,
  FaChartPie,
  FaCalendarAlt,
} from "react-icons/fa";
import AdminSidebar from "@/components/AdminSidebar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AdminHome() {
  const router = useRouter();

  // Dummy Data (to be replaced with DB values later)
  const inventoryCount = 124;
  const appointmentsToday = 9;
  const employees = 14;
  const customers = 212;
  const avgSales = "$18,450";
  const avgServiced = "56 Cars / Month";

  const data = [
    { name: "Repairs", value: 45 },
    { name: "Parts Sales", value: 25 },
    { name: "Diagnostics", value: 15 },
    { name: "Maintenance", value: 15 },
  ];

  const COLORS = ["#f97316", "#10b981", "#3b82f6", "#facc15"];

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      {/* Background Image using <Image /> */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background/Admin.png"
          alt="Garage Background"
          fill
          priority
          className="object-cover brightness-[0.45] blur-sm"
        />
        {/* Overlay tint for better text contrast */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Dashboard Area */}
      <main className="ml-72 flex-1 p-10 relative z-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold text-orange-400 mb-2 drop-shadow-md">
            Admin Dashboard
          </h1>
          <p className="text-gray-300 mb-10">
            Trackside Garage — Manage operations, analyze performance, and stay ahead.
          </p>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Inventory */}
            <div
              onClick={() => router.push("/Admin/AdminInventory")}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:scale-105 hover:bg-white/20 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaBoxOpen className="text-orange-400 text-4xl" />
                <h2 className="text-2xl font-semibold">Inventory</h2>
              </div>
              <p className="text-gray-300 mb-2">
                Total Parts & Tools:{" "}
                <span className="font-bold text-white">{inventoryCount}</span>
              </p>
              <p className="text-sm text-gray-400">Last restock: 2 days ago</p>
            </div>

            {/* Appointments */}
            <div
              onClick={() => router.push("/Admin/AdminAppointments")}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:scale-105 hover:bg-white/20 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaCalendarAlt className="text-green-400 text-4xl" />
                <h2 className="text-2xl font-semibold">Appointments</h2>
              </div>
              <p className="text-gray-300 mb-2">
                Booked Today:{" "}
                <span className="font-bold text-white">{appointmentsToday}</span>
              </p>
              <p className="text-sm text-gray-400">
                View and manage daily schedules
              </p>
            </div>

            {/* Employees */}
            <div
              onClick={() => router.push("/Admin/AdminEmployees")}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:scale-105 hover:bg-white/20 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaUserTie className="text-blue-400 text-4xl" />
                <h2 className="text-2xl font-semibold">Employees</h2>
              </div>
              <p className="text-gray-300 mb-2">
                Active Staff:{" "}
                <span className="font-bold text-white">{employees}</span>
              </p>
              <p className="text-sm text-gray-400">
                Manage schedules and roles
              </p>
            </div>

            {/* Customers */}
            <div
              onClick={() => router.push("/Admin/AdminCustomers")}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:scale-105 hover:bg-white/20 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaUsers className="text-yellow-400 text-4xl" />
                <h2 className="text-2xl font-semibold">Customers</h2>
              </div>
              <p className="text-gray-300 mb-2">
                Registered Clients:{" "}
                <span className="font-bold text-white">{customers}</span>
              </p>
              <p className="text-sm text-gray-400">
                View loyalty stats and service history
              </p>
            </div>

            {/* Reports with Pie Chart */}
            <div
              onClick={() => router.push("/Admin/AdminReports")}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:scale-105 hover:bg-white/20 transition-all cursor-pointer shadow-lg col-span-1 md:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaChartPie className="text-pink-400 text-4xl" />
                <h2 className="text-2xl font-semibold">Reports</h2>
              </div>
              <div className="h-48">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      label
                    >
                      {data.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Finance */}
            <div
              onClick={() => router.push("/Admin/AdminFinance")}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:scale-105 hover:bg-white/20 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaMoneyBillWave className="text-green-500 text-4xl" />
                <h2 className="text-2xl font-semibold">Finance</h2>
              </div>
              <p className="text-gray-300">
                Average Monthly Sales:{" "}
                <span className="font-bold text-white">{avgSales}</span>
              </p>
              <p className="text-gray-300">
                Avg Cars Serviced:{" "}
                <span className="font-bold text-white">{avgServiced}</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
