"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  const { data: session, status } = useSession();
  const router = useRouter();

  const [inventoryCount, setInventoryCount] = useState<number | null>(null);
  const [appointmentsToday, setAppointmentsToday] = useState<number | null>(null);
  const [employeesCount, setEmployeesCount] = useState<number | null>(null);
  const [customersCount, setCustomersCount] = useState<number | null>(null);
  const [topServices, setTopServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Restrict Access
  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.email !== "tracksidegarage0101@gmail.com") {
      router.replace("/AuthScreen");
    }
  }, [session, status, router]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Inventory Count
        const invRes = await fetch("/api/inventory");
        const invData = await invRes.json();
        setInventoryCount(invData.length);

        // Appointments Count (today only)
        const apptRes = await fetch("/api/appointments");
        const apptData = await apptRes.json();
        setAppointmentsToday(apptData.length);

        // Employees Count
        const empRes = await fetch("/api/employees");
        const empData = await empRes.json();
        setEmployeesCount(empData.length);

        // Customers Count
        const custRes = await fetch("/api/customers");
        const custData = await custRes.json();
        setCustomersCount(custData.length);

        // Reports Data (Top Services)
        const reportRes = await fetch("/api/reports");
        const reportData = await reportRes.json();
        setTopServices(reportData.topServices || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#ef4444", "#eab308"];

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        Loading Dashboard...
      </div>
    );
  }

  if (session?.user?.email !== "tracksidegarage0101@gmail.com") return null;

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

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Dashboard */}
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
            <DashboardCard
              icon={<FaBoxOpen className="text-orange-400 text-4xl" />}
              title="Inventory"
              subtitle={`Total Parts: ${inventoryCount ?? "—"}`}
              details="Manage available stock and parts"
              onClick={() => router.push("/Admin/AdminInventory")}
            />

            {/* Appointments */}
            <DashboardCard
              icon={<FaCalendarAlt className="text-green-400 text-4xl" />}
              title="Appointments"
              subtitle={`Total Booked: ${appointmentsToday ?? "—"}`}
              details="View and manage daily schedules"
              onClick={() => router.push("/Admin/AdminAppointments")}
            />

            {/* Employees */}
            <DashboardCard
              icon={<FaUserTie className="text-blue-400 text-4xl" />}
              title="Employees"
              subtitle={`Active Staff: ${employeesCount ?? "—"}`}
              details="Manage schedules and roles"
              onClick={() => router.push("/Admin/AdminEmployees")}
            />

            {/* Customers */}
            <DashboardCard
              icon={<FaUsers className="text-yellow-400 text-4xl" />}
              title="Customers"
              subtitle={`Registered Clients: ${customersCount ?? "—"}`}
              details="View loyalty stats and service history"
              onClick={() => router.push("/Admin/AdminCustomers")}
            />

            {/* Reports */}
            <div
              onClick={() => router.push("/Admin/AdminReports")}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:scale-105 hover:bg-white/20 transition-all cursor-pointer shadow-lg col-span-1 md:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaChartPie className="text-pink-400 text-4xl" />
                <h2 className="text-2xl font-semibold">Reports</h2>
              </div>
              <div className="h-48">
                {topServices.length > 0 ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={topServices}
                        dataKey="count"
                        nameKey="name"
                        outerRadius={70}
                        label
                      >
                        {topServices.map((_, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-center mt-10">
                    No completed services yet.
                  </p>
                )}
              </div>
            </div>

            {/* Finance */}
            <DashboardCard
              icon={<FaMoneyBillWave className="text-green-500 text-4xl" />}
              title="Finance"
              subtitle="View monthly revenue & cost"
              details="Analyze your shop’s earnings"
              onClick={() => router.push("/Admin/AdminFinance")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* 🔧 Reusable Dashboard Card Component */
const DashboardCard = ({
  icon,
  title,
  subtitle,
  details,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  details: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:scale-105 hover:bg-white/20 transition-all cursor-pointer shadow-lg"
  >
    <div className="flex items-center gap-4 mb-4">
      {icon}
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
    <p className="text-gray-300 mb-2">{subtitle}</p>
    <p className="text-sm text-gray-400">{details}</p>
  </div>
);
