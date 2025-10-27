"use client";

import Link from "next/link";
<<<<<<< HEAD
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Boxes, CalendarClock, Users2, UserRound,
  FileBarChart2, Wallet
} from "lucide-react";

// Dark palette: slate background + orange accent
const NAV_BG    = "bg-slate-900";
const NAV_TEXT  = "text-slate-200";
const HOVER_BG  = "hover:bg-slate-800";
const ACTIVE_BG = "bg-slate-800";
const ACTIVE_TX = "text-orange-400";

const items = [
  { href: "/AdminHome",        label: "Dashboard",   Icon: LayoutDashboard },
  { href: "/AdminInventory",   label: "Inventory",   Icon: Boxes },
  { href: "/AdminAppointments",label: "Appointments",Icon: CalendarClock },
  { href: "/AdminEmployees",   label: "Employees",   Icon: Users2 },
  { href: "/AdminCustomers",   label: "Customers",   Icon: UserRound },
  { href: "/AdminReports",     label: "Reports",     Icon: FileBarChart2 },
  { href: "/AdminFinance",     label: "Finance",     Icon: Wallet },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 ${NAV_BG} border-r border-slate-800 z-40`}>
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-lg font-semibold tracking-tight text-orange-400">
          Trackside Garage
        </span>
      </div>

      {/* Nav */}
      <nav className="py-3">
        {items.map(({ href, label, Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`mx-2 my-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition
                ${NAV_TEXT} ${HOVER_BG}
                ${active ? `${ACTIVE_BG} ${ACTIVE_TX}` : ""}`}
            >
              <Icon size={18} className={active ? "text-orange-400" : "text-slate-300"} />
              <span>{label}</span>
            </Link>
          );
        })}
=======
import Image from "next/image";

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

        <Link
          href="/"
          className="mt-8 bg-red-600 hover:bg-red-700 text-white text-center px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm"
        >
          Sign Out
        </Link>
>>>>>>> 00949fae4653a673228c3c913bca22d6e749203e
      </nav>
    </aside>
  );
}
