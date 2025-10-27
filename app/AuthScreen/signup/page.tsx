"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // TODO: Replace with your real registration logic (NextAuth credentials or API call)
    console.log("Sign Up:", form);
    router.push("/AuthScreen/signin");
  };

  return (
    <div className="relative min-h-screen text-white overflow-y-auto">
      {/* ✅ Fixed background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/ZR1.png"
          alt="Garage Background"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* ✅ Scrollable content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen py-16 px-4">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-10 text-center">
          <Image
            src="/TracksideGarage.png"
            alt="Trackside Garage"
            width={220}
            height={140}
            className="invert brightness-0"
            priority
          />
          <h1 className="mt-4 text-4xl font-extrabold text-orange-400 drop-shadow-lg tracking-wide">
            Trackside Garage
          </h1>
          <p className="mt-1 text-gray-200 drop-shadow">
            Reliable Repairs. Built with Passion.
          </p>
        </div>

        {/* ✅ Glass Sign-Up Box */}
        <div className="bg-white/90 text-black rounded-2xl shadow-2xl p-8 w-full max-w-md backdrop-blur-sm">
          <h1 className="text-3xl font-extrabold text-center text-orange-500 mb-2 drop-shadow">
            Create Account
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Join Trackside Garage to manage your bookings and services.
          </p>

          {/* Sign-Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social Sign-Up */}
          <div className="flex flex-col space-y-3">
            <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium transition">
              Sign up with Google
            </button>
            <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium transition">
              Sign up with GitHub
            </button>
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={() => router.push("/AuthScreen/signin")}
              className="text-sm text-orange-500 hover:underline"
            >
              Already have an account? Sign In
            </button>

            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:underline"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
