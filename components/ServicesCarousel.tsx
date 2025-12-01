"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

export default function ServicesCarousel() {
  const services = [
    {
      title: "Car AC Repair",
      img: "/services/AC.png",
      desc: "Expert A/C repair services for all vehicle makes and models.",
    },
    {
      title: "Alternator Repair",
      img: "/services/Alternator.png",
      desc: "Diagnose, repair, and replace alternators to keep your car powered.",
    },
    {
      title: "Brake Repair",
      img: "/services/Brake.png",
      desc: "Reliable brake inspection and repair to keep you safe on the road.",
    },
    {
      title: "Car Battery Services",
      img: "/services/Battery.png",
      desc: "Battery testing, replacement, and maintenance to keep you running.",
    },
    {
      title: "Cooling System Service",
      img: "/services/Cooling.png",
      desc: "Full cooling system checks to prevent engine overheating.",
    },
    {
      title: "Auto Diagnostics",
      img: "/services/AutoDiagnostics.png",
      desc: "Advanced diagnostics to quickly identify vehicle issues.",
    },
    {
      title: "Drivetrain & Differential Repair",
      img: "/services/Drivetrain.png",
      desc: "Repair services for drivetrain and differential systems.",
    },
    {
      title: "Auto Electrical Repair",
      img: "/services/Electrical.png",
      desc: "Fix electrical faults, wiring, and component issues.",
    },
    {
      title: "Engine Repair",
      img: "/services/Engine.png",
      desc: "Comprehensive engine diagnostics and repair services.",
    },
    {
      title: "General Car Repair",
      img: "/services/General.png",
      desc: "General repair services for a wide range of issues.",
    },
    {
      title: "Heater Repair",
      img: "/services/Heater.png",
      desc: "Keep your cabin warm with heater system diagnostics and repair.",
    },
    {
      title: "Oil Change",
      img: "/services/OilChange.png",
      desc: "Quick and reliable oil changes to protect your engine.",
    },
    {
      title: "Starter Repair",
      img: "/services/Starter.png",
      desc: "Starter inspection and repair to ensure smooth starts.",
    },
    {
      title: "Suspension & Steering Repair",
      img: "/services/Steering.png",
      desc: "Suspension and steering diagnostics and repairs for smooth rides.",
    },
    {
      title: "Tire Repair",
      img: "/services/Tire.png",
      desc: "Tire repair and maintenance to keep you safe on the road.",
    },
    {
      title: "Transmission Repair",
      img: "/services/Transmission.png",
      desc: "Transmission repair services for smooth gear shifting.",
    },
    {
      title: "Wheel Alignment",
      img: "/services/WheelAlignment.png",
      desc: "Professional wheel alignment to keep your vehicle driving straight.",
    },
  ];

  return (
    <div className="px-6">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        loop
        autoplay={{ delay: 2500 }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {services.map((service, i) => (
          <SwiperSlide key={i} className="flex">
            <div
              className="
                bg-black/40 
                backdrop-blur-md 
                border border-white/10 
                rounded-2xl 
                shadow-xl 
                overflow-hidden 
                hover:scale-105 
                transition-all 
                flex flex-col 
                h-[340px] 
                w-full
              "
            >
              <div className="h-48 w-full relative">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  className="object-cover opacity-90"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-orange-400">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
