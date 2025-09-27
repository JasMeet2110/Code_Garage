"use client";

import Image from "next/image";

const SERVICES = [
  { name: "Car AC Repair", price: "120-350", image: "/services/AC.png" },
  { name: "Alternator Repair", price: "250-500", image: "/services/Alternator.png" },
  { name: "Brake Repair", price: "200-600", image: "/services/Brake.png" },
  { name: "Car Battery Services", price: "150-350", image: "/services/Battery.png" },
  { name: "Cooling System", price: "150-400", image: "/services/Cooling.png" },
  { name: "Auto Diagnostics", price: "50-150", image: "/services/AutoDiagnostics.png" },
  { name: "Drivetrain & Differential", price: "300-1000", image: "/services/Drivetrain.png" },
  { name: "Auto Electrical Repair", price: "200-700", image: "/services/Electrical.png" },
  { name: "Engine Repair", price: "300-2000", image: "/services/Engine.png" },
  { name: "General Car Repair", price: "100-400", image: "/services/General.png" },
  { name: "Heater Repair", price: "100-300", image: "/services/Heater.png" },
  { name: "Oil Change & Maintenance", price: "50-150", image: "/services/Oil.png" },
  { name: "Starter Repair", price: "100-300", image: "/services/Starter.png" },
  { name: "Suspension & Steering Repair", price: "150-400", image: "/services/Steering.png" },
  { name: "Tire Services", price: "80-200", image: "/services/Tire.png" },
  { name: "Transmission Repair", price: "200-1000", image: "/services/Transmission.png" },
  { name: "Wheel Alignment", price: "100-200", image: "/services/WheelAlignment.png" },
];

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center text-white">
      <Image
        src="/ServiceShop.png"
        alt="Background"
        fill
        className="absolute inset-0 object-cover brightness-30"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold mb-4 text-orange-400 drop-shadow-lg">
          Our Services
        </h1>
        <p className="text-lg text-gray-200 mb-12 drop-shadow-md">
          Professional car care solutions tailored for you.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="bg-white text-black rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-6 flex flex-col"
            >
              {/* Name with Image */}
              <div className=" flex flex-col items-center mb-4">
                <h2 className="text-xl font-bold mb-2">{service.name}</h2>
                <Image
                  src={service.image}
                  alt={service.name}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>

              <p className="text-gray-500 mb-4">
                High quality {service.name.toLowerCase()} service.
              </p>

              <p className="mt-auto mb-2">
                Starting at:{" "}
                <span className="font-semibold">${service.price}</span>
              </p>

              <div className="mt-auto">
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
