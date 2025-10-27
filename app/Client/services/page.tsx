"use client";

import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/services";

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/ServiceShop.png"
          alt="Background"
          fill
          priority
          className="object-cover brightness-50"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 backdrop-blur-sm">
        <h1 className="text-5xl font-bold text-orange-400 drop-shadow-lg mb-4">
          Our Services
        </h1>
        <p className="text-lg text-gray-200 mb-12 drop-shadow-md max-w-2xl">
          Professional car care solutions tailored for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl">
          {SERVICES.map((service) => (
            <div
              key={service.slug}
              className="bg-gray-100/90 text-black rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-6 flex flex-col backdrop-blur-md"
            >
              <div className="flex flex-col items-center mb-4">
                <h2 className="text-xl font-bold mb-2">{service.name}</h2>
                <Image
                  src={service.image}
                  alt={service.name}
                  width={200}
                  height={200}
                  className="object-contain rounded-lg"
                />
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>

              <p className="mt-auto mb-2">
                Starting at:{" "}
                <span className="font-semibold text-orange-600">
                  ${service.price}
                </span>
              </p>

              <div className="mt-auto">
                <Link
                  href={`/Client/services/${service.slug}`}
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
