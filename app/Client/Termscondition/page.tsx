"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TermsConditions() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/zr1.png"
          alt="Background"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 flex justify-center items-center min-h-screen py-16 px-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-w-4xl w-full text-white p-8 md:p-10">
          <h1 className="text-4xl font-bold text-orange-400 text-center mb-8 drop-shadow-lg">
            Terms & Conditions
          </h1>

          <div className="min-h-[65vh] pr-2 space-y-6 text-left text-gray-100 leading-relaxed">
            <section>
              <h2 className="text-orange-400 text-lg font-semibold mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using Trackside Garage services, you accept and
                agree to be bound by these Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-orange-400 text-lg font-semibold mb-2">
                2. Services Provided
              </h2>
              <p>
                Trackside Garage provides automotive repair, maintenance, and
                related services as described on our website and in our service
                offerings.
              </p>
            </section>

            <section>
              <h2 className="text-orange-400 text-lg font-semibold mb-2">
                3. User Accounts
              </h2>
              <p>
                When you create an account with us, you must provide accurate
                and complete information. You are responsible for maintaining
                the confidentiality of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-orange-400 text-lg font-semibold mb-2">
                4. Service Appointments
              </h2>
              <p>
                Appointments may be scheduled through our website. We reserve
                the right to reschedule or cancel appointments due to unforeseen
                circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-orange-400 text-lg font-semibold mb-2">
                5. Payment Terms
              </h2>
              <p>
                Payment is due upon completion of services. We accept various
                payment methods as indicated at our facility.
              </p>
            </section>

            <section>
              <h2 className="text-orange-400 text-lg font-semibold mb-2">
                6. Limitation of Liability
              </h2>
              <p>
                Trackside Garage shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages
                resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-orange-400 text-lg font-semibold mb-2">
                7. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time.
                Continued use of our services constitutes acceptance of the
                modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-orange-400 text-lg font-semibold mb-2">
                8. Contact Information
              </h2>
              <p>
                For questions about these Terms and Conditions, please contact
                us at{" "}
                <span className="font-semibold text-orange-300">
                  tracksidegarage@gmail.com
                </span>
              </p>
            </section>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => router.back()}
              className="border-2 border-orange-400 text-white font-semibold px-6 py-2 rounded-lg transition hover:bg-orange-500 hover:border-orange-500"
            >
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
