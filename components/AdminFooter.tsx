import Link from "next/link";

export default function AdminFooter() {
  return (
    <footer className="bg-black text-white py-3">
      <div className="max-w-6xl mx-auto px-6 my-5 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Logo + Shop Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">SunRise Car Mechanic</h2>
          <p className="text-gray-400 text-sm">
            Your trusted auto repair shop in Ontario. Full-service repairs for all makes & models.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/HomePage" className="hover:text-orange-400">Home</Link></li>
            <li><Link href="/AdminInventory" className="hover:text-orange-400">Inventory</Link></li>
            <li><Link href="/AdminAppointments" className="hover:text-orange-400">Appointment</Link></li>
            <li><Link href="/AdminEmployees" className="hover:text-orange-400">Employees</Link></li>
            <li><Link href="/AdminCustomers" className="hover:text-orange-400">Customers</Link></li>
            <li><Link href="/AdminReports" className="hover:text-orange-400">Reports</Link></li>
            <li><Link href="/AdminFinance" className="hover:text-orange-400">Finance</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-3">Contact Us</h3>
          <p className="text-gray-400 text-sm">Ontario, Canada</p>
          <p className="text-gray-400 text-sm">+1 (604) 710-3226</p>
          <p className="text-gray-400 text-sm">sunriseautomechanic@gmail.com</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SunRise Car Mechanic. All Rights Reserved.
      </div>
    </footer>
  );
}
