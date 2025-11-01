"use client";
import React, { useState, useEffect } from "react";
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
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch inventory from DB
  const fetchData = async () => {
    try {
      const res = await fetch("/api/inventory", { cache: "no-store" });
      const data = await res.json();
      setInventoryItems(data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete item (DELETE)
  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch("/api/inventory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemToDelete.id }),
      });
      if (res.ok) {
        await fetchData();
        setItemToDelete(null);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete item.");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // Search filter
  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      {/* Background Image */}
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

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-400 mb-4">
              Loading inventory...
            </p>
          )}

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Add New Item
              </h2>
              <FormFields
                mode="add"
                onSubmitSuccess={() => setShowAddForm(false)}
                fetchData={fetchData}
              />
            </div>
          )}

          {/* Edit Form */}
          {showEditForm && editingItem && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Edit Item
              </h2>
              <FormFields
                mode="edit"
                editingItem={editingItem}
                onSubmitSuccess={() => {
                  setShowEditForm(false);
                  setEditingItem(null);
                }}
                fetchData={fetchData}
              />
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-orange-400">
              Inventory Items ({filteredItems.length})
            </h2>
          </div>

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
                      <td className="px-6 py-4 text-gray-300">
                        {item.partNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        ${item.price}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowEditForm(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
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

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-semibold text-orange-400 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the item{" "}
              <span className="text-white font-semibold">
                {itemToDelete.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteItem}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => setItemToDelete(null)}
                className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .glass-input {
          @apply px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all;
        }
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
};

/* Inline Validation */
const FormFields = ({
  mode,
  editingItem,
  onSubmitSuccess,
  fetchData,
}: {
  mode: "add" | "edit";
  editingItem?: InventoryItem;
  onSubmitSuccess: () => void;
  fetchData: () => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    name: editingItem?.name || "",
    quantity: editingItem?.quantity?.toString() || "",
    partNumber: editingItem?.partNumber || "",
    price: editingItem?.price?.toString() || "",
  });

  const [errors, setErrors] = useState({
    name: "",
    quantity: "",
    partNumber: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", quantity: "", partNumber: "", price: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Part name is required.";
      valid = false;
    }
    if (!formData.partNumber.trim()) {
      newErrors.partNumber = "Part number is required.";
      valid = false;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0.";
      valid = false;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("/api/inventory", {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "add"
            ? {
                name: formData.name,
                partNumber: formData.partNumber,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
              }
            : {
                id: editingItem?.id,
                name: formData.name,
                partNumber: formData.partNumber,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
              }
        ),
      });

      if (res.ok) {
        await fetchData();
        onSubmitSuccess();
      } else {
        console.error("Error submitting form:", await res.json());
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fields = [
    { label: "Part Name", name: "name", type: "text" },
    { label: "Quantity", name: "quantity", type: "number" },
    { label: "Part Number", name: "partNumber", type: "text" },
    { label: "Price", name: "price", type: "number" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="block text-sm text-gray-300 mb-1">{field.label}</label>
          <input
            name={field.name}
            type={field.type}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                errors[field.name as keyof typeof errors] ? "border-red-500" : ""
              }`}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
          {errors[field.name as keyof typeof errors] && (
            <span className="text-red-400 text-xs mt-1 animate-fadeIn">
              {errors[field.name as keyof typeof errors]}
            </span>
          )}
        </div>
      ))}

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition-all"
        >
          {mode === "add" ? "Add Item" : "Save Changes"}
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

export default InventoryPage;