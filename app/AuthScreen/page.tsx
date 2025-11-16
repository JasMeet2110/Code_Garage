"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, LogIn, Chrome, UserPlus } from "lucide-react";

export default function AuthScreen() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- 1. REDIRECT LOGIC (from your original file) ---
  // In app/AuthScreen/page.tsx

useEffect(() => {
  if (status === "loading") return;

  // --- ADD THIS LOG ---
  console.log("Client-Side Role:", session?.user?.role);
  // --------------------

  // Check if session AND session.user exists
  if (session && session.user) {
    if (session.user.role === "admin") {
      router.replace("/Admin/AdminHome");
    } else {
      // This covers all other logged-in users (role === "client" or undefined)
      router.replace("/Client/account");
    }
  }
}, [session, status, router]);


  // --- 2. SIGN-IN FORM LOGIC (from the new signin/page.tsx) ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      // The useEffect above will handle the final redirect after successful sign-in
    }
  };

const handleGoogleSignIn = () => {
  // Let NextAuth handle the full redirect and session update cycle
  signIn("google"); 
};

  // If session is loading or user is already logged in, show a loading state
  if (status === "loading" || session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // --- 3. RENDER THE COMBINED SIGN-IN FORM ---
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/garage.png" // Using the garage image from your new signin page
          alt="Background"
          fill
          priority
          className="object-cover brightness-[0.2]"
        />
      </div>

      {/* Sign In Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-orange-400 mb-6">
          Welcome Back
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? (
              "Signing In..."
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-white/30"></div>
          <span className="mx-4 text-sm text-gray-400">OR</span>
          <div className="flex-grow border-t border-white/30"></div>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          <Chrome className="h-5 w-5" /> Continue with Google
        </button>

        {/* Link to Sign Up */}
        <p className="text-center text-gray-300 mt-6 text-sm">
          Don't have an account?{" "}
          <Link href="/AuthScreen/signup" className="text-orange-400 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
