"use client";

//imports for the booking page
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

//defines services and fuel types
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

//defines fuel types
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];

//main booking appointment page functions
export default function BookAppointmentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    make: "",
    model: "",
    year: "",
    plate: "",
    fuel: "",
    service: "",
    date: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // inline validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.customer_name.trim()) newErrors.customer_name = "Customer name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      newErrors.phone = "Enter a valid 10-digit number.";
    if (!form.service) newErrors.service = "Please select a service.";
    if (!form.fuel) newErrors.fuel = "Select fuel type.";
    if (!form.make.trim()) newErrors.make = "Car make required.";
    if (!form.model.trim()) newErrors.model = "Car model required.";
    if (!form.year.trim()) newErrors.year = "Car year required.";
    if (!form.plate.trim()) newErrors.plate = "License plate required.";
    if (!form.date) newErrors.date = "Select appointment date.";
    if (!form.description.trim()) newErrors.description = "Please describe the issue.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //handles confirmation of the booking
  const handleConfirm = async () => {
    if (!validate()) return;
    setLoading(true);

    //api calls to save appointment
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          email: form.email,
          phone: form.phone,
          service_type: form.service,
          fuel_type: form.fuel,
          car_make: form.make,
          car_model: form.model,
          car_year: form.year,
          plate_number: form.plate,
          appointment_date: form.date,
          description: form.description,
          status: "Pending",
        }),
      });

      //if successful, navigates to confirmation otherwise push an error
      if (res.ok) {
        router.push("/Client/book-appointment/confirmation");
      } else {
        const err = await res.json();
        setErrors({ api: err.error || "Failed to save appointment." });
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setErrors({ api: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  //handles the changes to the form
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  //ui output to the page
  return (
    <div className="relative min-h-screen text-white">
      {/* background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/appointmentbackground.jpg"
          alt="Background"
          fill
          priority
          className="object-cover brightness-[0.8] blur-[6px]"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* header */}
        <header className="text-center mb-12">
          <h2 className="text-5xl font-bold text-orange-400 drop-shadow-lg mb-3">
            Book Your Appointment
          </h2>
          <p className="text-lg text-gray-200 drop-shadow-md">
            Fill in your details to confirm your visit.
          </p>
        </header>

        {/* customer info */}
        <section className="group bg-black/40 backdrop-blur-xl border border-orange-500/40 text-white rounded-2xl shadow-2xl p-6 mb-10 transition-all hover:border-orange-500/70">
          <h3 className="text-xl font-bold mb-4 transition-colors duration-300 group-hover:text-orange-400">
            Customer Details
          </h3>
          {["customer_name", "email", "phone"].map((field) => (
            <div key={field} className="mb-5">
              <label className="block mb-1 font-semibold capitalize">
                {field.replace("_", " ")}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                placeholder={`Enter your ${field.replace("_", " ")}`}
                className={`w-full bg-white/10 text-white border p-3 rounded backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors[field] ? "border-red-500" : "border-white/20"
                }`}
                value={(form as any)[field]}
                onChange={(e) => handleChange(field, e.target.value)}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <label htmlFor="service-select" className="block mb-2 font-semibold">
            Select Service
          </label>
          <select
            id="service-select"
            value={form.service}
            onChange={(e) => handleChange("service", e.target.value)}
            className={`w-full bg-white/10 text-white border p-3 rounded backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              errors.service ? "border-red-500" : "border-white/20"
            }`}
          >
            <option value="">-- Choose a service --</option>
            {SERVICES.map((s) => (
              <option key={s.key} value={s.name} className="text-black">
                {s.name}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="text-red-500 text-sm mt-1">{errors.service}</p>
          )}
        </section>

        {/* vehicle info */}
        <section className="group bg-black/40 backdrop-blur-xl border border-orange-500/40 text-white rounded-2xl shadow-2xl p-6 mb-10 transition-all hover:border-orange-500/70">
          <h3 className="text-xl font-bold mb-4 transition-colors duration-300 group-hover:text-orange-400">
            Vehicle Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["make", "model", "year", "plate"].map((field) => (
              <div key={field}>
                <input
                  className={`bg-white/10 text-white border p-3 rounded w-full backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    errors[field] ? "border-red-500" : "border-white/20"
                  }`}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={(form as any)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          {/* fuel type */}
          <div className="mt-6">
            <label className="block mb-2 font-semibold">Fuel Type</label>
            <div className="flex flex-wrap gap-3">
              {FUEL_TYPES.map((t) => (
                <button
                  key={t}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    form.fuel === t
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                  onClick={() => handleChange("fuel", t)}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>
            {errors.fuel && (
              <p className="text-red-500 text-sm mt-1">{errors.fuel}</p>
            )}
          </div>
        </section>

        {/* date & description */}
        <section className="group bg-black/40 backdrop-blur-xl border border-orange-500/40 text-white rounded-2xl shadow-2xl p-6 mb-10 transition-all hover:border-orange-500/70">
          <h3 className="text-xl font-bold mb-4 transition-colors duration-300 group-hover:text-orange-400">
            Appointment Details
          </h3>
          <div className="mb-5">
            <label className="block mb-2 font-semibold">Date</label>
            <input
              type="date"
              className={`bg-white/10 text-white border p-3 rounded w-full backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.date ? "border-red-500" : "border-white/20"
              }`}
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <label className="block mb-2 font-semibold">
            Description of Issue
          </label>
          <textarea
            className={`w-full bg-white/10 text-white border p-3 rounded h-28 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              errors.description ? "border-red-500" : "border-white/20"
            }`}
            placeholder="Describe the issue briefly..."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </section>

        {/* summary */}
        <section className="group bg-black/40 backdrop-blur-xl border border-orange-500/40 text-white rounded-2xl shadow-2xl p-6 transition-all hover:border-orange-500/70">
          <h3 className="text-xl font-bold mb-4 transition-colors duration-300 group-hover:text-orange-400">
            Summary
          </h3>
          <table className="w-full text-left">
            <tbody>
              <tr>
                <th className="pr-4 align-top font-semibold w-36">Name:</th>
                <td>{form.customer_name || "—"}</td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-36">Email:</th>
                <td>{form.email || "—"}</td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-36">Phone:</th>
                <td>{form.phone || "—"}</td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-36">Service:</th>
                <td>{form.service || "—"}</td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-36">Vehicle:</th>
                <td>
                  {[form.make, form.model, form.year]
                    .filter(Boolean)
                    .join(" ") || "—"}{" "}
                  {form.plate ? `(${form.plate})` : ""}
                </td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-36">Fuel:</th>
                <td>{form.fuel || "—"}</td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-36">Date:</th>
                <td>{form.date || "—"}</td>
              </tr>
              <tr>
                <th className="pr-4 align-top font-semibold w-36">Issue:</th>
                <td>{form.description || "—"}</td>
              </tr>
            </tbody>
          </table>

          {errors.api && (
            <p className="text-red-600 text-sm mt-3 text-center">
              {errors.api}
            </p>
          )}

          <button
            className={`w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition mt-4 ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </section>
      </div>
    </div>
  );
}
