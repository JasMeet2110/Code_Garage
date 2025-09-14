import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
     <nav className="fixed top-0 left-0 w-full bg-black text-white px-8 h-35 flex justify-between items-center shadow-md z-50">
      <div className="flex items-center gap-4 px-40">
        <Image src="/SunriseLogo.png" alt="Logo" width={200} height={200} className="invert brightness-0 "/>
          <div>
              <h1 className="text-3xl font-bold">SunRise Car Mechanic</h1>
              <p className="text-lg">Professional Auto Car Services</p>
          </div>
      </div>  
      <div className="flex gap-5 px-10">
        <Link href="/HomePage" className="nav-btn">Home</Link>
        <Link href="/services" className="nav-btn">Services</Link>
        <Link href="/book-appointment" className="nav-btn">Book</Link>
        <Link href="/reviews" className="nav-btn">Reviews</Link>
        <Link href="/contact" className="nav-btn">Contact</Link>
        <Link href="/account" className="nav-btn">My Account</Link>
        <Link href="/" className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform duration-200 shadow-sm">Sign Out</Link>
      </div>
    </nav>
  );
}
