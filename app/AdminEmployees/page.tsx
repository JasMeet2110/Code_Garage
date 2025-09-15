"use client";
import React, { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminFooter from "@/components/AdminFooter";

// Interface for new employee data (without ID)
interface NewEmployeeData {
  name: string;
  position: string;
  phone: string;
  email: string;
  salary: number;
  startDate: string;
}

// Interface for complete employee (with ID)
interface Employee {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  salary: number;
  startDate: string;
}

const EmployeePage = () => {
  // Employee data state
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

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeePosition, setNewEmployeePosition] = useState("");
  const [newEmployeePhone, setNewEmployeePhone] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeeSalary, setNewEmployeeSalary] = useState("");
  const [newEmployeeStartDate, setNewEmployeeStartDate] = useState("");

  // Edit form state
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(
    null
  );
  const [editEmployeeName, setEditEmployeeName] = useState("");
  const [editEmployeePosition, setEditEmployeePosition] = useState("");
  const [editEmployeePhone, setEditEmployeePhone] = useState("");
  const [editEmployeeEmail, setEditEmployeeEmail] = useState("");
  const [editEmployeeSalary, setEditEmployeeSalary] = useState("");
  const [editEmployeeStartDate, setEditEmployeeStartDate] = useState("");

  // Delete employee function
  const handleDeleteEmployee = (employeeId: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((employee) => employee.id !== employeeId));
    }
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add employee function
  const handleAddEmployee = (newEmployeeData: NewEmployeeData) => {
    const newEmployee = {
      id: employees.length + 1,
      name: newEmployeeData.name,
      position: newEmployeeData.position,
      phone: newEmployeeData.phone,
      email: newEmployeeData.email,
      salary: newEmployeeData.salary,
      startDate: newEmployeeData.startDate,
    };
    setEmployees([...employees, newEmployee]);
  };

  // Submit new employee function
  const handleSubmitNewEmployee = () => {
    // Validation
    if (
      !newEmployeeName.trim() ||
      !newEmployeePosition.trim() ||
      !newEmployeePhone.trim() ||
      !newEmployeeEmail.trim() ||
      !newEmployeeSalary.trim() ||
      !newEmployeeStartDate.trim()
    ) {
      alert("Please fill in all fields before adding an employee.");
      return;
    }

    if (parseFloat(newEmployeeSalary) <= 0) {
      alert("Salary must be a positive number.");
      return;
    }

    // Create new employee
    const newEmployee = {
      id: employees.length + 1,
      name: newEmployeeName,
      position: newEmployeePosition,
      phone: newEmployeePhone,
      email: newEmployeeEmail,
      salary: parseFloat(newEmployeeSalary),
      startDate: newEmployeeStartDate,
    };

    setEmployees([...employees, newEmployee]);

    // Clear form
    setNewEmployeeName("");
    setNewEmployeePosition("");
    setNewEmployeePhone("");
    setNewEmployeeEmail("");
    setNewEmployeeSalary("");
    setNewEmployeeStartDate("");
    setShowAddForm(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    // Fill the edit form with current employee data
    setEditEmployeeName(employee.name);
    setEditEmployeePosition(employee.position);
    setEditEmployeePhone(employee.phone);
    setEditEmployeeEmail(employee.email);
    setEditEmployeeSalary(employee.salary.toString());
    setEditEmployeeStartDate(employee.startDate);

    // Remember which employee we're editing
    setEditingEmployeeId(employee.id);

    // Show the edit form
    setShowEditForm(true);
  };
  const handleSaveChanges = () => {
    if (editingEmployeeId === null) {
      return;
    }

    // Validation
    if (
      !editEmployeeName.trim() ||
      !editEmployeePosition.trim() ||
      !editEmployeePhone.trim() ||
      !editEmployeeEmail.trim() ||
      !editEmployeeSalary.trim() ||
      !editEmployeeStartDate.trim()
    ) {
      alert("Please fill in all fields before saving changes.");
      return;
    }

    if (parseFloat(editEmployeeSalary) <= 0) {
      alert("Salary must be a positive number.");
      return;
    }

    // Create updated employee
    const updatedEmployee = {
      id: editingEmployeeId,
      name: editEmployeeName,
      position: editEmployeePosition,
      phone: editEmployeePhone,
      email: editEmployeeEmail,
      salary: parseFloat(editEmployeeSalary),
      startDate: editEmployeeStartDate,
    };

    // Update the employee in the list
    setEmployees(
      employees.map((employee) =>
        employee.id === editingEmployeeId ? updatedEmployee : employee
      )
    );

    // Clear edit form
    setEditEmployeeName("");
    setEditEmployeePosition("");
    setEditEmployeePhone("");
    setEditEmployeeEmail("");
    setEditEmployeeSalary("");
    setEditEmployeeStartDate("");
    setEditingEmployeeId(null);
    setShowEditForm(false);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-900 text-white p-8 pt-[180px]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-500 mb-8">
            Employee Management
          </h1>
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
          >
            Add New Employee
          </button>
        </div>

        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-white">Name</th>
              <th className="px-6 py-3 text-left text-white">Position</th>
              <th className="px-6 py-3 text-left text-white">Phone</th>
              <th className="px-6 py-3 text-left text-white">Email</th>
              <th className="px-6 py-3 text-left text-white">Salary</th>
              <th className="px-6 py-3 text-right text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-600">
                <td className="px-6 py-4 text-white">{employee.name}</td>
                <td className="px-6 py-4 text-gray-400">{employee.position}</td>
                <td className="px-6 py-4 text-gray-400">{employee.phone}</td>
                <td className="px-6 py-4 text-gray-400">{employee.email}</td>
                <td className="px-6 py-4 text-gray-400">
                  ${employee.salary.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="text-blue-400 hover:text-blue-300 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showAddForm && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Add New Employee
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Position"
                value={newEmployeePosition}
                onChange={(e) => setNewEmployeePosition(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newEmployeePhone}
                onChange={(e) => setNewEmployeePhone(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newEmployeeEmail}
                onChange={(e) => setNewEmployeeEmail(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="number"
                placeholder="Annual Salary"
                value={newEmployeeSalary}
                onChange={(e) => setNewEmployeeSalary(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={newEmployeeStartDate}
                onChange={(e) => setNewEmployeeStartDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSubmitNewEmployee}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Add Employee
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
        {showEditForm && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Edit Employee
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={editEmployeeName}
                onChange={(e) => setEditEmployeeName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Position"
                value={editEmployeePosition}
                onChange={(e) => setEditEmployeePosition(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="number"
                placeholder="Phone Number"
                value={editEmployeePhone}
                onChange={(e) => setEditEmployeePhone(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Email"
                value={editEmployeeEmail}
                onChange={(e) => setEditEmployeeEmail(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="number"
                placeholder="Income"
                value={editEmployeeSalary}
                onChange={(e) => setEditEmployeeSalary(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="number"
                placeholder="Starting Date"
                value={editEmployeeStartDate}
                onChange={(e) => setEditEmployeeStartDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSaveChanges}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Save Changes
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
    <AdminFooter />
  </div>
  );
};

export default EmployeePage;
