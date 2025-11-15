"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Sign-in failed");
        setLoading(false);
        return;
      }

      // Success! Route based on role
      if (data.user.role === "admin") {
        router.push("/Admin/AdminHome");
      } else {
        router.push("/Client/account");
      }
    } catch  {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-y-auto">
      {/* Fixed background */}
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

      {/* Centered scrollable content */}
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

        {/* Glass Sign-In Box */}
        <div className="bg-white/90 text-black rounded-2xl shadow-2xl p-8 w-full max-w-md backdrop-blur-sm">
          <h1 className="text-3xl font-extrabold text-center text-orange-500 mb-2 drop-shadow">
            Sign In
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Welcome back! Please sign in to continue.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Test Accounts Info */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p className="font-semibold text-blue-900 mb-1">Test Accounts:</p>
            <p className="text-blue-700">Admin: admin@tracksidegarage.com / admin123</p>
            <p className="text-blue-700">Client: client@example.com / client123</p>
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={() => router.push("/AuthScreen/signup")}
              className="text-sm text-orange-500 hover:underline"
            >
              Don&apos;t have an account? Sign Up
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