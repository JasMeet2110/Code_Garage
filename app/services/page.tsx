"use client";

import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/services";

export default function ServicesPage() {
  return (
    <div className="flex flex-col justify-center items-center text-center text-white">
      <Image
        src="/ServiceShop.png"
        alt="Background"
        fill
        className="object-cover min-h-[600px] -z-10 brightness-30"
      />

      <div className="h-10 bg-gradient-to-b from-brown-900 to-white/100 absolute bottom-0 left-0 w-full z-0"></div>

      <div className="relative z-10 max-w-7xl px-6 py-14">
        <h1 className="text-4xl font-bold text-orange-400 drop-shadow-lg">
          Our Services
        </h1>
        <p className="text-lg text-gray-200 mb-12 drop-shadow-md">
          Professional car care solutions tailored for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.slug}
              className="bg-gray-200 text-black rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-6 flex flex-col"
            >
              <div className="flex flex-col items-center mb-4">
                <h2 className="text-xl font-bold mb-2">{service.name}</h2>
                <Image
                  src={service.image}
                  alt={service.name}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>

              <p className="text-gray-500 mb-4 line-clamp-3">{service.description}</p>

              <p className="mt-auto mb-2">
                Starting at:{" "}
                <span className="font-semibold">${service.price}</span>
              </p>

              <div className="mt-auto">
                <Link
                  href={`/services/${service.slug}`}
                  className="block w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
