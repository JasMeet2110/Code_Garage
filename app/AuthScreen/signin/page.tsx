"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Replace with real authentication (NextAuth, API call, etc.)
    console.log("Attempt Sign In:", { email, password });
    router.push("/"); // Redirect after login
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

      {/* ✅ Centered scrollable content */}
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

        {/* ✅ Glass Sign-In Box */}
        <div className="bg-white/90 text-black rounded-2xl shadow-2xl p-8 w-full max-w-md backdrop-blur-sm">
          <h1 className="text-3xl font-extrabold text-center text-orange-500 mb-2 drop-shadow">
            Sign In
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Welcome back! Please sign in to continue.
          </p>

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
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social Sign In */}
          <div className="flex flex-col space-y-3">
            <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium transition">
              Continue with Google
            </button>
            <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium transition">
              Continue with GitHub
            </button>
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={() => router.push("/AuthScreen/signup")}
              className="text-sm text-orange-500 hover:underline"
            >
              Don’t have an account? Sign Up
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
