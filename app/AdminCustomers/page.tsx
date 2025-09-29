"use client";
import React, { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminFooter from "@/components/AdminFooter";

// Interface for complete customer (with ID)
interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  carName: string;
  carPlate: string;
  startDate: string;
}

const CustomerPage = () => {
  // Customer data state
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "David Miller",
      phone: "(555) 678-1234",
      email: "david.miller@sunrise.com",
      carName: "Toyota Camry",
      carPlate: "ABC-123",
      startDate: "2023-05-20",
    },
    {
      id: 2,
      name: "Emma Wilson",
      phone: "(555) 987-6543",
      email: "emma.wilson@sunrise.com",
      carName: "Honda Civic",
      carPlate: "XYZ-789",
      startDate: "2022-11-02",
    },
  ]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerCarName, setNewCustomerCarName] = useState("");
  const [newCustomerCarPlate, setNewCustomerCarPlate] = useState("");
  const [newCustomerStartDate, setNewCustomerStartDate] = useState("");

  // Edit form state
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editCustomerPhone, setEditCustomerPhone] = useState("");
  const [editCustomerEmail, setEditCustomerEmail] = useState("");
  const [editCustomerCarName, setEditCustomerCarName] = useState("");
  const [editCustomerCarPlate, setEditCustomerCarPlate] = useState("");
  const [editCustomerStartDate, setEditCustomerStartDate] = useState("");

  // Delete customer function
  const handleDeleteCustomer = (customerId: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((customer) => customer.id !== customerId));
    }
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.carPlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Submit new customer function
  const handleSubmitNewCustomer = () => {
    if (
      !newCustomerName.trim() ||
      !newCustomerPhone.trim() ||
      !newCustomerEmail.trim() ||
      !newCustomerCarName.trim() ||
      !newCustomerCarPlate.trim() ||
      !newCustomerStartDate.trim()
    ) {
      alert("Please fill in all fields before adding a customer.");
      return;
    }

    const newCustomer = {
      id: customers.length + 1,
      name: newCustomerName,
      phone: newCustomerPhone,
      email: newCustomerEmail,
      carName: newCustomerCarName,
      carPlate: newCustomerCarPlate,
      startDate: newCustomerStartDate,
    };

    setCustomers([...customers, newCustomer]);

    // Clear form
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerEmail("");
    setNewCustomerCarName("");
    setNewCustomerCarPlate("");
    setNewCustomerStartDate("");
    setShowAddForm(false);
  };

  // Handle edit customer
  const handleEditCustomer = (customer: Customer) => {
    setEditCustomerName(customer.name);
    setEditCustomerPhone(customer.phone);
    setEditCustomerEmail(customer.email);
    setEditCustomerCarName(customer.carName);
    setEditCustomerCarPlate(customer.carPlate);
    setEditCustomerStartDate(customer.startDate);
    setEditingCustomerId(customer.id);
    setShowEditForm(true);
  };

  const handleSaveChanges = () => {
    if (editingCustomerId === null) return;

    if (
      !editCustomerName.trim() ||
      !editCustomerPhone.trim() ||
      !editCustomerEmail.trim() ||
      !editCustomerCarName.trim() ||
      !editCustomerCarPlate.trim() ||
      !editCustomerStartDate.trim()
    ) {
      alert("Please fill in all fields before saving changes.");
      return;
    }

    const updatedCustomer = {
      id: editingCustomerId,
      name: editCustomerName,
      phone: editCustomerPhone,
      email: editCustomerEmail,
      carName: editCustomerCarName,
      carPlate: editCustomerCarPlate,
      startDate: editCustomerStartDate,
    };

    setCustomers(
      customers.map((customer) =>
        customer.id === editingCustomerId ? updatedCustomer : customer
      )
    );

    setShowEditForm(false);
    setEditingCustomerId(null);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-900 text-white p-8 pt-[180px]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-500 mb-8">Customer Management</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
          >
            Add New Customer
          </button>
        </div>

        {/* Table */}
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-white">Name</th>
              <th className="px-6 py-3 text-left text-white">Phone</th>
              <th className="px-6 py-3 text-left text-white">Email</th>
              <th className="px-6 py-3 text-left text-white">Car</th>
              <th className="px-6 py-3 text-left text-white">Plate</th>
              <th className="px-6 py-3 text-right text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-600">
                <td className="px-6 py-4 text-white">{customer.name}</td>
                <td className="px-6 py-4 text-gray-400">{customer.phone}</td>
                <td className="px-6 py-4 text-gray-400">{customer.email}</td>
                <td className="px-6 py-4 text-gray-400">{customer.carName}</td>
                <td className="px-6 py-4 text-gray-400">{customer.carPlate}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="text-blue-400 hover:text-blue-300 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
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
            <h2 className="text-2xl font-bold text-orange-500 mb-4">Add New Customer</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newCustomerEmail}
                onChange={(e) => setNewCustomerEmail(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Car Name"
                value={newCustomerCarName}
                onChange={(e) => setNewCustomerCarName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Car Plate"
                value={newCustomerCarPlate}
                onChange={(e) => setNewCustomerCarPlate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={newCustomerStartDate}
                onChange={(e) => setNewCustomerStartDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSubmitNewCustomer}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Add Customer
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
            <h2 className="text-2xl font-bold text-orange-500 mb-4">Edit Customer</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={editCustomerName}
                onChange={(e) => setEditCustomerName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={editCustomerPhone}
                onChange={(e) => setEditCustomerPhone(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="email"
                placeholder="Email"
                value={editCustomerEmail}
                onChange={(e) => setEditCustomerEmail(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Car Name"
                value={editCustomerCarName}
                onChange={(e) => setEditCustomerCarName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Car Plate"
                value={editCustomerCarPlate}
                onChange={(e) => setEditCustomerCarPlate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={editCustomerStartDate}
                onChange={(e) => setEditCustomerStartDate(e.target.value)}
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

export default CustomerPage;
