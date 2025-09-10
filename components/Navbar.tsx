import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white px-6 flex justify-between items-center shadow-md z-50">
      <div className="grid grid-flow-col grid-rows-3 pl-50 pt-10">
        <div className="row-span-3 pr-5"><Image src="/SunriseLogo.png" alt="Logo" width={200} height={200} className="invert brightness-0 "/></div>
        <div className="col-span-2"><h1 className="text-3xl font-bold">SunRise Car Mechanic</h1></div>
        <div className="col-span-2 row-span-2"><p className="text-lg">Professional Auto Car Services</p></div>
      </div>  
      <div className="flex gap-5 pr-50">
        <Link href="/" className="nav-btn">Home</Link>
        <Link href="/services" className="nav-btn">Services</Link>
        <Link href="/book" className="nav-btn">Book</Link>
        <Link href="/reviews" className="nav-btn">Reviews</Link>
        <Link href="/contact" className="nav-btn">Contact</Link>
        <Link href="/account" className="nav-btn">My Account</Link>
      </div>
    </nav>
  );
}
