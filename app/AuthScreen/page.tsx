"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthScreen() {
  const router = useRouter();
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);

  // OPTIONAL: “secret” UI trigger (Cmd/Ctrl+Alt+A) to show an admin button.
  // NOTE: This is *only* a UX affordance. Real protection happens in middleware + server checks.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      if (ctrlOrCmd && e.altKey && (e.key === "a" || e.key === "A")) {
        setShowAdminPrompt(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      {/* Fixed background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/ZR1.png"
          alt="Background"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-20">
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
          <p className="mt-1 text-gray-200 drop-shadow">Reliable Repairs. Built with Passion.</p>
        </div>

        {/* Auth grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch gap-6">
          {/* Sign In */}
          <section className="bg-white/90 text-black rounded-2xl shadow-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Sign In</h2>

            <div className="space-y-3">
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition"
                onClick={() => router.push("/AuthScreen/signin")}
              >
                Continue to Sign In
              </button>
              <button
                className="w-full border border-gray-400 hover:bg-gray-50 py-4 rounded-lg font-medium transition"
                onClick={() => router.push("/api/auth/signin?provider=google")}
              >
                Continue with Google
              </button>
              <button
                className="w-full border border-gray-400 hover:bg-gray-50 py-4 rounded-lg font-medium transition"
                onClick={() => router.push("/api/auth/signin?provider=github")}
              >
                Continue with GitHub
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-4">
              By continuing, you agree to our <a href="/Termscondition" className="text-blue-500 underline">Terms</a> and acknowledge our Privacy Policy.
            </p>
          </section>

          {/* Divider */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="w-px h-full bg-white/20" />
            <span className="absolute bg-black/70 border border-white/10 px-3 py-1 rounded-full text-sm">
              OR
            </span>
          </div>

          {/* Sign Up */}
          <section className="bg-white/90 text-black rounded-2xl shadow-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Create Account</h2>

            <div className="space-y-3">
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition"
                onClick={() => router.push("/AuthScreen/signup")}
              >
                Continue to Sign Up
              </button>
              <button
                className="w-full border border-gray-400 hover:bg-gray-50 py-4 rounded-lg font-medium transition"
                onClick={() => router.push("/api/auth/signin?provider=google")}
              >
                Sign up with Google
              </button>
              <button
                className="w-full border border-gray-400 hover:bg-gray-50 py-4 rounded-lg font-medium transition"
                onClick={() => router.push("/api/auth/signin?provider=github")}
              >
                Sign up with GitHub
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-4">
              Quick setup. Manage bookings, track history, and more.
            </p>
          </section>
        </div>

        {/* Optional admin affordance – does NOT grant access by itself */}
        {showAdminPrompt && (
          <div className="mt-6 flex justify-center">
            <button
              className="px-4 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition"
              onClick={() => router.push("/AdminHome")}
              aria-label="Admin sign in"
            >
              Admin Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
