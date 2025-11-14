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
<<<<<<< HEAD
      {/* Background */}
      <Image
        src="/background/Garage.png"
        alt="Background"
        fill
        className="absolute inset-0 object-cover brightness-30"
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl my-5 px-6 py-16 bg-black/70 rounded-lg">
=======

      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/garage.png"
          alt="Garage Background"
          fill
          priority
          className="object-cover object-center brightness-[0.3]"
        />
      </div>

      {/* Dark + Blur Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/70 backdrop-blur-sm"></div>

      {/* Glass Card */}
      <div className="relative z-10 max-w-3xl my-36 px-8 py-16 bg-black/40 border border-orange-500/40 rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-orange-500/80 hover:shadow-[0_0_25px_rgba(255,165,0,0.3)]">

>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
        <Image
          src={service.image}
          alt={service.name}
          width={300}
          height={300}
<<<<<<< HEAD
          className="mx-auto mb-6 object-contain"
        />

        <h1 className="text-4xl font-bold mb-4 text-orange-400">{service.name}</h1>
        <p className="text-lg text-gray-200 mb-6">{service.description}</p>

        <p className="text-xl font-semibold text-white mb-8">
          Starting at: ${service.price}
=======
          className="mx-auto mb-6 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        />

        <h1 className="text-4xl font-bold mb-4 text-orange-400 drop-shadow-lg">
          {service.name}
        </h1>

        <p className="text-lg text-gray-200 mb-6 leading-relaxed">
          {service.description}
        </p>

        <p className="text-xl font-semibold text-white mb-8">
          Starting at:{" "}
          <span className="text-orange-400">${service.price}</span>
>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
        </p>

        {service.why && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-orange-400 mb-2">
              Why it Matters
            </h2>
<<<<<<< HEAD
            <p className="text-gray-200">{service.why}</p>
=======
            <p className="text-gray-200 leading-relaxed">{service.why}</p>
>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
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
<<<<<<< HEAD
            <p className="text-gray-200">{service.process}</p>
=======
            <p className="text-gray-200 leading-relaxed">{service.process}</p>
>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
          </div>
        )}

        <a
          href="/Client/book-appointment"
<<<<<<< HEAD
          className="mt-8 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
=======
          className="mt-8 inline-block px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-transform hover:scale-105"
>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
        >
          Book Now
        </a>
      </div>
    </div>
  );
}
