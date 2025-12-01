// app/AuthScreen/page.tsx
"use client";
import { useEffect, useState } from "react";
import { FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, LogIn, Chrome, UserPlus, ChromeIcon } from "lucide-react";
import Google from "next-auth/providers/google";

export default function AuthScreen() {
  const router = useRouter();
  const { data: session, status } = useSession();
  

 

  useEffect(() => {
    if (status === "loading") return;

    if (session && session.user) {
      if (session.user.role === "admin") {
        router.replace("/Admin/AdminHome");
      } else {
        router.replace("/Client/account");
      }
    }
  }, [session, status, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

const handleLogin = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg("");

  const result = await signIn("credentials", {
    redirect: false,
    email: email,
    password: password,
  });

  setLoading(false);

  if (result?.error) {
    setErrorMsg("Invalid email or password. Please try again.");
  }
};

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  if (status === "loading" || session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative h-[900px] flex flex-col items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/login.png"
          alt="Background"
          fill
          priority
          className="object-cover brightness-[0.2]"
        />
      </div>

      {/* 🔥 Logo + Name Block */}
      <div className="flex flex-col items-center mb-16 z-10">
        <div className="w-70 h-25 relative mb-3">
          <Image
            src="/logo/TrackSideGarage.png"
            alt="Trackside Garage Logo"
            fill
            className="invert brightness-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
          />
        </div>

        <h1 className="text-5xl font-extrabold tracking-wide text-white drop-shadow-lg">
          Trackside <span className="text-orange-500">Garage</span>
        </h1>

        <p className="text-gray-300 text-md mt-1">
          Precision Care For Every Ride
        </p>
      </div>

      {/* 🔥 Sign In Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-orange-400 mb-6">
          Welcome Back
        </h1>

        {errorMsg && (
          <div className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-white/30"></div>
          <span className="mx-4 text-sm text-gray-400">OR</span>
          <div className="flex-grow border-t border-white/30"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          <Chrome className="h-5 w-5" /> Continue with Google
        </button>

        <p className="text-center text-gray-300 mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            href="/AuthScreen/signup"
            className="text-orange-400 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
