import Link from "next/link";
import Image from "next/image";

export default function AdminNavbar() {
  return (
     <nav className="fixed top-0 left-0 w-full bg-black text-white px-8 h-35 flex justify-between items-center shadow-md z-50">
      <div className="flex items-center gap-4 px-40">
        <Image src="/TracksideGarage.png" alt="Logo" width={200} height={200} className="invert brightness-0" />
          <div>
              <h1 className="text-3xl font-bold">Trackside Garage</h1>
              <p className="text-lg">Reliable Repairs. Built with Passion.</p>
          </div>
      </div>
      <div className="flex gap-5">
        <Link href="/AdminHome" className="nav-btn">Home</Link>
        <Link href="/AdminInventory" className="nav-btn">Inventory</Link>
        <Link href="/AdminAppointments" className="nav-btn">Appointment</Link>
        <Link href="/AdminEmployees" className="nav-btn">Employees</Link>
        <Link href="/AdminCustomers" className="nav-btn">Customers</Link>
        <Link href="/AdminReports" className="nav-btn">Reports</Link>
        <Link href="/AdminFinance" className="nav-btn">Finance</Link>
        <Link href="/" className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform duration-200 shadow-sm">Sign Out</Link>
      </div>
    </nav>
  );
}
