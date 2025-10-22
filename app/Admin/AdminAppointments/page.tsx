"use client";

import React, { useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

interface Appointment {
  id: number;
  customerName: string;
  vehicle: string;
  service: string;
  date: string;
  status: "Pending" | "In Progress" | "Completed";
}

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      customerName: "John Doe",
      vehicle: "Honda Civic 2018",
      service: "Oil Change",
      date: "2025-10-21",
      status: "Completed",
    },
    {
      id: 2,
      customerName: "Sarah Johnson",
      vehicle: "Ford F-150 2020",
      service: "Brake Inspection",
      date: "2025-10-23",
      status: "Pending",
    },
    {
      id: 3,
      customerName: "Raj Singh",
      vehicle: "Toyota Corolla 2017",
      service: "Engine Diagnostics",
      date: "2025-10-25",
      status: "In Progress",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Add new appointment
  const handleAddAppointment = (newAppt: Omit<Appointment, "id">) => {
    setAppointments((prev) => [
      ...prev,
      { id: prev.length + 1, ...newAppt },
    ]);
  };

  const handleSubmitNewAppt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const customerName = formData.get("customerName")?.toString().trim() || "";
    const vehicle = formData.get("vehicle")?.toString().trim() || "";
    const service = formData.get("service")?.toString().trim() || "";
    const date = formData.get("date")?.toString().trim() || "";
    const status = formData.get("status")?.toString().trim() as
      | "Pending"
      | "In Progress"
      | "Completed";

    if (!customerName || !vehicle || !service || !date) {
      alert("Please fill all fields.");
      return;
    }

    handleAddAppointment({ customerName, vehicle, service, date, status });
    setShowAddForm(false);
    form.reset();
  };

  // Edit appointment
  const handleEditAppt = (appt: Appointment) => {
    setEditingAppointment(appt);
    setShowEditForm(true);
  };

  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAppointment) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const updated = {
      ...editingAppointment,
      customerName: formData.get("customerName")?.toString().trim() || "",
      vehicle: formData.get("vehicle")?.toString().trim() || "",
      service: formData.get("service")?.toString().trim() || "",
      date: formData.get("date")?.toString().trim() || "",
      status: formData.get("status")?.toString() as
        | "Pending"
        | "In Progress"
        | "Completed",
    };

    setAppointments((prev) =>
      prev.map((a) => (a.id === editingAppointment.id ? updated : a))
    );
    setShowEditForm(false);
    setEditingAppointment(null);
  };

  const handleDeleteAppt = (id: number) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background/Admin.png"
          alt="Garage Background"
          fill
          priority
          className="object-cover brightness-[0.45] blur-sm"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10 relative z-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold text-orange-400 mb-8 drop-shadow-md">
            Appointments Management
          </h1>

          {/* Search + Add */}
          <div className="flex justify-between items-center mb-8">
            <input
              type="text"
              placeholder="Search by name, vehicle, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold shadow-md transition-all"
            >
              + Add Appointment
            </button>
          </div>

          {/* Add Appointment Form */}
          {showAddForm && (
            <form
              onSubmit={handleSubmitNewAppt}
              className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Add New Appointment
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="customerName" placeholder="Customer Name" className="glass-input" />
                <input name="vehicle" placeholder="Vehicle" className="glass-input" />
                <input name="service" placeholder="Service Type" className="glass-input" />
                <input name="date" type="date" className="glass-input" />
                <select name="status" className="glass-input">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="mt-4 flex gap-4">
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold">
                  Add Appointment
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Edit Appointment Form */}
          {showEditForm && editingAppointment && (
            <form
              onSubmit={handleSaveChanges}
              className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">Edit Appointment</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="customerName"
                  defaultValue={editingAppointment.customerName}
                  placeholder="Customer Name"
                  className="glass-input"
                />
                <input
                  name="vehicle"
                  defaultValue={editingAppointment.vehicle}
                  placeholder="Vehicle"
                  className="glass-input"
                />
                <input
                  name="service"
                  defaultValue={editingAppointment.service}
                  placeholder="Service Type"
                  className="glass-input"
                />
                <input
                  name="date"
                  type="date"
                  defaultValue={editingAppointment.date}
                  className="glass-input"
                />
                <select name="status" defaultValue={editingAppointment.status} className="glass-input">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="mt-4 flex gap-4">
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold">
                  Save Changes
                </button>
                <button type="button" onClick={() => setShowEditForm(false)} className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Appointments Table */}
          <div className="overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <table className="min-w-full text-left">
              <thead className="bg-white/10 border-b border-white/20 text-orange-400">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-400">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((a) => (
                    <tr key={a.id} className="border-b border-white/10 hover:bg-white/10 transition-all">
                      <td className="px-6 py-4">{a.customerName}</td>
                      <td className="px-6 py-4 text-gray-300">{a.vehicle}</td>
                      <td className="px-6 py-4 text-gray-300">{a.service}</td>
                      <td className="px-6 py-4 text-gray-300">{a.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            a.status === "Completed"
                              ? "bg-green-500/30 text-green-300"
                              : a.status === "In Progress"
                              ? "bg-yellow-500/30 text-yellow-300"
                              : "bg-red-500/30 text-red-300"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEditAppt(a)} className="text-blue-400 hover:text-blue-300 mr-4">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteAppt(a.id)} className="text-red-400 hover:text-red-300">
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

      {/* Custom Glass Input Class */}
      <style jsx>{`
        .glass-input {
          @apply px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400;
        }
        select.glass-input option {
          color: black;
          background-color: rgba(255, 255, 255, 0.9);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminAppointments;
