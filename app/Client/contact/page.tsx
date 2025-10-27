"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
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

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative bg-cover bg-center h-[800px] flex items-center justify-center">
        <Image
          className="absolute inset-0 object-cover brightness-50"
          src="/MustangGT.jpg"
          alt="Mustang GT"
          fill
        />

        {/* Overlay Container */}
        <div className="relative z-10 w-full max-w-6xl px-6">
          {/* Heading */}
          <div className="text-center mb-12 text-white">
            <h1 className="text-4xl font-bold">Contact Us & Location</h1>
            <p className="mt-2">Have a question? We’d love to hear from you.</p>
          </div>

          {/* Grid layout - Info + Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left side - Contact Info */}
            <div className="space-y-6">
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-5 flex gap-3 items-start text-white">
                <Phone className="text-orange-400 w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p>+1 (403) 123-4567</p>
                </div>
              </div>

              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-5 flex gap-3 items-start text-white">
                <Mail className="text-orange-400 w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>tracksidegarage@gmail.com</p>
                </div>
              </div>

              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-5 flex gap-3 items-start text-white">
                <MapPin className="text-orange-400 w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p>Alberta, Canada</p>
                </div>
              </div>

              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-5 flex gap-3 items-start text-white">
                <Clock className="text-orange-400 w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Business Hours</h3>
                  <p>Mon – Fri: 7:00 AM – 6:00 PM</p>
                  <p>Sat: 8:00 AM – 4:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <form className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 space-y-4 text-white">
              <h3 className="font-semibold text-lg">Send Us a Message</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border p-3 rounded bg-white text-black w-full"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border p-3 rounded bg-white text-black w-full"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-3 rounded bg-white text-black"
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full border p-3 rounded bg-white text-black"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full border p-3 rounded bg-white text-black"
              />
              <textarea
                placeholder="Message"
                rows={5}
                className="w-full border p-3 rounded bg-white text-black"
              ></textarea>
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:scale-102 transition-transform duration-200">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Gradient Transition */}
      <div className="h-10 bg-gradient-to-b from-black/80 to-white/20"></div>

      {/* Map Section */}
      <section className="pb-16 pt-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center">Find Us Here</h2>
          <div className="w-full h-72 bg-gray-300 rounded-lg shadow-md overflow-hidden">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={9}
              >
                <Marker position={center} />
              </GoogleMap>
            ) : (
              <p className="text-center py-10">Loading map...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
