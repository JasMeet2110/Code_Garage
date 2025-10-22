"use client";
import React, { useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

interface NewItemData {
  name: string;
  partNumber: string;
  quantity: number;
  price: number;
}

interface InventoryItem extends NewItemData {
  id: number;
}

const InventoryPage = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: 1, name: "Oil Filter", partNumber: "OF-1024", quantity: 100, price: 15.99 },
    { id: 2, name: "Brake Pads", partNumber: "BP-1025", quantity: 80, price: 50 },
    { id: 3, name: "Air Filter", partNumber: "AF-1026", quantity: 120, price: 10 },
    { id: 4, name: "Spark Plugs", partNumber: "SP-1027", quantity: 150, price: 8 },
    { id: 5, name: "Rotors", partNumber: "R-1028", quantity: 60, price: 45 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Add item
  const handleAddItem = (newItem: NewItemData) => {
    setInventoryItems((prev) => [
      ...prev,
      { id: prev.length + 1, ...newItem },
    ]);
  };

  const handleSubmitNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim() || "";
    const partNumber = formData.get("partNumber")?.toString().trim() || "";
    const quantity = Number(formData.get("quantity"));
    const price = Number(formData.get("price"));

    if (!name || !partNumber || !quantity || !price) {
      alert("Please fill in all fields correctly.");
      return;
    }

    handleAddItem({ name, partNumber, quantity, price });
    setShowAddForm(false);
    form.reset();
  };

  // Edit item
  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowEditForm(true);
  };

  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim() || "";
    const partNumber = formData.get("partNumber")?.toString().trim() || "";
    const quantity = Number(formData.get("quantity"));
    const price = Number(formData.get("price"));

    setInventoryItems((prev) =>
      prev.map((i) => (i.id === editingItem.id ? { ...i, name, partNumber, quantity, price } : i))
    );
    setShowEditForm(false);
    setEditingItem(null);
  };

  // Delete item
  const handleDeleteItem = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setInventoryItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Search
  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
            Inventory Management
          </h1>

          {/* Search and Add */}
          <div className="flex justify-between items-center mb-8">
            <input
              type="text"
              placeholder="Search by name or part number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold shadow-md transition-all"
            >
              + Add New Item
            </button>
          </div>

          {/* Add Item Form */}
          {showAddForm && (
            <form
              onSubmit={handleSubmitNewItem}
              className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Add New Item
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="name" placeholder="Part Name" className="glass-input" />
                <input name="partNumber" placeholder="Part Number" className="glass-input" />
                <input name="quantity" type="number" placeholder="Quantity" className="glass-input" />
                <input name="price" type="number" placeholder="Price" className="glass-input" />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold"
                >
                  Add Item
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

          {/* Edit Item Form */}
          {showEditForm && editingItem && (
            <form
              onSubmit={handleSaveChanges}
              className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Edit Item
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="name"
                  defaultValue={editingItem.name}
                  placeholder="Part Name"
                  className="glass-input"
                />
                <input
                  name="partNumber"
                  defaultValue={editingItem.partNumber}
                  placeholder="Part Number"
                  className="glass-input"
                />
                <input
                  name="quantity"
                  type="number"
                  defaultValue={editingItem.quantity}
                  placeholder="Quantity"
                  className="glass-input"
                />
                <input
                  name="price"
                  type="number"
                  defaultValue={editingItem.price}
                  placeholder="Price"
                  className="glass-input"
                />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Inventory Table */}
          <div className="overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <table className="min-w-full text-left">
              <thead className="bg-white/10 border-b border-white/20 text-orange-400">
                <tr>
                  <th className="px-6 py-3">Part Name</th>
                  <th className="px-6 py-3">Part Number</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-gray-400"
                    >
                      No items found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/10 hover:bg-white/10 transition-all"
                    >
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4 text-gray-300">{item.partNumber}</td>
                      <td className="px-6 py-4 text-gray-300">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-300">${item.price}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-blue-400 hover:text-blue-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
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

      {/* Custom Glass Input Class */}
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

export default InventoryPage;
