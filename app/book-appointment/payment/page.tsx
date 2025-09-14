"use client";

import Link from "next/link";

export default function PaymentPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Payment</h2>

        {/* payment form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Cardholder Name"
            className="w-full border p-3 rounded"
          />
          <input
            type="text"
            placeholder="Card Number"
            className="w-full border p-3 rounded"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              className="w-full border p-3 rounded"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-full border p-3 rounded"
            />
          </div>
          <input
            type="text"
            placeholder="Billing Address"
            className="w-full border p-3 rounded"
          />

          {/* confirmation */}
          <Link
            href="/book-appointment/confirmation"
            className="block bg-orange-500 text-white py-3 rounded-lg font-medium text-center hover:bg-orange-600 transition"
          >
            Pay & Confirm
          </Link>
        </form>
      </div>
      <div className="mt-10 text-black">
        <p>This is just a mockup. I had very less time to create this. Please give us some time to work better on some pages as they are not upto par yet.</p>
      </div>
    </main>
  );
}
