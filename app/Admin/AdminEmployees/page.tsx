"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

interface Employee {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  salary: number;
  start_date: string;
}

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees", { cache: "no-store" });
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      const res = await fetch("/api/employees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: employeeToDelete.id }),
      });
      if (res.ok) {
        await fetchEmployees();
        setEmployeeToDelete(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-4xl font-bold text-orange-400 mb-8">Employee Management</h1>

          <div className="flex justify-between items-center mb-8">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold"
            >
              + Add Employee
            </button>
          </div>

          {loading && (
            <p className="text-center text-gray-400 mb-6">Loading employees...</p>
          )}

          {showAddForm && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Add New Employee
              </h2>
              <EmployeeForm
                mode="add"
                fetchEmployees={fetchEmployees}
                onSubmitSuccess={() => setShowAddForm(false)}
              />
            </div>
          )}

          {editingEmployee && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Edit Employee
              </h2>
              <EmployeeForm
                mode="edit"
                editingEmployee={editingEmployee}
                fetchEmployees={fetchEmployees}
                onSubmitSuccess={() => setEditingEmployee(null)}
              />
            </div>
          )}

          <div className="overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <table className="min-w-full text-left">
              <thead className="bg-white/10 border-b border-white/20 text-orange-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Position</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Salary</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-6 text-center text-gray-400">
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr key={emp.id} className="border-b border-white/10 hover:bg-white/10 transition-all">
                      <td className="px-6 py-4">{emp.name}</td>
                      <td className="px-6 py-4 text-gray-300">{emp.position}</td>
                      <td className="px-6 py-4 text-gray-300">{emp.phone}</td>
                      <td className="px-6 py-4 text-gray-300">{emp.email}</td>
                      <td className="px-6 py-4 text-gray-300">${emp.salary}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(emp.start_date).toISOString().split("T")[0]}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setEditingEmployee(emp)}
                          className="text-blue-400 hover:text-blue-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setEmployeeToDelete(emp)}
                          className="text-red-400 hover:text-red-300"
                        >
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

      {employeeToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-semibold text-orange-400 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove the person{" "}
              <span className="text-white font-semibold">
                {employeeToDelete.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteEmployee}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => setEmployeeToDelete(null)}
                className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

const EmployeeForm = ({
  mode,
  editingEmployee,
  onSubmitSuccess,
  fetchEmployees,
}: {
  mode: "add" | "edit";
  editingEmployee?: Employee;
  onSubmitSuccess: () => void;
  fetchEmployees: () => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    name: editingEmployee?.name || "",
    position: editingEmployee?.position || "",
    phone: editingEmployee?.phone || "",
    email: editingEmployee?.email || "",
    salary: editingEmployee?.salary?.toString() || "",
    startDate: editingEmployee?.start_date || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.position.trim()) newErrors.position = "Position is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.salary || Number(formData.salary) <= 0)
      newErrors.salary = "Enter a valid salary.";
    if (!formData.startDate.trim()) newErrors.startDate = "Start date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("/api/employees", {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "add"
            ? formData
            : {
                id: editingEmployee?.id,
                ...formData,
              }
        ),
      });
      if (res.ok) {
        await fetchEmployees();
        onSubmitSuccess();
      } else {
        console.error("Error submitting form");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Position", name: "position", type: "text" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Salary", name: "salary", type: "number" },
    { label: "Start Date", name: "startDate", type: "date" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((f) => (
        <div key={f.name} className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">{f.label}</label>
          <input
            name={f.name}
            type={f.type}
            value={formData[f.name as keyof typeof formData]}
            onChange={handleChange}
            placeholder={`Enter ${f.label.toLowerCase()}`}
            className={`w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
              errors[f.name] ? "border-red-500" : ""
            }`}
          />
          {errors[f.name] && (
            <span className="text-red-400 text-xs mt-1 animate-fadeIn">{errors[f.name]}</span>
          )}
        </div>
      ))}

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition-all"
        >
          {mode === "add" ? "Add Employee" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onSubmitSuccess}
          className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
