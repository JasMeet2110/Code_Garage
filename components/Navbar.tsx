"use client";
 
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
 
export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
 
  return (
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