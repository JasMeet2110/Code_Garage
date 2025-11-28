"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

interface Appointment {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  service_type: string;
  car_make: string;
  car_model: string;
  car_year: string;
  plate_number: string;
  fuel_type: string;
  appointment_time: string;
  appointment_date: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  // cancel feature
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (Array.isArray(data)) setAppointments(data);
      else setAppointments([]);
    } catch (err) {
      console.error("Fetch failed:", err);
      setAppointments([]);
    }
  };

  // Delete appointment
  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    try {
      const res = await fetch("/api/appointments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appointmentToDelete.id }),
      });
      if (res.ok) {
        await fetchAppointments();
        setAppointmentToDelete(null);
      } else {
        console.error("Failed to delete appointment");
      }
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  // cancel feature
  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appointmentToCancel.id,
          status: "Cancelled",
        }),
      });

      if (res.ok) {
        await fetchAppointments();
        setAppointmentToCancel(null);
      } else {
        console.error("Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    }
  };

  const filtered = appointments.filter(
    (a) =>
      a.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.car_make?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-4xl font-bold text-orange-400 mb-8 drop-shadow-md">
            Appointments Management
          </h1>

          {/* Search + Add */}
          <div className="flex justify-between items-center mb-8">
            <input
              type="text"
              placeholder="Search by name, service, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold"
            >
              + Add Appointment
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">Add New Appointment</h2>
              <AppointmentForm
                mode="add"
                onSubmitSuccess={() => setShowAddForm(false)}
                fetchAppointments={fetchAppointments}
              />
            </div>
          )}

          {/* Edit Form */}
          {editingAppointment && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">Edit Appointment</h2>
              <AppointmentForm
                mode="edit"
                editingAppointment={editingAppointment}
                onSubmitSuccess={() => setEditingAppointment(null)}
                fetchAppointments={fetchAppointments}
              />
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-orange-400">
              List of Appointments ({filtered.length})
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <table className="min-w-full text-left">
              <thead className="bg-white/10 border-b border-white/20 text-orange-400">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-400">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-white/10 hover:bg-white/10 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{a.customer_name}</div>
                        <div className="text-sm text-gray-300">{a.email}</div>
                        <div className="text-sm text-gray-400">{a.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{a.service_type}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {a.car_make} {a.car_model} {a.car_year} ({a.plate_number})
                        <div className="text-sm text-gray-400">{a.fuel_type}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(a.appointment_date).toLocaleDateString()} 
                        <div className="text-sm text-gray-400">{a.appointment_time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            a.status === "Completed"
                              ? "bg-green-500/30 text-green-300"
                              : a.status === "In Progress"
                              ? "bg-yellow-500/30 text-yellow-300"
                              : a.status === "Cancelled"
                              ? "bg-red-500/30 text-red-300"
                              : "bg-orange-500/30 text-orange-300"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setEditingAppointment(a)}
                          className="text-blue-400 hover:text-blue-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setAppointmentToDelete(a)}
                          className="text-red-400 hover:text-red-300 mr-4"
                        >
                          Delete
                        </button>
                        {/* cancel feature */}
                        {a.status !== "Cancelled" && (
                          <button
                            onClick={() => setAppointmentToCancel(a)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {appointmentToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-semibold text-orange-400 mb-3">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">{appointmentToDelete.customer_name}</span>
              ’s appointment?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteAppointment}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => setAppointmentToDelete(null)}
                className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* cancel feature */}
      {appointmentToCancel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-semibold text-orange-400 mb-3">
              Confirm Cancellation
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel{" "}
              <span className="text-white font-semibold">
                {appointmentToCancel.customer_name}
              </span>
              ’s appointment?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmCancelAppointment}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold"
              >
                Cancel Appointment
              </button>
              <button
                onClick={() => setAppointmentToCancel(null)}
                className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .glass-input {
          @apply px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

/* Inline Validation */
const AppointmentForm = ({
  mode,
  editingAppointment,
  onSubmitSuccess,
  fetchAppointments,
}: {
  mode: "add" | "edit";
  editingAppointment?: Appointment;
  onSubmitSuccess: () => void;
  fetchAppointments: () => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    customer_name: editingAppointment?.customer_name || "",
    email: editingAppointment?.email || "",
    phone: editingAppointment?.phone || "",
    service_type: editingAppointment?.service_type || "",
    fuel_type: editingAppointment?.fuel_type || "",
    car_make: editingAppointment?.car_make || "",
    car_model: editingAppointment?.car_model || "",
    car_year: editingAppointment?.car_year || "",
    plate_number: editingAppointment?.plate_number || "",
    appointment_time: editingAppointment?.appointment_time || "",
    appointment_date: editingAppointment?.appointment_date?.slice(0, 10) || "",
    description: editingAppointment?.description || "",
    status: editingAppointment?.status || "Pending",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = "Customer name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.service_type.trim()) newErrors.service_type = "Service type is required.";
    if (!formData.car_make.trim()) newErrors.car_make = "Car make is required.";
    if (!formData.car_model.trim()) newErrors.car_model = "Car model is required.";
    if (!formData.plate_number.trim()) newErrors.plate_number = "Plate number is required.";
    if (!formData.appointment_time.trim()) newErrors.appointment_time = "Time is required.";
    if (!formData.appointment_date.trim()) newErrors.appointment_date = "Date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("/api/appointments", {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "add"
            ? formData
            : {
                id: editingAppointment?.id,
                ...formData,
              }
        ),
      });

      if (res.ok) {
        await fetchAppointments();
        onSubmitSuccess();
      } else {
        console.error("Error submitting form");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fields = [
    { label: "Customer Name", name: "customer_name" },
    { label: "Email", name: "email" },
    { label: "Phone", name: "phone" },
    { label: "Service Type", name: "service_type" },
    { label: "Fuel Type", name: "fuel_type" },
    { label: "Car Make", name: "car_make" },
    { label: "Car Model", name: "car_model" },
    { label: "Car Year", name: "car_year" },
    { label: "Plate Number", name: "plate_number" },
    { label: "Appointment Time", name: "appointment_time", type: "time" },
    { label: "Appointment Date", name: "appointment_date", type: "date" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((f) => (
        <div key={f.name} className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">{f.label}</label>
          <input
            name={f.name}
            type={f.type || "text"}
            value={formData[f.name as keyof typeof formData]}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-2 bg-black/40 text.white border border-white/20 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                errors[f.name] ? "border-red-500" : ""
              }`}
            placeholder={`Enter ${f.label.toLowerCase()}`}
          />
          {errors[f.name] && (
            <span className="text-red-400 text-xs mt-1 animate-fadeIn">{errors[f.name]}</span>
          )}
        </div>
      ))}

      {/* Status Dropdown */}
      <div className="flex flex-col relative">
        <label className="text-sm text-gray-300 mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-lg px-4 py-2 pr-10 bg-black/40 text-white border border-white/20 
            focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none transition-all"
        >
          <option className="bg-gray-900 text-white">Pending</option>
          <option className="bg-gray-900 text-yellow-300">In Progress</option>
          <option className="bg-gray-900 text-green-300">Completed</option>
          <option className="bg-gray-900 text-red-300">Cancelled</option>
        </select>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter issue description"
          className="w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
        />
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold"
        >
          {mode === "add" ? "Add Appointment" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onSubmitSuccess}
          className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
