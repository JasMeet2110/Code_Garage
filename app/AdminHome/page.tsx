"use client";

import React from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar"; // your fixed left sidebar (w-64)

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-[#0F1621] text-gray-100">
      {/* Fixed left sidebar */}
      <AdminSidebar />

      {/* MAIN: push content to the right of sidebar */}
      <main className="ml-64"> {/* 64 = 256px sidebar width */}
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header row (title + search) */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
            <div className="hidden sm:block">
              <input
                placeholder="Search…"
                className="h-9 w-64 rounded-md bg-[#141C27] border border-[#223046] px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Stat cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            <Card title="Today’s Appointments" value="24" sub="+6 vs yesterday" />
            <Card title="Open Work Orders" value="12" sub="4 urgent" />
            <Card title="Revenue (7d)" value="$8,420" sub="+12%" />
            <Card title="Customer Rating" value="4.7 / 5" sub="last 50 reviews" />
          </section>

          {/* Main grid: table (2 cols) + chart (1 col) */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Recent appts (spans 2 cols on xl) */}
            <div className="xl:col-span-2 rounded-lg border border-[#223046] bg-[#0C1420]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#223046]">
                <h2 className="text-sm font-medium text-gray-200">Recent Appointments</h2>
                <Link
                  href="#"
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  View all
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#0B1320] border-b border-[#223046] text-gray-300">
                    <tr>
                      <Th>ID</Th>
                      <Th>Customer</Th>
                      <Th>Service</Th>
                      <Th>Time</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C2A3E]">
                    <Row id="A1042" customer="John D." service="Brake Service" time="10:30" status={<Badge s="Scheduled" />} />
                    <Row id="A1041" customer="Sara K." service="Oil Change" time="09:00" status={<Badge s="In Progress" color="yellow" />} />
                    <Row id="A1040" customer="Mike T." service="Battery Test" time="14:00" status={<Badge s="Completed" color="green" />} />
                    <Row id="A1039" customer="Priya R." service="Full Maint." time="16:30" status={<Badge s="Scheduled" />} />
                  </tbody>
                </table>
              </div>

              {/* Quick actions (stack on small, row on >=sm) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border-t border-[#223046]">
                <button className="h-10 rounded-md border border-[#223046] bg-[#0F1A2A] text-xs font-medium text-gray-300 hover:bg-[#132036]">
                  Create Appointment
                </button>
                <button className="h-10 rounded-md border border-[#223046] bg-[#0F1A2A] text-xs font-medium text-gray-300 hover:bg-[#132036]">
                  Add Inventory Item
                </button>
                <button className="h-10 rounded-md border border-[#223046] bg-[#0F1A2A] text-xs font-medium text-gray-300 hover:bg-[#132036]">
                  Invite New Employee
                </button>
              </div>
            </div>

            {/* Right: simple bar preview */}
            <div className="rounded-lg border border-[#223046] bg-[#0C1420] p-4">
              <h2 className="text-sm font-medium text-gray-200 mb-3">Workload (This Week)</h2>
              <div className="h-56 flex items-end justify-between gap-2">
                {[35, 55, 90, 50, 80, 65, 85].map((h, i) => (
                  <div
                    key={i}
                    className="w-full rounded bg-indigo-500/30 border border-indigo-400/30"
                    style={{ height: `${h}%` }}
                    aria-hidden
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------- small presentational pieces ---------- */

function Card(props: { title: string; value: string; sub?: string }) {
  const { title, value, sub } = props;
  return (
    <div className="rounded-lg border border-[#223046] bg-[#0C1420] p-4">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-100">{value}</p>
      {sub && <p className="mt-1 text-[11px] text-gray-400">{sub}</p>}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2 text-left font-medium tracking-wide">
      {children}
    </th>
  );
}

function Row({
  id,
  customer,
  service,
  time,
  status,
}: {
  id: string;
  customer: string;
  service: string;
  time: string;
  status: React.ReactNode;
}) {
  return (
    <tr className="hover:bg-[#0F1A2A]">
      <td className="px-4 py-3 text-gray-300">{id}</td>
      <td className="px-4 py-3 text-gray-300">{customer}</td>
      <td className="px-4 py-3 text-gray-400">{service}</td>
      <td className="px-4 py-3 text-gray-400">{time}</td>
      <td className="px-4 py-3">{status}</td>
    </tr>
  );
}

function Badge({
  s,
  color = "blue",
}: {
  s: string;
  color?: "blue" | "green" | "yellow";
}) {
  const map = {
    blue: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    green: "bg-green-500/20 text-green-300 border-green-400/30",
    yellow: "bg-yellow-500/20 text-yellow-200 border-yellow-400/30",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] border ${map[color]}`}
    >
      {s}
    </span>
  );
}
