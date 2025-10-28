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
  appointment_date: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Fetch appointments on mount
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

  // add appointment
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: data.customer_name,
        email: data.email,
        phone: data.phone,
        service_type: data.service_type,
        fuel_type: data.fuel_type,
        car_make: data.car_make,
        car_model: data.car_model,
        car_year: data.car_year,
        plate_number: data.plate_number,
        appointment_date: data.appointment_date,
        description: data.description,
        status: data.status,
      }),
    });

    if (res.ok) {
      await fetchAppointments();
      setShowAddForm(false);
      form.reset();
    } else alert("Failed to add appointment");
  };

  // Edit appointment
  const handleEdit = (appt: Appointment) => setEditingAppointment(appt);

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAppointment) return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const res = await fetch("/api/appointments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingAppointment.id,
        ...data,
      }),
    });

    if (res.ok) {
      await fetchAppointments();
      setEditingAppointment(null);
    } else alert("Failed to update appointment");
  };

  // Delete appointment
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this appointment?")) return;
    const res = await fetch("/api/appointments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchAppointments();
  };

  // Filter search
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
          src="/background/Admin.png"
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
            <form
              onSubmit={handleAdd}
              className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Add New Appointment
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="customer_name" placeholder="Customer Name" className="glass-input" />
                <input name="email" placeholder="Email" className="glass-input" />
                <input name="phone" placeholder="Phone" className="glass-input" />
                <input name="service_type" placeholder="Service Type" className="glass-input" />
                <input name="fuel_type" placeholder="Fuel Type" className="glass-input" />
                <input name="car_make" placeholder="Car Make" className="glass-input" />
                <input name="car_model" placeholder="Car Model" className="glass-input" />
                <input name="car_year" placeholder="Year" className="glass-input" />
                <input name="plate_number" placeholder="Plate Number" className="glass-input" />
                <input name="appointment_date" type="date" className="glass-input" />
                <select name="status" className="glass-input">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                <textarea name="description" placeholder="Issue Description" className="glass-input" />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold"
                >
                  Add Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Edit Form */}
          {editingAppointment && (
            <form
              onSubmit={handleSaveEdit}
              className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">Edit Appointment</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="customer_name" defaultValue={editingAppointment.customer_name} className="glass-input" />
                <input name="email" defaultValue={editingAppointment.email} className="glass-input" />
                <input name="phone" defaultValue={editingAppointment.phone} className="glass-input" />
                <input name="service_type" defaultValue={editingAppointment.service_type} className="glass-input" />
                <input name="fuel_type" defaultValue={editingAppointment.fuel_type} className="glass-input" />
                <input name="car_make" defaultValue={editingAppointment.car_make} className="glass-input" />
                <input name="car_model" defaultValue={editingAppointment.car_model} className="glass-input" />
                <input name="car_year" defaultValue={editingAppointment.car_year} className="glass-input" />
                <input name="plate_number" defaultValue={editingAppointment.plate_number} className="glass-input" />
                <input
                  name="appointment_date"
                  type="date"
                  defaultValue={editingAppointment.appointment_date?.slice(0, 10)}
                  className="glass-input"
                />
                <select name="status" defaultValue={editingAppointment.status} className="glass-input">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                <textarea
                  name="description"
                  defaultValue={editingAppointment.description || ""}
                  className="glass-input"
                />
              </div>
              <div className="mt-4 flex gap-4">
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

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
                    <tr key={a.id} className="border-b border-white/10 hover:bg-white/10 transition-all">
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
                      <td className="px-6 py-4 text-gray-300">{new Date(a.appointment_date).toLocaleDateString()}</td>
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
                        <button onClick={() => handleEdit(a)} className="text-blue-400 hover:text-blue-300 mr-4">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-300">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style jsx>{`
        .glass-input {
          @apply px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400;
        }
      `}</style>
    </div>
  );
}
