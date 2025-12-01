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

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/AuthScreen");
  }, [status, router]);

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(
          `/api/customers?email=${encodeURIComponent(session.user.email)}`,
          { cache: "no-store" }
        );

        const customer = await res.json();

        if (customer) {
          setFormData({
            fullName: customer.name || session.user.name || "",
            phone: customer.phone || "",
            email: customer.email,
            carName: customer.car_name || "",
            year: customer.year ? String(customer.year) : "",
            color: customer.color || "",
            licensePlate: customer.car_plate || "",
            carImage: customer.car_image || null,
          });

          setCarImage(customer.car_image || null);
          setEditMode(false);
        }

        else {
          const createRes = await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: session.user.name || "",
              phone: "",
              email: session.user.email,
              carName: "",
              carPlate: "",
              year: "",
              color: "",
              carImage: null,
            }),
          });

          if (createRes.ok) {
            const newCust = await fetch(
              `/api/customers?email=${encodeURIComponent(session.user.email)}`
            ).then((r) => r.json());

            setFormData({
              fullName: newCust.name || "",
              phone: newCust.phone || "",
              email: newCust.email,
              carName: newCust.car_name || "",
              year: newCust.year ? String(newCust.year) : "",
              color: newCust.color || "",
              licensePlate: newCust.car_plate || "",
              carImage: newCust.car_image || null,
            });

            setCarImage(newCust.car_image || null);
            setEditMode(true);
          }
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

      const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const form = new FormData();
        form.append("file", file);

        if (formData.carImage) {
          form.append("oldImage", formData.carImage);
        }

        const uploadReq = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });

        const uploadRes = await uploadReq.json();

        setCarImage(uploadRes.url);
        setFormData((prev) => ({ ...prev, carImage: uploadRes.url }));
    };

  const validateForm = () => {
    const { fullName, phone, email, carName, year, color, licensePlate } =
      formData;
    if (
      !fullName ||
      !phone ||
      !email ||
      !carName ||
      !year ||
      !color ||
      !licensePlate
    ) {
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

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-white text-2xl">
        Loading profile...
      </div>
    );
  }

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

  return (
    <div className="relative min-h-screen text-white overflow-y-auto">
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

      <div className="relative z-10 flex flex-col items-center py-20 px-6 space-y-12">
        <header className="text-center mb-4">
          <h1 className="text-5xl font-bold text-orange-400 mb-4">
            My Account
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Welcome, {session?.user?.name?.split(" ")[0]}!
          </p>
        </header>

        <section className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-2xl p-10 w-full max-w-5xl flex flex-col md:flex-row gap-10">
          <div className="flex-1 flex flex-col space-y-4">
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
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full md:w-[45%]">
            <Image
              src={carImage || "/logo/car.png"}
              alt="Car Image"
              width={550}
              height={400}
              className="object-contain rounded-lg"
              unoptimized
            />

            <label className="mt-12">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <span className="cursor-pointer px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold">
                Upload Vehicle Image
              </span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
