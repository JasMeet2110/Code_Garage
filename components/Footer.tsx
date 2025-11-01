import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-black via-gray-900 to-black text-white py-8">
      <div className="max-w-6xl mx-auto px-6 my-5 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Logo + Shop Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-orange-500">Trackside Garage</h2>
          <p className="text-gray-400 text-sm">
            Your trusted auto repair shop in Alberta. Full-service repairs for all makes & models.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-200">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/" className="hover:text-orange-400 transition-all duration-200">Home</Link></li>
            <li><Link href="/Client/services" className="hover:text-orange-400 transition-all duration-200">Services</Link></li>
            <li><Link href="/Client/book-appointment" className="hover:text-orange-400 transition-all duration-200">Book Appointment</Link></li>
            <li><Link href="/Client/reviews" className="hover:text-orange-400 transition-all duration-200">Reviews</Link></li>
            <li><Link href="/Client/contact" className="hover:text-orange-400 transition-all duration-200">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-200">Contact Us</h3>
          <p className="text-gray-400 text-sm">Alberta, Canada</p>
          <p className="text-gray-400 text-sm">+1 (604) 710-3226</p>
          <p className="text-gray-400 text-sm">tracksidegarage0101@gmail.com</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-white/10 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Trackside Garage. All Rights Reserved.
      </div>
    </footer>
  );
}
