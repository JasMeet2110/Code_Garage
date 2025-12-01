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
  assigned_employee_id?: number | null;
  employee_name?: string | null;
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const [sortField, setSortField] = useState<"date" | "status" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);

  const [appointmentToCancel, setAppointmentToCancel] =
    useState<Appointment | null>(null);

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
      }
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

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
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.car_make.toLowerCase().includes(searchTerm.toLowerCase());

    const dateObj = new Date(a.appointment_date);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    const matchesMonth = filterMonth ? month === Number(filterMonth) : true;
    const matchesYear = filterYear ? year === Number(filterYear) : true;
    const matchesStatus = filterStatus ? a.status === filterStatus : true;

    return matchesSearch && matchesMonth && matchesYear && matchesStatus;
  });

  
  const toggleSort = (field: "date" | "status") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

    const sorted = [...filtered].sort((a, b) => {
      if (sortField === "date") {
        const d1 = new Date(a.appointment_date).getTime();
        const d2 = new Date(b.appointment_date).getTime();
        return sortOrder === "asc" ? d1 - d2 : d2 - d1;
      }

      if (sortField === "status") {
        const order = {
          "Pending": 1,
          "In Progress": 2,
          "Completed": 3,
          "Cancelled": 4
        } as const;

        return sortOrder === "asc"
          ? order[a.status] - order[b.status]
          : order[b.status] - order[a.status];
      }

      return 0;
    });

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
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

          <div className="flex flex-wrap gap-4 justify-between items-center mb-8">

            <input
              type="text"
              placeholder="Search by name, service, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <div className="flex gap-4">

              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("en", { month: "short" })}
                  </option>
                ))}
              </select>

              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              >
                <option value="">Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              >
                <option value="">Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold"
            >
              + Add Appointment
            </button>
          </div>

          {showAddForm && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Add New Appointment
              </h2>
              <AppointmentForm
                mode="add"
                onSubmitSuccess={() => setShowAddForm(false)}
                fetchAppointments={fetchAppointments}
              />
            </div>
          )}

          {editingAppointment && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Edit Appointment
              </h2>
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
              List of Appointments ({sorted.length})
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <table className="min-w-full text-left">
              <thead className="bg-white/10 border-b border-white/20 text-orange-400">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th
                    onClick={() => toggleSort("date")}
                    className="px-6 py-3 cursor-pointer select-none"
                  >
                    Date
                    {sortField === "date" && (sortOrder === "asc" ? " ↑" : " ↓")}
                  </th>

                  <th
                    onClick={() => toggleSort("status")}
                    className="px-6 py-3 cursor-pointer select-none"
                  >
                    Status
                    {sortField === "status" && (sortOrder === "asc" ? " ↑" : " ↓")}
                  </th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-6 text-center text-gray-400"
                    >
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  sorted.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-white/10 hover:bg-white/10 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">
                          {a.customer_name}
                        </div>
                        <div className="text-sm text-gray-300">{a.email}</div>
                        <div className="text-sm text-gray-400">{a.phone}</div>
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {a.service_type}
                        {a.employee_name && (
                          <div className="text-xs text-gray-400 mt-1">
                            Tech: {a.employee_name}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {a.car_make} {a.car_model} {a.car_year} (
                        {a.plate_number})
                        <div className="text-sm text-gray-400">
                          {a.fuel_type}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {new Date(a.appointment_date).toLocaleDateString()}
                        <div className="text-sm text-gray-400">
                          {a.appointment_time}
                        </div>
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

                      <td className="px-6 py-4 text-right space-x-4">
                        <button
                          onClick={() => setEditingAppointment(a)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>

                        {a.status === "Pending" && (
                          <>
                            <button
                              onClick={() => setAppointmentToDelete(a)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setAppointmentToCancel(a)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {a.status === "In Progress" && (
                          <>
                            <button
                              onClick={() => setAppointmentToDelete(a)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setAppointmentToCancel(a)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                (window.location.href = `/Admin/AdminAppointments/complete/${a.id}`)
                              }
                              className="text-yellow-300 hover:text-yellow-200"
                            >
                              Complete
                            </button>
                          </>
                        )}

                        {a.status === "Completed" && (
                          <>
                            <button
                              onClick={() =>
                                window.open(`/api/invoice/${a.id}`, "_blank")
                              }
                              className="text-green-400 hover:text-green-300"
                            >
                              Invoice
                            </button>
                          </>
                        )}

                        {a.status === "Cancelled" && (
                          <>
                            <button
                              onClick={() => setAppointmentToDelete(a)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </>
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

      {appointmentToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-semibold text-orange-400 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mb-6">
              Delete{" "}
              <span className="text-white font-semibold">
                {appointmentToDelete.customer_name}
              </span>
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

      {appointmentToCancel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-semibold text-orange-400 mb-3">
              Confirm Cancellation
            </h2>
            <p className="text-gray-300 mb-6">
              Cancel{" "}
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
                className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        select {
          color: white !important;
        }
        select option {
          color: black !important;
        }
      `}</style>

      <style jsx>{`
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

type AppointmentFormProps = {
  mode: "add" | "edit";
  editingAppointment?: Appointment | null;
  onSubmitSuccess: () => void;
  fetchAppointments: () => Promise<void>;
};

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  mode,
  editingAppointment,
  onSubmitSuccess,
  fetchAppointments,
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
    assigned_employee_id:
      editingAppointment?.assigned_employee_id != null
        ? String(editingAppointment.assigned_employee_id)
        : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (mode === "edit" && editingAppointment) {
      setFormData({
        customer_name: editingAppointment.customer_name,
        email: editingAppointment.email,
        phone: editingAppointment.phone,
        service_type: editingAppointment.service_type,
        fuel_type: editingAppointment.fuel_type,
        car_make: editingAppointment.car_make,
        car_model: editingAppointment.car_model,
        car_year: editingAppointment.car_year,
        plate_number: editingAppointment.plate_number,
        appointment_time: editingAppointment.appointment_time,
        appointment_date: editingAppointment.appointment_date?.slice(0, 10),
        description: editingAppointment.description,
        status: editingAppointment.status,
        assigned_employee_id:
          editingAppointment.assigned_employee_id != null
            ? String(editingAppointment.assigned_employee_id)
            : "",
      });
    }
  }, [editingAppointment, mode]);

  useEffect(() => {
    if (mode === "edit") {
      fetch("/api/employees")
        .then((res) => res.json())
        .then((data) => setEmployees(data || []))
        .catch((err) => console.error(err));
    }
  }, [mode]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.customer_name.trim()) e.customer_name = "Required";
    if (!formData.email.trim()) e.email = "Required";
    if (!formData.phone.trim()) e.phone = "Required";
    if (!formData.service_type.trim()) e.service_type = "Required";
    if (!formData.car_make.trim()) e.car_make = "Required";
    if (!formData.car_model.trim()) e.car_model = "Required";
    if (!formData.plate_number.trim()) e.plate_number = "Required";
    if (!formData.appointment_time.trim()) e.appointment_time = "Required";
    if (!formData.appointment_date.trim()) e.appointment_date = "Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let payload: any;

      if (mode === "add") {
        payload = {
          ...formData,
          status: "Pending",
          assigned_employee_id: null,
        };
      } else {
        const hasEmployee = !!formData.assigned_employee_id;
        let finalStatus = formData.status;

        if (hasEmployee && formData.status !== "Cancelled") {
          finalStatus = "In Progress";
        }

        payload = {
          id: editingAppointment?.id,
          ...formData,
          status: finalStatus,
          assigned_employee_id: formData.assigned_employee_id || null,
        };
      }

      const res = await fetch("/api/appointments", {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchAppointments();
        onSubmitSuccess();
      }
    } catch (err) {
      console.error(err);
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
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((f) => (
        <div key={f.name} className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">{f.label}</label>
          <input
            name={f.name}
            type={f.type || "text"}
            value={(formData as any)[f.name]}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              errors[f.name] ? "border-red-500" : ""
            }`}
          />
          {errors[f.name] && (
            <span className="text-red-400 text-xs mt-1">{errors[f.name]}</span>
          )}
        </div>
      ))}

      {mode === "edit" && (
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">
            Assigned Employee
          </label>
          <select
            name="assigned_employee_id"
            value={formData.assigned_employee_id}
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 focus:ring-2 focus:ring-orange-400"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} — {emp.position}
              </option>
            ))}
          </select>
        </div>
      )}

      {mode === "edit" && (
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 focus:ring-2 focus:ring-orange-400"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      )}

      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20"
        />
      </div>

      <div className="flex gap-4 mt-4">
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
