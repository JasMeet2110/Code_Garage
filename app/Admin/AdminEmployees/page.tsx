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
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Fetch all employees
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

  // Add new employee
  const handleAddEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name")?.toString().trim() || "";
    const position = formData.get("position")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const salary = Number(formData.get("salary"));
    const startDate = formData.get("startDate")?.toString() || "";

    if (!name || !position || !phone || !email || !salary || !startDate) {
      alert("Please fill all fields correctly.");
      return;
    }

    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, position, phone, email, salary, startDate }),
    });

    if (res.ok) {
      await fetchEmployees();
      setShowAddForm(false);
      form.reset();
    } else {
      alert("Failed to add employee.");
    }
  };

  // Save edited employee
  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEmployee) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name")?.toString().trim() || "";
    const position = formData.get("position")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const salary = Number(formData.get("salary"));
    const startDate = formData.get("startDate")?.toString() || "";

    const res = await fetch("/api/employees", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingEmployee.id,
        name,
        position,
        phone,
        email,
        salary,
        startDate,
      }),
    });

    if (res.ok) {
      await fetchEmployees();
      setShowEditForm(false);
      setEditingEmployee(null);
    } else {
      alert("Failed to update employee.");
    }
  };

  // Delete employee
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      await fetch("/api/employees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchEmployees();
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

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10 relative z-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold text-orange-400 mb-8">
            Employee Management
          </h1>

          {/* Search + Add */}
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

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-400 mb-6">Loading employees...</p>
          )}

          {/* Add Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddEmployee}
              className="mb-8 p-6 rounded-xl bg-white/10 border border-white/20 shadow-md"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Add New Employee
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="name" placeholder="Name" className="glass-input" />
                <input name="position" placeholder="Position" className="glass-input" />
                <input name="phone" placeholder="Phone" className="glass-input" />
                <input name="email" placeholder="Email" type="email" className="glass-input" />
                <input name="salary" placeholder="Salary" type="number" className="glass-input" />
                <input name="startDate" type="date" className="glass-input" />
              </div>
              <div className="mt-4 flex gap-4">
                <button type="submit" className="bg-orange-500 px-6 py-2 rounded-lg">
                  Add Employee
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Edit Form */}
          {showEditForm && editingEmployee && (
            <form
              onSubmit={handleSaveChanges}
              className="mb-8 p-6 rounded-xl bg-white/10 border border-white/20 shadow-md"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Edit Employee
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="name" defaultValue={editingEmployee.name} className="glass-input" />
                <input name="position" defaultValue={editingEmployee.position} className="glass-input" />
                <input name="phone" defaultValue={editingEmployee.phone} className="glass-input" />
                <input name="email" defaultValue={editingEmployee.email} className="glass-input" />
                <input name="salary" type="number" defaultValue={editingEmployee.salary} className="glass-input" />
                <input name="startDate" type="date" defaultValue={editingEmployee.start_date} className="glass-input" />
              </div>
              <div className="mt-4 flex gap-4">
                <button type="submit" className="bg-orange-500 px-6 py-2 rounded-lg">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-600 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Employee Table */}
          <div className="overflow-x-auto rounded-xl bg-white/10 border border-white/20 shadow-lg">
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
                {filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-white/10 hover:bg-white/10">
                    <td className="px-6 py-4">{emp.name}</td>
                    <td className="px-6 py-4 text-gray-300">{emp.position}</td>
                    <td className="px-6 py-4 text-gray-300">{emp.phone}</td>
                    <td className="px-6 py-4 text-gray-300">{emp.email}</td>
                    <td className="px-6 py-4 text-gray-300">${emp.salary}</td>
                    <td className="px-6 py-4 text-gray-300">{new Date(emp.start_date).toISOString().split("T")[0]}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setEditingEmployee(emp);
                          setShowEditForm(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
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
