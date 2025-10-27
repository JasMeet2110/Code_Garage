<<<<<<< HEAD
=======
<<<<<<< HEAD
/*its a client side page so we are using "use client" */
"use client";

/*imports*/
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const HomePage = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const router = useRouter();

  const buttonStyle = (buttonName: string) => ({
    backgroundColor: '#f97316',
    color: 'white',
    padding: '15px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    transform: hoveredButton === buttonName ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.2s, background-color 0.2s',
    width: '100%'
  });
  
  /* routers */
  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleAdminSignIn = () => {
    router.push('/AdminSignIn');
  
  };

  /* rendered screen for users */
  return (
    <div style={{
      /* background image and layout */ 
      backgroundImage: 'url("/background/ZR1.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
      position: 'relative'
    }}>
=======
>>>>>>> 65026de7ed9c26dd09d2f9b4c45af6861a93b7be
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Page Intro with quick welcome and image */}
<<<<<<< HEAD
=======
>>>>>>> 00949fae4653a673228c3c913bca22d6e749203e
>>>>>>> 65026de7ed9c26dd09d2f9b4c45af6861a93b7be

        {/* Background image section */}
        <section className="relative bg-cover bg-center h-[800px] flex items-center justify-center text-center">
          <Image className="absolute inset-0 bg-cover bg-center brightness-50" src="/background/MustangRTR.png" alt="Mustang RTR" layout="fill" objectFit="cover" />

