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
     <nav className="fixed top-0 left-0 w-full bg-black text-white px-8 h-35 flex justify-between items-center shadow-md z-50">
      <div className="flex items-center gap-4 px-40">
        <Image src="/TracksideGarage.png" alt="Logo" width={200} height={200} className="invert brightness-0"/>
          <div>
              <h1 className="text-3xl font-bold">Trackside Garage</h1>
              <p className="text-lg">Reliable Repairs. Built with Passion.</p>
          </div>
      </div>  
      <div className="flex gap-5 px-10">
        <Link href="/" className="nav-btn">Home</Link>
        <Link href="/Client/services" className="nav-btn">Services</Link>
        <Link href="/Client/book-appointment" className="nav-btn">Book</Link>
        <Link href="/Client/reviews" className="nav-btn">Reviews</Link>
        <Link href="/Client/contact" className="nav-btn">Contact</Link>
        <Link href="/Client/account" className="nav-btn">My Account</Link>
        <Link href="/AuthScreen" className="nav-btn">Sign In</Link>
>>>>>>> 00949fae4653a673228c3c913bca22d6e749203e
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
