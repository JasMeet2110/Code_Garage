"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-72 backdrop-blur-lg bg-white/10 border-r border-white/20 shadow-lg text-white flex flex-col items-center py-8 z-50">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/TracksideGarage.png"
          alt="Logo"
          width={120}
          height={120}
          className="invert brightness-0"
        />
        <h1 className="text-2xl font-bold mt-3">Trackside Garage</h1>
        <p className="text-sm text-gray-300">Reliable Repairs. Built with Passion.</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col w-full px-6 space-y-4">
        {[
          { href: "/Admin/AdminHome", label: "Home" },
          { href: "/Admin/AdminInventory", label: "Inventory" },
          { href: "/Admin/AdminAppointments", label: "Appointments" },
          { href: "/Admin/AdminEmployees", label: "Employees" },
          { href: "/Admin/AdminCustomers", label: "Customers" },
          { href: "/Admin/AdminReports", label: "Reports" },
          { href: "/Admin/AdminFinance", label: "Finance" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 rounded-xl text-lg font-medium hover:bg-white/20 transition-all duration-200"
          >
            {item.label}
          </Link>
        ))}

        {/* Sign Out */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-8 bg-red-600 hover:bg-red-700 text-white text-center px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm"
        >
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
