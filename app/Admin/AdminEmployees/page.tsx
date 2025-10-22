"use client";
import React, { useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

interface NewEmployeeData {
  name: string;
  position: string;
  phone: string;
  email: string;
  salary: number;
  startDate: string;
}

interface Employee extends NewEmployeeData {
  id: number;
}

const EmployeePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "John Smith",
      position: "Senior Mechanic",
      phone: "(555) 123-4567",
      email: "john.smith@sunrise.com",
      salary: 55000,
      startDate: "2022-03-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "Shop Manager",
      phone: "(555) 234-5678",
      email: "sarah.johnson@sunrise.com",
      salary: 65000,
      startDate: "2021-08-10",
    },
    {
      id: 3,
      name: "Mike Davis",
      position: "Junior Mechanic",
      phone: "(555) 345-6789",
      email: "mike.davis@sunrise.com",
      salary: 42000,
      startDate: "2023-01-20",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Add Employee
  const handleAddEmployee = (data: NewEmployeeData) => {
    setEmployees((prev) => [...prev, { id: prev.length + 1, ...data }]);
  };

  const handleSubmitNewEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newEmp: NewEmployeeData = {
      name: fd.get("name")?.toString().trim() || "",
      position: fd.get("position")?.toString().trim() || "",
      phone: fd.get("phone")?.toString().trim() || "",
      email: fd.get("email")?.toString().trim() || "",
      salary: Number(fd.get("salary")),
      startDate: fd.get("startDate")?.toString().trim() || "",
    };

    if (!newEmp.name || !newEmp.position || !newEmp.phone || !newEmp.email || !newEmp.salary || !newEmp.startDate) {
      alert("Please fill all fields.");
      return;
    }
    if (newEmp.salary <= 0) {
      alert("Salary must be a positive number.");
      return;
    }

    handleAddEmployee(newEmp);
    form.reset();
    setShowAddForm(false);
  };

  // Edit
  const handleEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setShowEditForm(true);
  };

  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEmployee) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingEmployee,
      name: fd.get("name")?.toString().trim() || "",
      position: fd.get("position")?.toString().trim() || "",
      phone: fd.get("phone")?.toString().trim() || "",
      email: fd.get("email")?.toString().trim() || "",
      salary: Number(fd.get("salary")),
      startDate: fd.get("startDate")?.toString().trim() || "",
    };

    setEmployees((prev) => prev.map((emp) => (emp.id === editingEmployee.id ? updated : emp)));
    setEditingEmployee(null);
    setShowEditForm(false);
  };

  // Delete
  const handleDeleteEmployee = (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Search
  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      {/* Background */}
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

      {/* Main */}
      <main className="ml-72 flex-1 p-10 relative z-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold text-orange-400 mb-8 drop-shadow-md">
            Employee Management
          </h1>

          {/* Search + Add */}
          <div className="flex justify-between items-center mb-8">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold shadow-md transition-all"
            >
              + Add New Employee
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form
              onSubmit={handleSubmitNewEmployee}
              className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Add New Employee
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="name" placeholder="Full Name" className="glass-input" />
                <input name="position" placeholder="Position" className="glass-input" />
                <input name="phone" placeholder="Phone Number" className="glass-input" />
                <input name="email" placeholder="Email Address" className="glass-input" />
                <input name="salary" type="number" placeholder="Annual Salary" className="glass-input" />
                <input name="startDate" type="date" className="glass-input" />
              </div>
              <div className="mt-4 flex gap-4">
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold">
                  Add Employee
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Edit Form */}
          {showEditForm && editingEmployee && (
            <form
              onSubmit={handleSaveChanges}
              className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Edit Employee
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="name" defaultValue={editingEmployee.name} placeholder="Full Name" className="glass-input" />
                <input name="position" defaultValue={editingEmployee.position} placeholder="Position" className="glass-input" />
                <input name="phone" defaultValue={editingEmployee.phone} placeholder="Phone Number" className="glass-input" />
                <input name="email" defaultValue={editingEmployee.email} placeholder="Email Address" className="glass-input" />
                <input name="salary" type="number" defaultValue={editingEmployee.salary} placeholder="Salary" className="glass-input" />
                <input name="startDate" type="date" defaultValue={editingEmployee.startDate} className="glass-input" />
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

          {/* Employee Table */}
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
                      <td className="px-6 py-4 text-gray-300">${emp.salary.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-300">{emp.startDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEditEmployee(emp)} className="text-blue-400 hover:text-blue-300 mr-4">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-400 hover:text-red-300">
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

      {/* Styles */}
      <style jsx>{`
        .glass-input {
          @apply px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400;
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

export default EmployeePage;
