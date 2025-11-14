"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthScreen() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Proper redirect logic
  useEffect(() => {
    if (status === "loading") return; // wait for session
    if (session?.user?.email === "tracksidegarage0101@gmail.com") {
      router.replace("/Admin/AdminHome");
    } else if (session?.user) {
      router.replace("/Client/account");
    }
  }, [session, status, router]);

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/login.png"
          alt="Background"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Main Box */}
      <div className="relative z-10 bg-white/90 text-black rounded-2xl shadow-2xl p-10 w-full max-w-md text-center backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo/tracksidegarage.png"
            alt="Trackside Garage"
            width={200}
            height={120}
            className="brightness-0"
            priority
          />
          <h1 className="mt-3 text-3xl font-extrabold text-orange-500 drop-shadow-lg">
            Trackside Garage
          </h1>
          <p className="text-gray-700 mt-1">
            Reliable Repairs. Built with Passion.
          </p>
        </div>

        {/* Google Sign-In */}
        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center w-full gap-3 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition"
        >
          <Image src="/logo/google.png" alt="Google" width={25} height={25} />
          <div>Continue with Google</div>
        </button>

        <p className="text-xs text-gray-600 mt-6">
          By signing in, you agree to our{" "}
          <a href="/Client/Termscondition" className="text-blue-500 underline">
            Terms
          </a>{" "}
          and acknowledge our Privacy Policy.
        </p>

        <p className="text-sm text-gray-800 mt-4">
          Please sign in with Google to access My Account features.
        </p>
      </div>
    </div>
  );
}
