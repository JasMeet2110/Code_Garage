"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
<<<<<<< HEAD
    <nav className="fixed top-0 left-0 w-full bg-black text-white px-8 h-32 flex justify-between items-center shadow-md z-50">
      {/* Logo + Brand */}
      <div className="flex items-center gap-4 px-40">
        <Image
          src="/TracksideGarage.png"
          alt="Logo"
          width={200}
          height={200}
          className="invert brightness-0"
        />
        <div>
          <h1 className="text-3xl font-bold">Trackside Garage</h1>
          <p className="text-lg text-gray-300">
            Reliable Repairs. Built with Passion.
          </p>
        </div>
=======
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
>>>>>>> 65026de7ed9c26dd09d2f9b4c45af6861a93b7be
      </div>

      {/* Navigation Links */}
      <div className="flex gap-5 px-10 text-lg font-medium">
        <Link href="/" className="nav-btn hover:text-orange-400 transition">
          Home
        </Link>
        <Link
          href="/Client/services"
          className="nav-btn hover:text-orange-400 transition"
        >
          Services
        </Link>
        <Link
          href="/Client/book-appointment"
          className="nav-btn hover:text-orange-400 transition"
        >
          Book
        </Link>
        <Link
          href="/Client/reviews"
          className="nav-btn hover:text-orange-400 transition"
        >
          Reviews
        </Link>
        <Link
          href="/Client/contact"
          className="nav-btn hover:text-orange-400 transition"
        >
          Contact
        </Link>
        <Link
          href="/Client/account"
          className="nav-btn hover:text-orange-400 transition"
        >
          My Account
        </Link>

        {/* ✅ Dynamic Auth Button */}
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-4 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => router.push("/AuthScreen")}
            className="ml-4 bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
