"use client";
import React, { useState } from "react";


import AdminSidebar from "@/components/AdminSidebar";

interface Appointment {
  id: number;
  customerName: string;
  service: string;
  date: string;
  time: string;
  carName: string;
  carPlate: string;
  status: string;
}

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      customerName: "David Miller",
      service: "Basic Oil Change",
      date: "2025-09-15",
      time: "10:30",
      carName: "Toyota Camry",
      carPlate: "ABC-123",
      status: "Pending",
    },
    {
      id: 2,
      customerName: "Emma Wilson",
      service: "Full Maintenance",
      date: "2025-09-16",
      time: "14:00",
      carName: "Honda Civic",
      carPlate: "XYZ-789",
      status: "Confirmed",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);

  // Add form state
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newService, setNewService] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newCarName, setNewCarName] = useState("");
  const [newCarPlate, setNewCarPlate] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // Edit form state
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editService, setEditService] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editCarName, setEditCarName] = useState("");
  const [editCarPlate, setEditCarPlate] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // Filtered list
  const filteredAppointments = appointments.filter(
    (a) =>
      a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.carPlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAppointment = () => {
    const newAppointment = {
      id: appointments.length + 1,
      customerName: newCustomerName,
      service: newService,
      date: newDate,
      time: newTime,
      carName: newCarName,
      carPlate: newCarPlate,
      status: newStatus,
    };
    setAppointments([...appointments, newAppointment]);

    // clear form
    setNewCustomerName("");
    setNewService("");
    setNewDate("");
    setNewTime("");
    setNewCarName("");
    setNewCarPlate("");
    setNewStatus("");
    setShowAddForm(false);
  };

  const handleDeleteAppointment = (id: number) => {
    if (window.confirm("Delete this appointment?")) {
      setAppointments(appointments.filter((a) => a.id !== id));
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditCustomerName(appointment.customerName);
    setEditService(appointment.service);
    setEditDate(appointment.date);
    setEditTime(appointment.time);
    setEditCarName(appointment.carName);
    setEditCarPlate(appointment.carPlate);
    setEditStatus(appointment.status);
    setEditingAppointmentId(appointment.id);
    setShowEditForm(true);
  };

  const handleSaveChanges = () => {
    if (editingAppointmentId === null) return;

    const updated = {
      id: editingAppointmentId,
      customerName: editCustomerName,
      service: editService,
      date: editDate,
      time: editTime,
      carName: editCarName,
      carPlate: editCarPlate,
      status: editStatus,
    };

    setAppointments(
      appointments.map((a) =>
        a.id === editingAppointmentId ? updated : a
      )
    );

    setEditingAppointmentId(null);
    setShowEditForm(false);
  };

  return (
  
    
    <div className="min-h-screen bg-gray-900 text-white flex">
    {/* Left admin sidebar */}
    <AdminSidebar />

    {/* Page content */}
    <div className="flex-1 min-w-0 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">
          Appointments
        </h1>

        {/* Search + Add */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
          >
            Add Appointment
          </button>
        </div>

        {/* Table */}
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Service</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Car</th>
              <th className="px-6 py-3 text-left">Plate</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((a) => (
              <tr key={a.id} className="border-b border-gray-600">
                <td className="px-6 py-4">{a.customerName}</td>
                <td className="px-6 py-4 text-gray-400">{a.service}</td>
                <td className="px-6 py-4 text-gray-400">{a.date}</td>
                <td className="px-6 py-4 text-gray-400">{a.time}</td>
                <td className="px-6 py-4 text-gray-400">{a.carName}</td>
                <td className="px-6 py-4 text-gray-400">{a.carPlate}</td>
                <td className="px-6 py-4 text-gray-400">{a.status}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEditAppointment(a)}
                    className="text-blue-400 hover:text-blue-300 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(a.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Form */}
        {showAddForm && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Add Appointment
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="text"
                placeholder="Service"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="text"
                placeholder="Car Name"
                value={newCarName}
                onChange={(e) => setNewCarName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="text"
                placeholder="Car Plate"
                value={newCarPlate}
                onChange={(e) => setNewCarPlate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="text"
                placeholder="Status (Pending/Confirmed)"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleAddAppointment}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {showEditForm && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Edit Appointment
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={editCustomerName}
                onChange={(e) => setEditCustomerName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="text"
                placeholder="Service"
                value={editService}
                onChange={(e) => setEditService(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="text"
                placeholder="Car Name"
                value={editCarName}
                onChange={(e) => setEditCarName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="text"
                placeholder="Car Plate"
                value={editCarPlate}
                onChange={(e) => setEditCarPlate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
              <input
                type="text"
                placeholder="Status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSaveChanges}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditForm(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    
  </div>
  );
};

export default AdminAppointmentsPage;
