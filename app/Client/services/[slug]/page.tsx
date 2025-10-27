"use client";

import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SERVICES } from "@/data/services";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function ServicePage({ params }: Props) {
  const { slug } = React.use(params);

  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) return notFound();

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-white">
      {/* Background */}
      <Image
        src="/background/Garage.png"
        alt="Background"
        fill
        className="absolute inset-0 object-cover brightness-30"
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl my-5 px-6 py-16 bg-black/70 rounded-lg">
        <Image
          src={service.image}
          alt={service.name}
          width={300}
          height={300}
          className="mx-auto mb-6 object-contain"
        />

        <h1 className="text-4xl font-bold mb-4 text-orange-400">{service.name}</h1>
        <p className="text-lg text-gray-200 mb-6">{service.description}</p>

        <p className="text-xl font-semibold text-white mb-8">
          Starting at: ${service.price}
        </p>

        {service.why && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-orange-400 mb-2">
              Why it Matters
            </h2>
            <p className="text-gray-200">{service.why}</p>
          </div>
        )}

        {service.signs?.length ? (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-orange-400 mb-2">
              Common Signs You Need This Service
            </h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              {service.signs.map((sign, i) => (
                <li key={i}>{sign}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {service.process && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-orange-400 mb-2">
              Our Process
            </h2>
            <p className="text-gray-200">{service.process}</p>
          </div>
        )}

        <a
          href="/Client/book-appointment"
          className="mt-8 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
        >
          Book Now
        </a>
      </div>
    </div>
  );
}
