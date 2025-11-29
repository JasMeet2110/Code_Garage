"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "350px",
};

const center = {
  lat: 51.0447,
  lng: -114.0719,
};

export default function Contact() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState<null | "success" | "error">(null);
    const [errorText, setErrorText] = useState("");

    const MAX_MESSAGE_WORDS = 250;

    const messageWordCount = message.trim().split(/\s+/).filter(Boolean).length;

    const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorText("Please fill all required fields.");
      setModal("error");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setErrorText("Enter a valid email address.");
      setModal("error");
      return;
    }

    if (messageWordCount > MAX_MESSAGE_WORDS) {
      setErrorText(`Message too long. Max allowed: ${MAX_MESSAGE_WORDS} words.`);
      setModal("error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ fullName, email, phone, subject, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setModal("success");
        setFullName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        setErrorText(data.error || "Failed to send message.");
        setModal("error");
      }
    } catch (err) {
      setErrorText("Unexpected error occurred.");
      setModal("error");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/background/mustanggt.jpg"
          alt="Mustang GT"
          fill
          className="object-cover blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Scrollable Foreground Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-16 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-3 text-orange-400 drop-shadow-lg">
            Contact Us & Location
          </h1>
          <p className="text-gray-300 text-lg">
            Have a question or need a quote? We’re always here to help.
          </p>
        </div>

        {/* Contact Info + Form */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-5">
            {[
              {
                icon: <Phone className="w-6 h-6 text-orange-400" />,
                title: "Phone",
                value: "+1 (403) 123-4567",
              },
              {
                icon: <Mail className="w-6 h-6 text-orange-400" />,
                title: "Email",
                value: "tracksidegarage0101@gmail.com",
              },
              {
                icon: <MapPin className="w-6 h-6 text-orange-400" />,
                title: "Address",
                value: "Alberta, Canada",
              },
              {
                icon: <Clock className="w-6 h-6 text-orange-400" />,
                title: "Business Hours",
                value: (
                  <>
                    <p>Mon – Fri: 7:00 AM – 6:00 PM</p>
                    <p>Sat: 8:00 AM – 4:00 PM</p>
                    <p>Sun: Closed</p>
                  </>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex gap-4 items-start shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(255,165,0,0.3)] hover:border-orange-400/60"
              >
                {/* Subtle gradient glow animation */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-orange-500/20 to-transparent blur-lg transition-opacity duration-500"></div>

                <div className="relative z-10 flex gap-4">
                  {item.icon}
                  <div>
                    <h3 className="font-semibold text-orange-400 mb-1">
                      {item.title}
                    </h3>
                    <div className="text-gray-200 text-sm leading-relaxed">
                      {item.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Glassy Form */}
          <form 
            onSubmit={submitForm}
            className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-orange-400/40 shadow-[0_0_25px_rgba(0,0,0,0.4)] rounded-2xl p-8 space-y-5 transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold text-orange-400 mb-2">
              Send Us a Message
            </h3>

            {/* FULL NAME (merged first + last) */}
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Phone */}
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Subject */}
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Message with word count */}
            <div>
              <textarea
                placeholder="Message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              ></textarea>

              <p className={`text-right text-sm mt-1 ${
                messageWordCount > MAX_MESSAGE_WORDS ? "text-red-400" : "text-gray-300"
              }`}>
                {messageWordCount}/{MAX_MESSAGE_WORDS} words
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-transform hover:scale-105 duration-200 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
          {/* Success / Error Modal */}
          {modal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-8 rounded-2xl w-[90%] max-w-md text-center">
                {modal === "success" ? (
                  <>
                    <CheckCircle2 className="text-green-400 w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-400 mb-2">
                      Message Sent!
                    </h2>
                    <p className="text-gray-200">
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-400 w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-400 mb-2">
                      Failed to Send
                    </h2>
                    <p className="text-gray-200">{errorText}</p>
                  </>
                )}

                <button
                  onClick={() => setModal(null)}
                  className="mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Google Map */}
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-semibold text-center mb-6 text-orange-400">
            Find Us Here
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.5)] border border-white/20 backdrop-blur-xl">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={9}
              >
                <Marker position={center} />
              </GoogleMap>
            ) : (
              <p className="text-center text-gray-300 py-10">
                Loading map...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
