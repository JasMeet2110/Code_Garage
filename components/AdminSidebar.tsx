"use client";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const [showConfirm, setShowConfirm] = useState(false);

  const [lowStockCount, setLowStockCount] = useState(0);

useEffect(() => {
  async function fetchLowStock() {
    try {
      const res = await fetch("/api/inventory/low-stock", { cache: "no-store" });
      const data = await res.json();
      setLowStockCount(data.length);
    } catch (err) {
      console.error("Low stock fetch error:", err);
    }
  }

  fetchLowStock();
}, []);

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-72 backdrop-blur-lg bg-white/10 border-r border-white/20 shadow-lg text-white flex flex-col items-center py-8 z-50">
        {/* Logo Section */}
        <Link href="/Admin/AdminHome" className="flex flex-col items-center mb-10"> {/* added homepage link to the logo */}
          <Image
            src="/logo/tracksidegarage.png"
            alt="Logo"
            width={120}
            height={120}
            className="invert brightness-0"
          />
          <h1 className="text-2xl font-bold mt-3">Trackside Garage</h1>
          <p className="text-sm text-gray-300">
            Reliable Repairs. Built with Passion.
          </p>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col w-full px-6 space-y-4">
          {[
            { href: "/Admin/AdminHome", label: "Home" },
            { href: "/Admin/AdminInventory", label: "Inventory" },
            { href: "/Admin/AdminAppointments", label: "Appointments" },
            { href: "/Admin/AdminEmployees", label: "Employees" },
            { href: "/Admin/AdminCustomers", label: "Customers" },
            { href: "/Admin/AdminReviews", label: "Reviews" },
            { href: "/Admin/AdminReports", label: "Reports" },
            { href: "/Admin/AdminFinance", label: "Finance" },
            { href: "/Admin/AdminAIAssistant", label: "AI Assistant" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-xl text-lg font-medium hover:bg-white/20 transition-all duration-200"
            >
              <span className="relative flex items-center gap-2">
                {item.label}

                {item.label === "Inventory" && lowStockCount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {lowStockCount}
                  </span>
                )}
              </span>
            </Link>
          ))}

          {/* Sign Out */}
          <button
            onClick={() => setShowConfirm(true)}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white text-center px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm"
          >
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[999]">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl backdrop-blur-md text-center w-80 animate-fadeIn">
            <h2 className="text-xl font-bold text-orange-400 mb-4">
              Confirm Sign Out
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold text-white transition-all"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-600 hover:bg-gray-500 px-5 py-2 rounded-lg font-semibold text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </>
  );
}
