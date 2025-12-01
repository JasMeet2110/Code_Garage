"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

type Appointment = {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  service_type: string;
  car_make: string;
  car_model: string;
  car_year: string;
  plate_number: string;
  fuel_type: string | null;
  appointment_time: string;
  appointment_date: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  employee_name?: string | null;
};

type InventoryItem = {
  id: number;
  name: string;
  part_number: string;
  price: number;
  quantity: number;
};

type PartRow = {
  partId: string;
  quantity: string;
};

export default function CompleteAppointmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [laborCost, setLaborCost] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [parts, setParts] = useState<PartRow[]>([{ partId: "", quantity: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/appointments?id=${id}`);
        const data = await res.json();
        if (!data) {
          setError("Appointment not found");
        } else {
          setAppointment(data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const res = await fetch("/api/inventory");
        const data = await res.json();
        setInventory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading inventory:", err);
      }
    };

    loadInventory();
  }, []);

  const handlePartChange = (index: number, field: keyof PartRow, value: string) => {
    setParts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addPartRow = () => {
    setParts((prev) => [...prev, { partId: "", quantity: "" }]);
  };

  const removePartRow = (index: number) => {
    setParts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;
    setError(null);
    setSuccess(null);

    const laborNum = Number(laborCost) || 0;
    const serviceNum = Number(serviceCharge) || 0;

    const preparedParts = parts
      .filter((p) => p.partId && p.quantity)
      .map((p) => ({
        partId: Number(p.partId),
        quantity: Number(p.quantity),
      }));

    try {
      setSaving(true);
      const res = await fetch("/api/appointments/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          laborCost: laborNum,
          serviceCharge: serviceNum,
          parts: preparedParts,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error(json);
        setError(json.error || "Failed to complete appointment");
      } else {
        setSuccess("Appointment marked as completed and invoice data saved.");
        setTimeout(() => {
          router.push("/Admin/AdminAppointments");
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading appointment...
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        {error || "Appointment not found."}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/admin.png"
          alt="Garage Background"
          fill
          priority
          className="object-cover brightness-[0.45] blur-sm"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <AdminSidebar />

      <main className="ml-72 flex-1 p-10 relative z-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-orange-400 drop-shadow-md">
              Complete Appointment -- # {appointment.customer_name}
            </h1>
            <button
              onClick={() => router.push("/Admin/AdminAppointments")}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
            >
              ← Back to Appointments
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/40 border border-white/15 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-orange-300 mb-2">
                Customer & Booking
              </h2>
              <p><span className="font-semibold">Name:</span> {appointment.customer_name}</p>
              <p><span className="font-semibold">Email:</span> {appointment.email}</p>
              <p><span className="font-semibold">Phone:</span> {appointment.phone}</p>
              <p className="mt-6">
                <span className="font-semibold">Service:</span> {appointment.service_type}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {appointment.appointment_date}{" "}
                <span className="font-semibold">Time:</span> {appointment.appointment_time}
              </p>
              {appointment.employee_name && (
                <p className="mt-6">
                  <span className="font-semibold">Assigned tech:</span>{" "}
                  {appointment.employee_name}
                </p>
              )}
            </div>

            <div className="bg-black/40 border border-white/15 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-orange-300 mb-2">
                Vehicle
              </h2>
              <p>
                <span className="font-semibold">Car:</span>{" "}
                {appointment.car_make} {appointment.car_model} ({appointment.car_year})
              </p>
              <p>
                <span className="font-semibold">Plate:</span>{" "}
                {appointment.plate_number}
              </p>
              <p>
                <span className="font-semibold">Fuel:</span>{" "}
                {appointment.fuel_type || "N/A"}
              </p>
              <p className="mt-8">
                <span className="font-semibold text-orange-400">Status:</span>{" "}
                {appointment.status}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/20 border border-red-400 px-4 py-2 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-green-500/20 border border-green-400 px-4 py-2 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Total Labor Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. 180"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Service Charge ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. 40 (diagnostic / shop fee)"
                />
              </div>
            </div>

            <div className="bg-black/30 border border-white/15 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-orange-300">
                  Parts Used
                </h2>
                <button
                  type="button"
                  onClick={addPartRow}
                  className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-sm"
                >
                  + Add Part
                </button>
              </div>

              {parts.length === 0 && (
                <p className="text-sm text-gray-400">
                  No parts added. You can still complete with just labor & service charge.
                </p>
              )}

              <div className="space-y-3">
                {parts.map((row, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-[2fr,1fr,auto] gap-3 items-center"
                  >
                    <select
                      value={row.partId}
                      onChange={(e) =>
                        handlePartChange(index, "partId", e.target.value)
                      }
                      className="rounded-lg px-3 py-2 bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="">-- Select Part --</option>
                      {inventory.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.part_number}) — ${item.price} ·
                          stock {item.quantity}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) =>
                        handlePartChange(index, "quantity", e.target.value)
                      }
                      className="rounded-lg px-3 py-2 bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Qty"
                    />

                    <button
                      type="button"
                      onClick={() => removePartRow(index)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => router.push("/Admin/AdminAppointments")}
                className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-semibold"
                disabled={saving}
              >
                {saving ? "Saving..." : "Finish & Save"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
