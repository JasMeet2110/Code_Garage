"use client";

import Link from "next/link";
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
      </nav>
    </aside>
  );
}
