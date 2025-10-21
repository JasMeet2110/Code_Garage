"use client";

import { useState } from "react";
import Image from "next/image";

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  make: string;
  model: string;
  year: string;
  mileage: string;
  color: string;
  vin: string;
  licensePlate: string;
};

export default function AccountPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    color: "",
    vin: "",
    licensePlate: "",
  });

  const [carImage, setCarImage] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] = useState(false);
  const [editCar, setEditCar] = useState(false);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCarImage(url);
    }
  };

  const validateCustomer = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.province ||
      !formData.postalCode
    ) {
      alert("All customer fields are required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert("Invalid email format");
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Phone must be 10 digits");
      return false;
    }
    return true;
  };

  const validateCar = () => {
    if (
      !formData.make ||
      !formData.model ||
      !formData.year ||
      !formData.mileage ||
      !formData.color ||
      !formData.vin ||
      !formData.licensePlate
    ) {
      alert("All vehicle fields are required");
      return false;
    }
    if (isNaN(Number(formData.year)) || Number(formData.year) < 1900) {
      alert("Year must be valid");
      return false;
    }
    if (isNaN(Number(formData.mileage))) {
      alert("Mileage must be numeric");
      return false;
    }
    return true;
  };

  const saveCustomer = () => {
    if (validateCustomer()) {
      setEditCustomer(false);
      alert("Customer info saved!");
    }
  };

  const saveCar = () => {
    if (validateCar()) {
      setEditCar(false);
      alert("Vehicle info saved!");
    }
  };

  const renderField = (
    label: string,
    name: keyof FormData,
    editing: boolean
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      {editing ? (
        <input
          value={formData[name]}
          onChange={(e) => handleChange(name, e.target.value)}
          placeholder={`Enter ${label}`}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      ) : (
        <input
          value={formData[name]}
          disabled
          placeholder={`Enter ${label}`}
          className="border p-2 rounded bg-gray-100 text-gray-500"
        />
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen text-white overflow-y-auto">
      {/* ✅ Fixed background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/Mustang.jpg"
          alt="Garage Background"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* ✅ Scrollable content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen py-16 px-6">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-400 drop-shadow-lg mb-4">
            My Account
          </h1>
          <p className="text-lg text-gray-200 drop-shadow-md max-w-2xl mx-auto">
            Manage your account settings, personal details, and vehicle
            information all in one place.
          </p>
        </header>

        {/* ✅ Main Content */}
        <div className="w-full max-w-6xl space-y-10">
          {/* Customer Info */}
          <section className="bg-white/90 text-black rounded-xl shadow-xl p-8 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-orange-500 drop-shadow">
                Customer Information
              </h2>
              {!editCustomer && (
                <button
                  onClick={() => setEditCustomer(true)}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("First Name", "firstName", editCustomer)}
              {renderField("Last Name", "lastName", editCustomer)}
              {renderField("Phone", "phone", editCustomer)}
              {renderField("Email", "email", editCustomer)}
              {renderField("Address", "address", editCustomer)}
              {renderField("City", "city", editCustomer)}
              {renderField("Province", "province", editCustomer)}
              {renderField("Postal Code", "postalCode", editCustomer)}
            </div>

            {editCustomer && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={saveCustomer}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditCustomer(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </section>

          {/* Vehicle Info */}
          <section className="bg-white/90 text-black rounded-xl shadow-xl p-8 backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left - Car Image */}
            <div className="flex flex-col items-center justify-center">
              <Image
                src={carImage || "/logo/Car.png"}
                alt="Car"
                width={500}
                height={400}
                className="object-contain rounded-lg shadow-md"
              />
              <label className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="cursor-pointer px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                  Upload Vehicle Image
                </span>
              </label>
            </div>

            {/* Right - Car Info */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-orange-500 drop-shadow">
                  Vehicle Information
                </h2>
                {!editCar && (
                  <button
                    onClick={() => setEditCar(true)}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {renderField("Make", "make", editCar)}
                {renderField("Model", "model", editCar)}
                {renderField("Year", "year", editCar)}
                {renderField("Mileage", "mileage", editCar)}
                {renderField("Color", "color", editCar)}
                {renderField("VIN", "vin", editCar)}
                {renderField("License Plate", "licensePlate", editCar)}
              </div>

              {editCar && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={saveCar}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditCar(false)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
