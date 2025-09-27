"use client";

import Link from "next/link";

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
        </p>

        <Link
          href="/HomePage"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
