"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
<<<<<<< HEAD
  height: "300px",
=======
  height: "350px",
>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
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
<<<<<<< HEAD
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
=======
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
          <form className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-orange-400/40 shadow-[0_0_25px_rgba(0,0,0,0.4)] rounded-2xl p-8 space-y-5 transition-all duration-300">
            <h3 className="text-2xl font-semibold text-orange-400 mb-2">
              Send Us a Message
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <textarea
              placeholder="Message"
              rows={5}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            ></textarea>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-transform hover:scale-105 duration-200">
              Send Message
            </button>
          </form>
        </div>

        {/* Google Map */}
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-semibold text-center mb-6 text-orange-400">
            Find Us Here
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.5)] border border-white/20 backdrop-blur-xl">
>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={9}
              >
                <Marker position={center} />
              </GoogleMap>
            ) : (
<<<<<<< HEAD
              <p className="text-center py-10">Loading map...</p>
            )}
          </div>
        </div>
      </section>
=======
              <p className="text-center text-gray-300 py-10">
                Loading map...
              </p>
            )}
          </div>
        </div>
      </div>
>>>>>>> c4c87da685e264c6994ce1032a9dff60cdeb2b61
    </div>
  );
}
