import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
     <nav className="fixed top-0 left-0 w-full bg-black text-white px-8 h-35 flex justify-between items-center shadow-md z-50">
      <div className="flex items-center gap-4 px-40">
        <Image src="/logo/TracksideGarage.png" alt="Logo" width={200} height={200} className="invert brightness-0"/>
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
      </div>
    </nav>
  );
}
