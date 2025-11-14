"use client";

import Link from "next/link";
<<<<<<< HEAD

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for booking with Trackside Garage.  
          Your appointment details will be shared soon.
=======
import Image from "next/image";

export default function ConfirmationPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/account.jpg" 
          alt="Background"
          fill
          priority
          className="object-cover brightness blur-sm"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Center Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 max-w-lg w-[90%] text-center text-white animate-fadeIn">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
            <svg
              className="h-12 w-12 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold mb-4 text-green-400 drop-shadow-md">
          Booking Confirmed!
        </h2>

        <p className="text-gray-200 leading-relaxed mb-8 text-lg drop-shadow-sm">
          Thank you for booking with <span className="text-orange-400 font-semibold">Trackside Garage</span>.
          <br />
          Our team will review your appointment and contact you shortly.
>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
        </p>

        <Link
          href="/"
<<<<<<< HEAD
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
=======
          className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition-all"
>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
        >
          Back to Home
        </Link>
      </div>
<<<<<<< HEAD
=======

      {/* Animation Style */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
    </main>
  );
}
