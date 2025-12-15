import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full backdrop-blur-xl bg-gradient-to-b from-black/40 to-gray-900/10 border-t border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] text-white">
      <div className="max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        
        <div>
          <h2 className="flex items-baseline gap-2 text-3xl font-bold mb-2 tracking-wide">
            <span>Trackside</span>
            <span className="text-orange-500">Garage</span>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Reliable Repairs. Built with Passion.  
            Your trusted auto repair shop in Alberta — full-service for all makes & models.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 font-medium">
            {[
              { href: "/", label: "Home" },
              { href: "/Client/services", label: "Services" },
              { href: "/Client/book-appointment", label: "Book Appointment" },
              { href: "/Client/reviews", label: "Reviews" },
              { href: "/Client/contact", label: "Contact" },
              { href: "/Client/account", label: "My Account" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block px-3 py-1 rounded-lg hover:text-orange-400 hover:bg-white/10 transition-all duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Contact Us</h3>
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

      <div className="border-t border-white/10 bg-black/60 backdrop-blur-lg py-5 text-center text-gray-400 text-sm font-medium shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        © {new Date().getFullYear()}{" "}
        <span className="text-orange-400 font-semibold">Trackside Garage</span>. All Rights Reserved.
      </div>

      <style jsx>{`
        footer {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </footer>
  );
}
