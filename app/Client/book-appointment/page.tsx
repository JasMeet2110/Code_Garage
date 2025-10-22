"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SERVICES = [
  { key: "ac_repair", name: "Car AC Repair" },
  { key: "alternator", name: "Alternator Repair" },
  { key: "brakes", name: "Brake Repair" },
  { key: "battery", name: "Car Battery Services" },
  { key: "cooling", name: "Cooling System" },
  { key: "diagnostics", name: "Auto Diagnostics" },
  { key: "drivetrain", name: "Drivetrain & Differential" },
  { key: "electrical", name: "Auto Electrical Repair" },
  { key: "engine", name: "Engine Repair" },
  { key: "general", name: "General Car Repair" },
  { key: "heater", name: "Heater Repair" },
  { key: "oil_change", name: "Oil Change & Maintenance" },
  { key: "starter", name: "Starter Repair" },
  { key: "suspension", name: "Suspension & Steering Repair" },
  { key: "tire", name: "Tire Services" },
  { key: "transmission", name: "Transmission Repair" },
  { key: "alignment", name: "Wheel Alignment" },
  { key: "other", name: "Other Services" },
];

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];

function generateSlots(dateISO: string) {
  if (!dateISO) return [];
  const base = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];
  const day = new Date(dateISO).getDate();
  return base.filter((_, i) => (i + day) % 5 !== 0);
}

export default function BookAppointmentPage() {
  const router = useRouter();

  const [service, setService] = useState("");
  const [fuel, setFuel] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [vehicle, setVehicle] = useState({
    customer_name: "",
    make: "",
    model: "",
    year: "",
    plate: "",
  });
  const [towing, setTowing] = useState(false);
  const [pickup, setPickup] = useState("");
  const [loading, setLoading] = useState(false);

  const slots = useMemo(() => generateSlots(date), [date]);

  const readyToConfirm =
    !!service &&
    !!fuel &&
    !!date &&
    !!slot &&
    vehicle.make.trim() &&
    vehicle.model.trim() &&
    vehicle.year.trim() &&
    vehicle.plate.trim() &&
    vehicle.customer_name.trim() &&
    (!towing || pickup.trim());

  // ✅ Function: Send appointment data to backend
  const handleConfirm = async () => {
    if (!readyToConfirm) return;
    setLoading(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: vehicle.customer_name,
          service_type: service,
          car_make: vehicle.make,
          car_model: vehicle.model,
          car_year: vehicle.year,
          plate_number: vehicle.plate,
          fuel_type: fuel,
          appointment_date: date, // or `${date} ${slot}:00`
          slot: slot,
          request_towing: towing,
          message: towing ? pickup : null,
          status: "Pending",
        }),
      });

      if (res.ok) {
        console.log("✅ Appointment saved!");
        router.push("/Client/book-appointment/confirmation");
      } else {
        const err = await res.json();
        alert(`Failed to book appointment: ${err.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Something went wrong while booking your appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/appointmentBackground.JPG"
          alt="Background"
          fill
          priority
          className="object-cover brightness-50"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-5xl font-bold text-orange-400 drop-shadow-lg mb-3">
            Book Your Appointment
          </h2>
          <p className="text-lg text-gray-200 drop-shadow-md">
            Choose a service, fill in your details, and confirm your visit.
          </p>
        </header>

        {/* Customer Info */}
        <section className="bg-gray-100/95 text-black rounded-xl shadow-lg p-6 mb-10">
          <h3 className="text-xl font-bold mb-4">Customer Details</h3>
          <label htmlFor="customer-name" className="block mb-2 font-semibold">
            Customer Name
          </label>
          <input
            id="customer-name"
            type="text"
            placeholder="Enter your name"
            className="w-full border p-3 rounded mb-6"
            value={vehicle.customer_name}
            onChange={(e) =>
              setVehicle({ ...vehicle, customer_name: e.target.value })
            }
          />

          <label htmlFor="service-select" className="block mb-2 font-semibold">
            Select Service
          </label>
          <select
            id="service-select"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="">-- Choose a service --</option>
            {SERVICES.map((s) => (
              <option key={s.key} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </section>

        {/* Vehicle & Fuel */}
        <section className="bg-gray-100/95 text-black rounded-xl shadow-lg p-6 mb-10">
          <h3 className="text-xl font-bold mb-4">Vehicle & Fuel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Fuel Type</label>
              <div className="flex flex-wrap gap-3">
                {FUEL_TYPES.map((t) => (
                  <button
                    key={t}
                    className={`px-4 py-2 rounded-lg border ${
                      fuel === t
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-gray-100 text-black border-gray-300"
                    }`}
                    onClick={() => setFuel(t)}
                    type="button"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Need Towing?</label>
              <div className="flex items-center gap-2">
                <input
                  id="towing"
                  type="checkbox"
                  checked={towing}
                  onChange={(e) => setTowing(e.target.checked)}
                />
                <label htmlFor="towing">Request towing</label>
              </div>
              {towing && (
                <input
                  placeholder="Pickup location (e.g., 123 Main St, Calgary)"
                  className="mt-3 w-full border p-2 rounded"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* Vehicle info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <input
              className="border p-2 rounded"
              placeholder="Make"
              value={vehicle.make}
              onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Model"
              value={vehicle.model}
              onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Year"
              value={vehicle.year}
              onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="License Plate"
              value={vehicle.plate}
              onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })}
            />
          </div>
        </section>

        {/* Date & Slot */}
        <section className="bg-white/90 text-black rounded-xl shadow-lg p-6 mb-10">
          <h3 className="text-xl font-bold mb-4">Pick Date & Time</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Available Slots</label>
              <div className="flex flex-wrap gap-2">
                {slots.length === 0 && (
                  <span className="text-gray-500">
                    Choose a date to view slots
                  </span>
                )}
                {slots.map((s) => (
                  <button
                    key={s}
                    className={`px-4 py-2 rounded-lg border ${
                      slot === s
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-gray-100 text-black border-gray-300"
                    }`}
                    onClick={() => setSlot(s)}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-white/95 text-black rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Summary</h3>
          <table className="w-full text-left">
            <tbody>
              <tr>
                <th className="pr-4 align-top font-semibold w-28">Service:</th>
                <td>{service || "—"}</td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-28">Fuel:</th>
                <td>{fuel || "—"}</td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-28">Date:</th>
                <td>{date || "—"}</td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-28">Time:</th>
                <td>{slot || "—"}</td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-28">Vehicle:</th>
                <td>
                  {[vehicle.make, vehicle.model, vehicle.year]
                    .filter(Boolean)
                    .join(" ") || "—"}
                  {vehicle.plate ? ` (${vehicle.plate})` : ""}
                </td>
              </tr>
              {towing && (
                <tr>
                  <th className="pr-4 align-top font-semibold w-28">
                    Towing pickup:
                  </th>
                  <td>{pickup || "—"}</td>
                </tr>
              )}
            </tbody>
          </table>

          <button
            className={`w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition mt-4 ${
              !readyToConfirm && "opacity-60 cursor-not-allowed"
            }`}
            disabled={!readyToConfirm || loading}
            onClick={handleConfirm}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </section>
      </div>
    </div>
  );
}
