"use client";

import { useState } from "react";
import Image from "next/image";

/* define the structure of the form data types */
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

  /* holds car image or default if none uploaded */
  const [carImage, setCarImage] = useState<string | null>(null);

  /* states to toggle edit mode */
  const [editCustomer, setEditCustomer] = useState(false);
  const [editCar, setEditCar] = useState(false);

  /* handle form changes */
  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* handle image upload */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCarImage(url);
    }
  };

  /* validation functions */
  const validateCustomer = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.province || !formData.postalCode) {
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
    if (!formData.make || !formData.model || !formData.year || !formData.mileage || !formData.color || !formData.vin || !formData.licensePlate) {
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
    <label className="text-sm font-medium">{label}</label>
    {editing ? (
      <input
        value={formData[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        placeholder={`Enter ${label}`}
        className="border p-2 rounded"
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
    <div>
      {/* background */}
      
      <Image
        src="/background/Mustang.jpg"
        alt="Background"
        fill
        className="object-cover min-h-[600px] -z-10"
      />

      <div className="h-10 bg-gradient-to-b from-brown-900 to-white/100 absolute bottom-0 left-0 w-full z-0"></div>

      <h1 className="text-4xl font-bold text-center text-orange-500 pt-12 drop-shadow-lg">
        My Account
      </h1>
      <p className="text-center text-gray-600 pb-5">
        Manage your account settings and vehicle information.
      </p>

      <div className="max-w-6xl mx-auto p-6 space-y-10">
        {/* customer info section */}
        <div className="bg-white/90 rounded-lg shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Customer Information</h2>
            {!editCustomer ? (
              <button
                onClick={() => setEditCustomer(true)}
                className="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded"
              >
                Edit
              </button>
            ) : null}
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
            <div className="mt-4 flex gap-2">
              <button
                onClick={saveCustomer}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditCustomer(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* car info section */}
        <div className="bg-white/90 rounded-lg shadow-lg p-6 relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Vehicle</h2>
            </div>
            
            <div className="flex flex-col items-center">
              <Image
                src={carImage || "/logo/Car.png"}
                alt="Car"
                width={600}
                height={500}
                className="object-contain"
              />

              {/* upload button */}
              <label className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="cursor-pointer px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">
                  Upload Your Car Image
                </span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Vehicle Information</h2>
              {!editCar ? (
                <button
                  onClick={() => setEditCar(true)}
                  className="px-3 py-1 text-sm  bg-orange-500 hover:bg-orange-600 text-white rounded"
                >
                  Edit
                </button>
              ) : null}
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
              <div className="mt-4 flex gap-2">
                <button
                  onClick={saveCar}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditCar(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* user appointments section */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 relative">
          <h2 className="text-lg font-semibold mb-4">Your Appointments</h2>
          <p className="text-gray-600">No appointments scheduled.</p>
        </div>
      </div>
    </div>
  );
}
