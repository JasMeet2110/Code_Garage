"use client";

import Image from "next/image";

export default function ServicesPage() {
  return (
    <div className="relative h-[900px] flex flex-col justify-center items-center text-center text-white">
      <Image
        src="/ServiceShop.png"
        alt="Background"
        fill
        className="absolute inset-0 object-cover brightness-30"
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-400 drop-shadow-lg">
          Our Services
        </h1>
        <p className="text-lg text-gray-200 mb-12 drop-shadow-md">
          Professional car care solutions tailored for you.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Oil Change */}
          <div className="bg-white text-black rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-6">
            <h2 className="text-xl font-bold mb-2">Basic Oil Change</h2>
            <p className="text-sm text-gray-500 mb-4">Duration: 30–45 min</p>
            <ul className="text-left mb-6 space-y-2">
              <li>✔ Quality motor oil</li>
              <li>✔ Oil filter replacement</li>
              <li>✔ Fluid level check</li>
            </ul>
            <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition">
              $50–$80
            </button>
          </div>

          {/* Full Maintenance */}
          <div className="bg-white text-black rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-6">
            <h2 className="text-xl font-bold mb-2">Full Maintenance</h2>
            <p className="text-sm text-gray-500 mb-4">Duration: 2–3 hours</p>
            <ul className="text-left mb-6 space-y-2">
              <li>✔ Complete inspection</li>
              <li>✔ All filters</li>
              <li>✔ Brake system check</li>
              <li>✔ Battery test</li>
            </ul>
            <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition">
              $120
            </button>
          </div>
        </div>

        <div className="mt-10 text-gray-300">
            <p>more services coming soon in next phases of project :) ...</p>
        </div>
      </div>
    </div>
  );
}
