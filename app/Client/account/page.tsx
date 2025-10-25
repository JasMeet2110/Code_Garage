"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  carName: string;
  year: string;
  color: string;
  licensePlate: string;
  carImage?: string | null;
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    carName: "",
    year: "",
    color: "",
    licensePlate: "",
    carImage: null,
  });
  const [carImage, setCarImage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🚨 Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/AuthScreen");
    }
  }, [status, router]);

  // ✅ Fetch user profile from DB when session loads
  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user?.email) return;

      try {
        const res = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (res.ok) {
          const data = await res.json();

          setFormData({
            fullName: data.name || session.user.name || "",
            phone: data.phone || "",
            email: data.email || session.user.email || "",
            carName: data.car_name || "",
            year: data.year ? String(data.year) : "",
            color: data.color || "",
            licensePlate: data.car_plate || "",
            carImage: data.car_image || null,
          });
          setCarImage(data.car_image || null);
          setEditMode(false);
        } else {
          // fallback: prefill from Google session
          setFormData({
            fullName: session.user.name || "",
            email: session.user.email || "",
            phone: "",
            carName: "",
            year: "",
            color: "",
            licensePlate: "",
            carImage: null,
          });
          setEditMode(true);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") fetchProfile();
  }, [session, status]);

  // ✅ Handle input changes
  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image upload (local preview)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCarImage(url);
      setFormData((prev) => ({ ...prev, carImage: url }));
    }
  };

  // ✅ Validate before saving
  const validateForm = () => {
    const { fullName, phone, email, carName, year, color, licensePlate } = formData;
    if (!fullName || !phone || !email || !carName || !year || !color || !licensePlate) {
      alert("Please fill all fields before saving.");
      return false;
    }
    return true;
  };

  // ✅ Save profile changes to DB
  const saveChanges = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch("/api/customers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.fullName,
          phone: formData.phone,
          carName: formData.carName,
          carPlate: formData.licensePlate,
          year: formData.year,
          color: formData.color,
          carImage: formData.carImage,
        }),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        setEditMode(false);
      } else {
        alert("Failed to save profile.");
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // ✅ Render Input Fields
  const renderField = (label: string, name: keyof FormData) => (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        value={formData[name] || ""}
        onChange={(e) => handleChange(name, e.target.value)}
        placeholder={`Enter ${label}`}
        className={`border p-3 rounded-lg w-full ${
          editMode
            ? "focus:ring-2 focus:ring-orange-400"
            : "bg-gray-100 text-gray-500"
        }`}
        disabled={!editMode}
      />
    </div>
  );

  // ✅ Loading State
  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-white text-2xl">
        Loading profile...
      </div>
    );
  }

  // ✅ Main Layout
  return (
    <div className="relative min-h-screen text-white overflow-y-auto">
      {/* Background */}
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-16 px-6">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-400 drop-shadow-lg mb-4">
            My Account
          </h1>
          <p className="text-lg text-gray-200 drop-shadow-md max-w-2xl mx-auto">
            Welcome, {session?.user?.name?.split(" ")[0]}! Manage your profile and car
            details below.
          </p>
        </header>

        <section className="bg-white/90 text-black rounded-2xl shadow-xl p-10 backdrop-blur-sm w-full max-w-5xl flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Left: Fields */}
          <div className="flex-1 flex flex-col space-y-4">
            <h2 className="text-2xl font-extrabold text-orange-500 mb-4">
              Customer & Vehicle Info
            </h2>

            {renderField("Full Name", "fullName")}
            {renderField("Phone", "phone")}
            {renderField("Email", "email")}
            {renderField("Car Name", "carName")}
            {renderField("Year", "year")}
            {renderField("Color", "color")}
            {renderField("License Plate", "licensePlate")}

            <div className="mt-6 flex gap-3">
              {editMode ? (
                <button
                  onClick={saveChanges}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow transition"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Right: Car Image */}
          <div className="flex flex-col items-center justify-center w-full md:w-[45%] min-h-[700px]">
            <Image
              src={carImage || "/logo/Car.png"}
              alt="Car Image"
              width={550}
              height={400}
              className="object-contain rounded-lg shadow-lg border border-gray-300"
            />
            <label className="mt-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold">
                Upload Vehicle Image
              </span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
