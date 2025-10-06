"use client";
import React, { useState, useEffect } from "react";
import AdminNavbar from "@/components/AdminSidebar";
import AdminFooter from "@/components/AdminShell";

// Interface for new employee data (without ID)
interface NewEmployeeData {
  name: string;
  position: string;
  phone: string;
  email: string;
  salary: number;
  startDate: string;
}

// Interface for complete employee (with ID) - Frontend format
interface Employee {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  salary: number;
  startDate: string;
}

// Database format (snake_case)
interface EmployeeDB {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  salary: string;
  start_date: string;
  created_at?: string;
  updated_at?: string;
}

const EmployeePage = () => {
  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  // Employee data state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employees');
      const result = await response.json();
      
      if (result.success) {
        const transformedData = result.data.map((emp: EmployeeDB) => ({
          id: emp.id,
          name: emp.name,
          position: emp.position,
          phone: emp.phone,
          email: emp.email,
          salary: parseFloat(emp.salary),
          startDate: formatDateForInput(emp.start_date),
        }));
        setEmployees(transformedData);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };
 
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
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [editEmployeeName, setEditEmployeeName] = useState("");
  const [editEmployeePosition, setEditEmployeePosition] = useState("");
  const [editEmployeePhone, setEditEmployeePhone] = useState("");
  const [editEmployeeEmail, setEditEmployeeEmail] = useState("");
  const [editEmployeeSalary, setEditEmployeeSalary] = useState("");
  const [editEmployeeStartDate, setEditEmployeeStartDate] = useState("");

  // Delete employee function
  const handleDeleteEmployee = async (employeeId: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const response = await fetch(`/api/employees?id=${employeeId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setEmployees(employees.filter((employee) => employee.id !== employeeId));
        alert('Employee deleted successfully');
      } else {
        alert(result.error || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Submit new employee function
  const handleSubmitNewEmployee = async () => {
    console.log('Form values:', {
      name: newEmployeeName,
      position: newEmployeePosition,
      phone: newEmployeePhone,
      email: newEmployeeEmail,
      salary: newEmployeeSalary,
      startDate: newEmployeeStartDate,
    });

    // Check each field individually
    if (!newEmployeeName || !newEmployeeName.trim()) {
      alert("Name is required");
      return;
    }
    if (!newEmployeePosition || !newEmployeePosition.trim()) {
      alert("Position is required");
      return;
    }
    if (!newEmployeePhone || !newEmployeePhone.trim()) {
      alert("Phone is required");
      return;
    }
    if (!newEmployeeEmail || !newEmployeeEmail.trim()) {
      alert("Email is required");
      return;
    }
    if (!newEmployeeSalary || !newEmployeeSalary.trim()) {
      alert("Salary is required");
      return;
    }
    if (!newEmployeeStartDate || !newEmployeeStartDate.trim()) {
      alert("Start date is required");
      return;
    }

    if (parseFloat(newEmployeeSalary) <= 0) {
      alert("Salary must be a positive number.");
      return;
    }

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newEmployeeName,
          position: newEmployeePosition,
          phone: newEmployeePhone,
          email: newEmployeeEmail,
          salary: parseFloat(newEmployeeSalary),
          start_date: newEmployeeStartDate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchEmployees();
        
        setNewEmployeeName("");
        setNewEmployeePosition("");
        setNewEmployeePhone("");
        setNewEmployeeEmail("");
        setNewEmployeeSalary("");
        setNewEmployeeStartDate("");
        setShowAddForm(false);
        
        alert('Employee added successfully');
      } else {
        alert(result.error || 'Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee');
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditEmployeeName(employee.name);
    setEditEmployeePosition(employee.position);
    setEditEmployeePhone(employee.phone);
    setEditEmployeeEmail(employee.email);
    setEditEmployeeSalary(employee.salary.toString());
    setEditEmployeeStartDate(formatDateForInput(employee.startDate));

    setEditingEmployeeId(employee.id);
    setShowEditForm(true);
  };

  const handleSaveChanges = async () => {
    if (editingEmployeeId === null) {
      return;
    }

    console.log('Edit form values:', {
      id: editingEmployeeId,
      name: editEmployeeName,
      position: editEmployeePosition,
      phone: editEmployeePhone,
      email: editEmployeeEmail,
      salary: editEmployeeSalary,
      startDate: editEmployeeStartDate,
    });

    // Check each field individually
    if (!editEmployeeName || !editEmployeeName.trim()) {
      alert("Name is required");
      return;
    }
    if (!editEmployeePosition || !editEmployeePosition.trim()) {
      alert("Position is required");
      return;
    }
    if (!editEmployeePhone || !editEmployeePhone.trim()) {
      alert("Phone is required");
      return;
    }
    if (!editEmployeeEmail || !editEmployeeEmail.trim()) {
      alert("Email is required");
      return;
    }
    if (!editEmployeeSalary || !editEmployeeSalary.trim()) {
      alert("Salary is required");
      return;
    }
    if (!editEmployeeStartDate || !editEmployeeStartDate.trim()) {
      alert("Start date is required");
      return;
    }

    if (parseFloat(editEmployeeSalary) <= 0) {
      alert("Salary must be a positive number.");
      return;
    }

    try {
      const response = await fetch('/api/employees', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingEmployeeId,
          name: editEmployeeName,
          position: editEmployeePosition,
          phone: editEmployeePhone,
          email: editEmployeeEmail,
          salary: parseFloat(editEmployeeSalary),
          start_date: editEmployeeStartDate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchEmployees();
        
        setEditEmployeeName("");
        setEditEmployeePosition("");
        setEditEmployeePhone("");
        setEditEmployeeEmail("");
        setEditEmployeeSalary("");
        setEditEmployeeStartDate("");
        setEditingEmployeeId(null);
        setShowEditForm(false);
        
        alert('Employee updated successfully');
      } else {
        alert(result.error || 'Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee');
    }
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
              type="button"
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
                      type="button"
                      onClick={() => handleEditEmployee(employee)}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
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
                  type="number"
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
                  type="button"
                  onClick={handleSubmitNewEmployee}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                >
                  Add Employee
                </button>
                <button
                  type="button"
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
                  type="email"
                  placeholder="Email"
                  value={editEmployeeEmail}
                  onChange={(e) => setEditEmployeeEmail(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
                <input
                  type="number"
                  placeholder="Salary"
                  value={editEmployeeSalary}
                  onChange={(e) => setEditEmployeeSalary(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
                <input
                  type="date"
                  placeholder="Start Date"
                  value={editEmployeeStartDate}
                  onChange={(e) => setEditEmployeeStartDate(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
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
      <AdminFooter>{null}</AdminFooter>
    </div>
  );
};

export default EmployeePage;
