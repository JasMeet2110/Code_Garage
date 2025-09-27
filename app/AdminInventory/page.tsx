"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";


interface NewItemData {
  name: string;
  partNumber: string;
  quantity: number;
  price: number;
}
interface InventoryItem {
  id: number;
  name: string;
  partNumber: string;
  quantity: number;
  price: number;
}

const InventoryPage = () => {
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: "Oil Filter",
      partNumber: "OF-1024",
      quantity: 100,
      price: 15.99,
    },
    {
      id: 2,
      name: "Brake Pads",
      partNumber: "BP-1025",
      quantity: 100,
      price: 50,
    },
    {
      id: 3,
      name: "Air Filter",
      partNumber: "AF-1026",
      quantity: 100,
      price: 10,
    },
    {
      id: 4,
      name: "Spark Plugs",
      partNumber: "SP-1027",
      quantity: 100,
      price: 8,
    },
    { id: 5, name: "Rotors", partNumber: "R-1028", quantity: 100, price: 45 },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPartNumber, setNewItemPartNumber] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editItemName, setEditItemName] = useState("");
  const [editItemPartNumber, setEditItemPartNumber] = useState("");
  const [editItemQuantity, setEditItemQuantity] = useState("");
  const [editItemPrice, setEditItemPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setInventoryItems(inventoryItems.filter((item) => item.id !== itemId));
    }
  };

  const handleAddItem = (newItemData: NewItemData) => {
    const newItem = {
      id: inventoryItems.length + 1,
      name: newItemData.name,
      partNumber: newItemData.partNumber,
      quantity: newItemData.quantity,
      price: newItemData.price,
    };
    setInventoryItems([...inventoryItems, newItem]);
  };
  const handleSubmitNewItem = () => {
    // Validation - check if any field is empty
    if (
      !newItemName.trim() ||
      !newItemPartNumber.trim() ||
      !newItemQuantity.trim() ||
      !newItemPrice.trim()
    ) {
      alert("Please fill in all fields before adding an item.");
      return; // Stop the function if validation fails
    }

    // Additional validation - check if quantity and price are valid numbers
    if (parseInt(newItemQuantity) <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    if (parseFloat(newItemPrice) <= 0) {
      alert("Price must be a positive number.");
      return;
    }

    // Create the new item data object (only if validation passes)
    const newItemData = {
      name: newItemName,
      partNumber: newItemPartNumber,
      quantity: parseInt(newItemQuantity),
      price: parseFloat(newItemPrice),
    };

    // Add the item to inventory
    handleAddItem(newItemData);

    // Clear the form
    setNewItemName("");
    setNewItemPartNumber("");
    setNewItemQuantity("");
    setNewItemPrice("");

    // Hide the form
    setShowAddForm(false);
  };
  const handleEditItem = (item: InventoryItem) => {
    // Fill the edit form with the current item's data
    setEditItemName(item.name);
    setEditItemPartNumber(item.partNumber);
    setEditItemQuantity(item.quantity.toString());
    setEditItemPrice(item.price.toString());

    // Remember which item we're editing
    setEditingItemId(item.id);

    // Show the edit form
    setShowEditForm(true);
  };

  const handleSaveChanges = () => {
    // Safety check - make sure we have an item ID
    if (editingItemId === null) {
      return;
    }

    // Validation - check if any field is empty
    if (
      !editItemName.trim() ||
      !editItemPartNumber.trim() ||
      !editItemQuantity.trim() ||
      !editItemPrice.trim()
    ) {
      alert("Please fill in all fields before saving changes.");
      return;
    }

    // Additional validation - check if quantity and price are valid numbers
    if (parseInt(editItemQuantity) <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    if (parseFloat(editItemPrice) <= 0) {
      alert("Price must be a positive number.");
      return;
    }

    // Create the updated item (only if validation passes)
    const updatedItem = {
      id: editingItemId,
      name: editItemName,
      partNumber: editItemPartNumber,
      quantity: parseInt(editItemQuantity),
      price: parseFloat(editItemPrice),
    };

    // Update the inventory array
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === editingItemId ? updatedItem : item
      )
    );

    // Clear the edit form
    setEditItemName("");
    setEditItemPartNumber("");
    setEditItemQuantity("");
    setEditItemPrice("");
    setEditingItemId(null);

    // Hide the edit form
    setShowEditForm(false);
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
  
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Left admin sidebar */}
      <AdminSidebar />

      {/* Right content area */}
      <div className="flex-1 min-w-0 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-500 mb-8">
            Inventory Management
          </h1>
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
          >
            Add New Item
          </button>
        </div>

        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-white">Part Name</th>
              <th className="px-6 py-3 text-left text-white">Part Number</th>
              <th className="px-6 py-3 text-left text-white">Quantity</th>
              <th className="px-6 py-3 text-left text-white">Price</th>
              <th className="px-6 py-3 text-right text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-600">
                <td className="px-6 py-4 text-white">{item.name}</td>
                <td className="px-6 py-4 text-gray-400">{item.partNumber}</td>
                <td className="px-6 py-4 text-gray-400">{item.quantity}</td>
                <td className="px-6 py-4 text-gray-400">${item.price}</td>
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
            ))}
          </tbody>
        </table>

        {showAddForm && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Add New Item
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Part Name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Part Number"
                value={newItemPartNumber}
                onChange={(e) => setNewItemPartNumber(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSubmitNewItem}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Add Item
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
              Edit Item
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Part Name"
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Part Number"
                value={editItemPartNumber}
                onChange={(e) => setEditItemPartNumber(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={editItemQuantity}
                onChange={(e) => setEditItemQuantity(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="number"
                placeholder="Price"
                value={editItemPrice}
                onChange={(e) => setEditItemPrice(e.target.value)}
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
    
  </div>
  );
};

export default InventoryPage;
