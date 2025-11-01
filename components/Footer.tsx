import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full backdrop-blur-xl bg-gradient-to-b from-black/70 to-gray-900/50 border-t border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] text-white">
      <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Logo + Shop Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">
            <span className="text-orange-500">Trackside</span> Garage
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your trusted auto repair shop in Alberta. Full-service repairs for all makes & models.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 font-medium">
            <li>
              <Link
                href="/"
                className="hover:text-orange-400 hover:bg-white/10 px-2 py-1 rounded-lg transition-all duration-200 inline-block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/Client/services"
                className="hover:text-orange-400 hover:bg-white/10 px-2 py-1 rounded-lg transition-all duration-200 inline-block"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/Client/book-appointment"
                className="hover:text-orange-400 hover:bg-white/10 px-2 py-1 rounded-lg transition-all duration-200 inline-block"
              >
                Book Appointment
              </Link>
            </li>
            <li>
              <Link
                href="/Client/reviews"
                className="hover:text-orange-400 hover:bg-white/10 px-2 py-1 rounded-lg transition-all duration-200 inline-block"
              >
                Reviews
              </Link>
            </li>
            <li>
              <Link
                href="/Client/contact"
                className="hover:text-orange-400 hover:bg-white/10 px-2 py-1 rounded-lg transition-all duration-200 inline-block"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Contact Us</h3>
          <p className="text-gray-300 text-sm mb-1 hover:text-orange-400 transition-all duration-200">
            Alberta, Canada
          </p>
          <p className="text-gray-300 text-sm mb-1 hover:text-orange-400 transition-all duration-200">
            +1 (604) 710-3226
          </p>
          <p className="text-gray-300 text-sm hover:text-orange-400 transition-all duration-200">
            tracksidegarage0101@gmail.com
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4 text-center text-gray-400 text-sm bg-black/50 backdrop-blur-md">
        © {new Date().getFullYear()}{" "}
        <span className="text-orange-400 font-semibold">Trackside Garage</span>. All Rights Reserved.
      </div>
    </footer>
  );
}
