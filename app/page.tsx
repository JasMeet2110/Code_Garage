"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ---------------------- SERVICES DATA ---------------------- */
const SERVICES = [
  {
    img: "/services/oilchange.png",
    title: "Oil Change & Maintenance",
    text: "Keep your engine clean, cool, and running at peak efficiency.",
  },
  {
    img: "/services/brakeservice.png",
    title: "Brake Inspection & Repair",
    text: "Quiet, precise braking performance you can rely on in any condition.",
  },
  {
    img: "/services/tirechange.png",
    title: "Tire Services & Alignment",
    text: "Rotation, balancing, and alignment for maximum grip and safety.",
  },
  {
    img: "/services/oilchange.png",
    title: "Engine Diagnostics",
    text: "Modern diagnostic tools to pinpoint issues before they become problems.",
  },
  {
    img: "/services/brakeservice.png",
    title: "Battery & Electrical",
    text: "Reliable starts and stable power for all your vehicle systems.",
  },
];

export default function Home() {
  const [serviceIndex, setServiceIndex] = useState(0);

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setServiceIndex((prev) => (prev + 1) % SERVICES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();

        const sorted = [...data]
          .sort(
            (a, b) =>
              b.rating - a.rating ||
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5); 

        setReviews(sorted);
      } catch (e) {
        console.error("Review load error:", e);
      }
    }

    loadReviews();
  }, []);

  /* Auto-Rotate Reviews */
  useEffect(() => {
    if (reviews.length === 0) return;

    const id = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);

    return () => clearInterval(id);
  }, [reviews]);

  const currentService = SERVICES[serviceIndex];

  return (
    <div className="relative text-white min-h-screen">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/mustangrtr.png"
          alt="Background"
          fill
          priority
          className="object-cover brightness-[0.20] scale-105"
        />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -left-10 h-64 w-64 bg-orange-500/25 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 bg-sky-500/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative h-[850px] flex items-center justify-center text-center">
        <div className="relative z-10 px-6 max-w-5xl mx-auto">

          <p className="tracking-[0.3em] uppercase text-xs md:text-sm text-gray-300 mb-4">
            Alberta · Full-Service Auto Care
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-2xl">
            Trackside <span className="text-orange-500">Garage</span>
            <br />
            Precision Care For Every Ride.
          </h1>

          <p className="mt-6 text-gray-200 text-base md:text-lg max-w-2xl mx-auto">
            From daily drivers to weekend builds, we keep your vehicle sharp, safe,
            and road-ready with transparent service and performance-level attention to detail.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/Client/book-appointment"
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-[0_0_30px_rgba(249,115,22,0.6)]
              hover:bg-orange-600 hover:scale-105 transition-all duration-200"
            >
              Book Appointment
            </Link>

            <Link
              href="/Client/services"
              className="border border-white/40 text-white px-8 py-3 rounded-full font-semibold text-lg
              hover:bg-white/10 hover:scale-105 transition-all duration-200"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-16 px-6 md:px-10 bg-black/40 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-center">

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-400">
              Built For Drivers Who Actually Care.
            </h2>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Trackside Garage combines certified expertise with a performance mindset.
            </p>

            <ul className="text-gray-300 text-sm md:text-base space-y-2">
              <li>• Licensed mechanics.</li>
              <li>• Transparent estimates.</li>
              <li>• Same-day service available.</li>
              <li>• All makes & models.</li>
            </ul>
          </div>

          <div className="relative h-60 md:h-72 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-orange-500/10 to-sky-500/10">
            <Image
              src="/background/garageinside.png"
              alt="Garage Interior"
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-4 left-4 text-sm text-gray-100">
              <p className="font-semibold text-lg">Trusted by Alberta drivers</p>
              <p className="text-xs text-gray-300">
                Hundreds of vehicles serviced every season.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES CAROUSEL */}
      <section className="py-16 px-6 md:px-10 bg-black/40 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-5xl mx-auto text-center">

          <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2">
            Our Popular Services
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">
            Dialed-In Maintenance & Repair.
          </h2>

          <p className="text-gray-300 text-sm md:text-base mb-10 max-w-2xl mx-auto">
            From oil changes to diagnostics — tuned for real-world driving.
          </p>

          <div className="relative max-w-xl mx-auto">

            {/* Card */}
            <div className="bg-neutral-900/70 border border-neutral-700/80 rounded-2xl shadow-2xl 
              overflow-hidden flex flex-col md:flex-row">

              <div className="relative w-full md:w-1/2 h-52 md:h-64">
                <Image
                  src={currentService.img}
                  alt={currentService.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-center text-left">
                <h3 className="text-2xl font-semibold mb-3 text-orange-300">
                  {currentService.title}
                </h3>

                <p className="text-gray-300 text-sm md:text-base mb-4">
                  {currentService.text}
                </p>

                <Link
                  href="/Client/services"
                  className="inline-block text-sm font-semibold text-orange-400 hover:text-orange-300"
                >
                  View service details →
                </Link>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() =>
                  setServiceIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length)
                }
                className="px-3 py-1 rounded-full border border-white/30 text-xs text-gray-200 hover:bg-white/10 transition-all"
              >
                ◀ Prev
              </button>

              <div className="flex gap-2">
                {SERVICES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setServiceIndex(idx)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      idx === serviceIndex ? "bg-orange-500 w-4" : "bg-gray-500/60"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setServiceIndex((prev) => (prev + 1) % SERVICES.length)
                }
                className="px-3 py-1 rounded-full border border-white/30 text-xs text-gray-200 hover:bg-white/10 transition-all"
              >
                Next ▶
              </button>
            </div>
          </div>

          <Link
            href="/Client/services"
            className="mt-10 inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 hover:scale-105 transition-transform"
          >
            Explore All Services
          </Link>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 px-6 md:px-10 bg-black/40 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-5xl mx-auto text-center">

          <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2">
            Real Feedback
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">
            What Drivers Are Saying.
          </h2>

          <p className="text-gray-300 text-sm md:text-base mb-10 max-w-2xl mx-auto">
            These are the top-rated experiences from our customers.
          </p>

          {/* IF NO REVIEWS */}
          {reviews.length === 0 ? (
            <p className="opacity-70 text-gray-400">No reviews yet.</p>
          ) : (
            <div className="relative max-w-xl mx-auto">
              <div className="bg-neutral-900/70 border border-neutral-700/80 rounded-2xl shadow-2xl 
                p-8 text-left min-h-[180px]">

                <p className="text-gray-200 text-sm md:text-base mb-4 break-words whitespace-normal">
                  “{reviews[reviewIndex]?.comment}”
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-orange-300">
                      {reviews[reviewIndex]?.name}
                    </p>

                    <p className="text-yellow-400 text-xs md:text-sm">
                      {"⭐".repeat(reviews[reviewIndex]?.rating || 0)}
                    </p>
                  </div>

                  <span className="text-xs text-gray-500">Verified Customer</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() =>
                    setReviewIndex((prev) =>
                      (prev - 1 + reviews.length) % reviews.length
                    )
                  }
                  className="px-3 py-1 rounded-full border border-white/30 text-xs text-gray-200 hover:bg-white/10 transition-all"
                >
                  ◀ Prev
                </button>

                <div className="flex gap-2">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReviewIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        idx === reviewIndex ? "bg-orange-500 w-4" : "bg-gray-500/60"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setReviewIndex((prev) => (prev + 1) % reviews.length)
                  }
                  className="px-3 py-1 rounded-full border border-white/30 text-xs text-gray-200 hover:bg-white/10 transition-all"
                >
                  Next ▶
                </button>
              </div>
            </div>
          )}

          <Link
            href="/Client/reviews"
            className="mt-10 inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 hover:scale-105 transition-transform"
          >
            Leave a Review
          </Link>
        </div>
      </section>
    </div>
  );
}