<<<<<<< HEAD
=======
<<<<<<< HEAD
      {/* logo and heading with description */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: "900px", alignItems: "center", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: '30px' }}>
          <Image src="/TracksideGarage.png" alt="Logo" width={400} height={300} className="invert brightness-0" />
        </div>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          color: '#f97316',
          letterSpacing: '2px'
        }}>
          Trackside Garage
        </h1>
        
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '30px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          fontWeight: 'bold'
        }}>
          Reliable Repairs. Built with Passion.
        </p>
        
        {/* buttons to navigate to different pages */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '15px',
          width: '250px',
          margin: '0 auto'
        }}>
          <button 
            style={buttonStyle('signin')}
            onMouseEnter={() => setHoveredButton('signin')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleSignIn}
          >
            Sign in
          </button>
          
          <button 
            style={buttonStyle('signup')}
            onMouseEnter={() => setHoveredButton('signup')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          
          <button 
            style={buttonStyle('admin')}
            onMouseEnter={() => setHoveredButton('admin')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleAdminSignIn}
          >
            Sign in as admin
          </button>
=======
>>>>>>> 65026de7ed9c26dd09d2f9b4c45af6861a93b7be
          {/* welcome text */}
          <div className="relative z-10 text-white px-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Full-Service <br /> Auto Repair <br /> For All Makes & Models
            </h1>
            <a href="/Client/book-appointment" className="mt-6 inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:scale-105 transition-transform duration-200">
              Book Appointment
            </a>
          </div>
        </section>

      <div className="h-10 bg-gradient-to-b from-black/90 to-white/50"></div>

      {/*About us Information*/}
      <section className="px-50 pt-5">
        <h3 className="text-4xl font-bold mb-6 text-center">Welcome to Trackside Garage!</h3>
        <p className="text-lg text-gray-700 px-5">
          Located in the heart of Alberta, Trackside Garage has been serving the community with reliable and affordable auto repair services for years. We pride ourselves on being more than just a repair shop — we’re a team of passionate, certified mechanics dedicated to keeping your car safe, efficient, and performing at its best.<br /><br />

          At Trackside Garage, we believe every customer deserves honest advice, transparent pricing, and top-quality workmanship. Whether you’re driving a domestic, import, or luxury vehicle, our full-service facility is equipped to handle all makes and models. From routine maintenance like oil changes and tire rotations to advanced diagnostics and major repairs, we’ve got you covered.<br /><br />

          Our shop combines modern technology with old-fashioned customer care. We use the latest diagnostic tools and high-quality parts, but we never lose sight of what matters most — building trust with our customers. That’s why drivers across Alberta choose Trackside Garage for:<br /><br />
          <b>
          • Experienced Technicians – Licensed mechanics with years of hands-on experience.<br />

          • Complete Auto Services – Brakes, engines, transmissions, batteries, tires, and more.<br />

          • Fast & Reliable Turnaround – Same-day service available for most jobs.<br />

          • Fair Pricing – No hidden costs, just honest estimates before we start work.<br />

          • Customer Comfort – Friendly staff and a clean, welcoming shop environment.<br /><br />
          </b>

          We’ve proudly serviced thousands of vehicles and built lasting relationships with Alberta drivers who rely on us to keep their cars running smoothly. Whether you need emergency repairs, seasonal maintenance, or just a quick inspection before a road trip, Trackside Garage is your go-to shop for trusted automotive care.<br /><br />
        </p>
      </section>

      {/* services text */}
      <section className="py-10 px-6 bg-gray-100 text-center">
      <h2 className="text-4xl font-bold mb-6 text-center">Our Popular Services</h2>

      {/* service cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-50">
        {/* card 1 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
          <div className="h-50 w-full relative">
            <Image src="/services/OilChange.png" alt="Oil Change" fill className="object-cover"/>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Oil Change</h3>
            <p className="text-gray-600 text-sm">
              Keep your engine running smoothly with our quick and reliable oil change service.
            </p>
          </div>
        </div>

        {/* card 2 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
          <div className="h-50 w-full relative">
            <Image src="/services/BrakeService.png" alt="Brake Service" fill className="object-cover"/>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Brake Service</h3>
            <p className="text-gray-600 text-sm">
              Ensure your safety with expert brake inspection and maintenance.
            </p>
          </div>
        </div>

        {/* card 3 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
          <div className="h-50 w-full relative">
            <Image src="/services/TireChange.png" alt="Tire Change" fill className="object-cover"/>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Tire Replacement</h3>
            <p className="text-gray-600 text-sm">
              Stay safe on the road with our professional tire replacement services.
            </p>
          </div>
<<<<<<< HEAD
=======
>>>>>>> 00949fae4653a673228c3c913bca22d6e749203e
>>>>>>> 65026de7ed9c26dd09d2f9b4c45af6861a93b7be
        </div>
      </div>

      {/* show more button */}
      <div className="pt-5">
        <Link
          href="/Client/services"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform duration-200"
        >
          Show More Services
        </Link>
      </div>
      </section>

      {/* reviews section */}
        <section className="relative py-10 px-6 text-center bg-cover bg-gray-100 bg-center">
          <Image src="/background/ReviewsBackground.png" alt="Reviews Background" fill className="object-cover object-top brightness-70 blur-xs"/>
            <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 text-center">What Our Customers Say</h2>

            <div className="flex flex-col md:flex-row justify-center gap-6">
              {/* review 1 */}
              <div className="bg-white shadow-md rounded-lg p-4 w-72 hover:shadow-lg transition">
                <p className="text-gray-700 text-sm">Amazing service, quick and affordable! My car feels brand new.</p>
                <p className="mt-2 font-semibold text-sm">- John D.</p>
                <p className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</p>
              </div>

              {/* review 2 */}
              <div className="bg-white shadow-md rounded-lg p-4 w-72 hover:shadow-lg transition">
                <p className="text-gray-700 text-sm">They really care about your car like its their own. Highly recommend!</p>
                <p className="mt-2 font-semibold text-sm">- Sarah K.</p>
                <p className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</p>
              </div>

              {/* review 3 */}
              <div className="bg-white shadow-md rounded-lg p-4 w-72 hover:shadow-lg transition hidden md:block">
                <p className="text-gray-700 text-sm">Great customer service and fast turnaround. Will be back for sure.</p>
                <p className="mt-2 font-semibold text-sm">- Michael T.</p>
                <p className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</p>
              </div>
            </div>

            {/* write review button */}
            <div className="mt-10">
              <a
                href="/Client/reviews"
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform duration-200"
              >
                Write a Review
              </a>
            </div>
          </div>
        </section>
    </div>
  );
}