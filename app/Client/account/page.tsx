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

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/AuthScreen");
  }, [status, router]);

  // Fetch profile from DB
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

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCarImage(url);
      setFormData((prev) => ({ ...prev, carImage: url }));
    }
  };

  const validateForm = () => {
    const { fullName, phone, email, carName, year, color, licensePlate } = formData;
    if (!fullName || !phone || !email || !carName || !year || !color || !licensePlate) {
      alert("Please fill all fields before saving.");
      return false;
    }
    return true;
  };

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

  const renderField = (label: string, name: keyof FormData) => (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium mb-1 text-orange-300">{label}</label>
      <input
        value={formData[name] || ""}
        onChange={(e) => handleChange(name, e.target.value)}
        placeholder={`Enter ${label}`}
        className={`rounded-lg w-full px-4 py-3 bg-white/10 text-white border border-white/20 backdrop-blur-xl placeholder-gray-300 transition-all ${
          editMode
            ? "focus:outline-none focus:ring-2 focus:ring-orange-400"
            : "opacity-60 cursor-not-allowed"
        }`}
        disabled={!editMode}
      />
    </div>
  );

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-white text-2xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-y-auto">
      {/* 🔥 Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/mustang.jpg"
          alt="Garage Background"
          fill
          priority
          className="object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-20 px-6 space-y-12">
        {/* Header */}
        <header className="text-center mb-4">
          <h1 className="text-5xl font-bold text-orange-400 drop-shadow-lg mb-4">
            My Account
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Welcome, {session?.user?.name?.split(" ")[0]}! Manage your profile and vehicle details below.
          </p>
        </header>

        {/* Glass Card Container */}
        <section className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-2xl shadow-[0_0_35px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(255,165,0,0.2)] transition-all duration-300 p-10 w-full max-w-5xl flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Left: Fields */}
          <div className="flex-1 flex flex-col space-y-4">
            <h2 className="text-2xl font-extrabold text-orange-400 mb-4">
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
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:shadow-[0_0_25px_rgba(0,255,0,0.4)] transition-all duration-300"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-[0_0_15px_rgba(0,128,255,0.3)] hover:shadow-[0_0_25px_rgba(0,128,255,0.5)] transition-all duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Right: Car Image */}
          <div className="flex flex-col items-center justify-center mt-65 w-full md:w-[45%]">
            <div className="relative w-full flex items-center justify-center">
              <Image
                src={carImage || "/logo/car.png"}
                alt="Car Image"
                width={550}
                height={400}
                className="object-contain rounded-lg drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              />
            </div>

            <label className="mt-12">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="cursor-pointer px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-all duration-300">
                Upload Vehicle Image
              </span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
