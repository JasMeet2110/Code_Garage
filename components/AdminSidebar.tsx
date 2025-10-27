"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/AdminHome",       label: "Dashboard" },
  { href: "/AdminInventory",  label: "Inventory" },
  { href: "/AdminAppointments", label: "Appointments" },
  { href: "/AdminEmployees",  label: "Employees" },
  { href: "/AdminCustomers",  label: "Customers" },
  { href: "/AdminReports",    label: "Reports" },
  { href: "/AdminFinance",    label: "Finance" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
<<<<<<< HEAD
    <aside
      className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white border-r border-gray-800"
      aria-label="Admin sidebar"
    >
      <div className="px-5 py-4 border-b border-gray-800">
        <div className="text-lg font-bold">Admin</div>
        <div className="text-xs text-gray-400">Manage everything</div>
=======
    <aside className="fixed top-0 left-0 h-screen w-72 backdrop-blur-lg bg-white/10 border-r border-white/20 shadow-lg text-white flex flex-col items-center py-8 z-50">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src="logo/TracksideGarage.png"
          alt="Logo"
          width={120}
          height={120}
          className="invert brightness-0"
        />
        <h1 className="text-2xl font-bold mt-3">Trackside Garage</h1>
        <p className="text-sm text-gray-300">Reliable Repairs. Built with Passion.</p>
>>>>>>> ef83d2a4e082110a695ac45197a60916319f5f6f
      </div>

      <nav className="px-2 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-md px-3 py-2 text-sm",
                active
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-800",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}