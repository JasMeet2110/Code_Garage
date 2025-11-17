"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-28 backdrop-blur-xl bg-gradient-to-b from-black/70 to-gray-900/50 border-b border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] text-white flex justify-between items-center px-16 z-50">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-4"> {/* added homepage link to the logo */}
          <Image
            src="/logo/tracksidegarage.png"
            alt="Trackside Garage Logo"
            width={180}
            height={180}
            className="invert brightness-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
          />
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-3xl font-bold tracking-wide">Trackside</h1>
              <h1 className="text-3xl font-bold tracking-wide text-orange-500">Garage</h1>
            </div>
            <p className="text-md text-gray-300">
              Reliable Repairs. Built with Passion.
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 text-lg font-medium items-center">
          {[
            { href: "/", label: "Home" },
            { href: "/Client/services", label: "Services" },
            { href: "/Client/book-appointment", label: "Book" },
            { href: "/Client/reviews", label: "Reviews" },
            { href: "/Client/contact", label: "Contact" },
            { href: "/Client/account", label: "My Account" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-3 py-1 rounded-lg hover:text-orange-400 hover:bg-white/10 transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}

          {/* Auth Button */}
          {status === "loading" ? (
            <button
              disabled
              className="ml-4 bg-gray-500 px-5 py-2 rounded-lg font-semibold opacity-50 cursor-not-allowed"
            >
              Loading...
            </button>
          ) : session ? (
            <button
              onClick={() =>
                signOut({
                  callbackUrl: `${window.location.origin}/AuthScreen`,
                })
              }
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

      {/* Subtle Fade-In Animation */}
      <style jsx>{`
        nav {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
