"use client";

import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/services";

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen text-white">
      {/* Fixed Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/service.png"
          alt="Background"
          fill
          priority
          className="object-cover brightness-30"
        />
      </div>

      {/* Page Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-20 backdrop-blur-sm">
        <h1 className="text-5xl font-bold text-orange-400 drop-shadow-lg mb-4">
          Our Services
        </h1>
        <p className="text-lg text-gray-300 mb-12 drop-shadow-md max-w-2xl">
          Professional car care solutions tailored for you.
        </p>

        {/* Glassy Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl">
          {SERVICES.map((service) => (
            <div
              key={service.slug}
              className="group bg-white/10 border border-white/10 backdrop-blur-xl text-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-2 hover:border-orange-400/60 hover:scale-105 p-6 flex flex-col items-center"
            >
              <Image
                src={service.image}
                alt={service.name}
                width={160}
                height={160}
                className="object-contain rounded-lg mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              />

              <h2 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors duration-200">
                {service.name}
              </h2>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {service.description}
              </p>

              <p className="mt-auto mb-3">
                Starting at:{" "}
                <span className="font-semibold text-orange-400">
                  ${service.price}
                </span>
              </p>

              <Link
                href={`/Client/services/${service.slug}`}
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-transform duration-200 hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
