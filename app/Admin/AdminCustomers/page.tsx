"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  carName: string;
  carPlate: string;
  startDate?: string;
}

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // ✅ Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers", { cache: "no-store" });
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ✅ Add Customer
  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const newCustomer = {
      name: fd.get("name")?.toString(),
      phone: fd.get("phone")?.toString(),
      email: fd.get("email")?.toString(),
      carName: fd.get("carName")?.toString(),
      carPlate: fd.get("carPlate")?.toString(),
      startDate: new Date().toISOString().split("T")[0],
    };

    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    });

    if (res.ok) {
      fetchCustomers();
      setShowAddForm(false);
      e.currentTarget.reset();
    } else {
      alert("Failed to add customer.");
    }
  };

  // ✅ Edit Customer
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditForm(true);
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCustomer) return;

    const fd = new FormData(e.currentTarget);
    const updated = {
      name: fd.get("name")?.toString(),
      phone: fd.get("phone")?.toString(),
      email: fd.get("email")?.toString(),
      carName: fd.get("carName")?.toString(),
      carPlate: fd.get("carPlate")?.toString(),
      startDate: fd.get("startDate")?.toString(),
    };

    const res = await fetch(`/api/customers/${editingCustomer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      fetchCustomers();
      setShowEditForm(false);
      setEditingCustomer(null);
    } else {
      alert("Failed to update customer.");
    }
  };

  // ✅ Delete Customer
  const handleDeleteCustomer = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("Failed to delete customer.");
    }
  };

  // ✅ Search
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.carPlate.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-4xl font-bold text-orange-400 mb-8 drop-shadow-md">
            Customer Management
          </h1>

          <div className="flex justify-between items-center mb-8">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold shadow-md transition-all"
            >
              + Add New Customer
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddCustomer}
              className="mb-8 p-6 rounded-xl bg-white/10 border border-white/20 shadow-md"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Add New Customer
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="name" placeholder="Full Name" className="glass-input" />
                <input name="phone" placeholder="Phone Number" className="glass-input" />
                <input name="email" placeholder="Email Address" className="glass-input" />
                <input name="carName" placeholder="Car Model" className="glass-input" />
                <input name="carPlate" placeholder="License Plate" className="glass-input" />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold"
                >
                  Add Customer
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
          {showEditForm && editingCustomer && (
            <form
              onSubmit={handleSaveChanges}
              className="mb-8 p-6 rounded-xl bg-white/10 border border-white/20 shadow-md"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Edit Customer
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="name" defaultValue={editingCustomer.name} className="glass-input" />
                <input name="phone" defaultValue={editingCustomer.phone} className="glass-input" />
                <input name="email" defaultValue={editingCustomer.email} className="glass-input" />
                <input name="carName" defaultValue={editingCustomer.carName} className="glass-input" />
                <input name="carPlate" defaultValue={editingCustomer.carPlate} className="glass-input" />
                <input name="startDate" type="date" defaultValue={editingCustomer.startDate} className="glass-input" />
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

          {/* Customer Table */}
          <div className="overflow-x-auto rounded-xl bg-white/10 border border-white/20 shadow-lg">
            <table className="min-w-full text-left">
              <thead className="bg-white/10 border-b border-white/20 text-orange-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Car</th>
                  <th className="px-6 py-3">Plate</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-400">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className="border-b border-white/10 hover:bg-white/10">
                      <td className="px-6 py-4">{c.name}</td>
                      <td className="px-6 py-4">{c.phone}</td>
                      <td className="px-6 py-4">{c.email}</td>
                      <td className="px-6 py-4">{c.carName}</td>
                      <td className="px-6 py-4">{c.carPlate}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEditCustomer(c)} className="text-blue-400 hover:text-blue-300 mr-4">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteCustomer(c.id)} className="text-red-400 hover:text-red-300">
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
};

export default CustomerPage;
