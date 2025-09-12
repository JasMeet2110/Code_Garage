import Navbar from "../../components/Navbar";
import Image from "next/image";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <div>
      {/* Page Intro with quick welcome and image */}

        {/* Background image section */}
        <section className="relative bg-cover bg-center h-[800px] flex items-center justify-center text-center pt-35">
          <Image className="absolute inset-0 bg-cover bg-center brightness-50 pt-15" src="/MustangRTR.png" alt="Mustang RTR" layout="fill" objectFit="cover" />

          {/* welcome text */}
          <div className="relative z-10 text-white px-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Full-Service <br /> Auto Repair <br /> For All Makes & Models
            </h1>
            <a href="/book-appointment" className="mt-6 inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:scale-105 transition-transform duration-200">
              Book Appointment
            </a>
          </div>
        </section>

      <div className="h-10 bg-gradient-to-b from-black/90 to-white/50"></div>

      {/*About us Information*/}
      <section className="px-50 pt-5">
        <h3 className="text-4xl font-bold mb-6 text-center">Welcome to SunRise Mechanic Shop!</h3>
        <p className="text-lg text-gray-700 px-5">
          Located in the heart of Ontario, SunRise Car Mechanic has been serving the community with reliable and affordable auto repair services for years. We pride ourselves on being more than just a repair shop — we’re a team of passionate, certified mechanics dedicated to keeping your car safe, efficient, and performing at its best.<br /><br />

          At SunRise, we believe every customer deserves honest advice, transparent pricing, and top-quality workmanship. Whether you’re driving a domestic, import, or luxury vehicle, our full-service facility is equipped to handle all makes and models. From routine maintenance like oil changes and tire rotations to advanced diagnostics and major repairs, we’ve got you covered.<br /><br />

          Our shop combines modern technology with old-fashioned customer care. We use the latest diagnostic tools and high-quality parts, but we never lose sight of what matters most — building trust with our customers. That’s why drivers across Ontario choose SunRise Car Mechanic for:<br /><br />
          <b>
          • Experienced Technicians – Licensed mechanics with years of hands-on experience.<br />

          • Complete Auto Services – Brakes, engines, transmissions, batteries, tires, and more.<br />

          • Fast & Reliable Turnaround – Same-day service available for most jobs.<br />

          • Fair Pricing – No hidden costs, just honest estimates before we start work.<br />

          • Customer Comfort – Friendly staff and a clean, welcoming shop environment.<br /><br />
          </b>

          We’ve proudly serviced thousands of vehicles and built lasting relationships with Ontario drivers who rely on us to keep their cars running smoothly. Whether you need emergency repairs, seasonal maintenance, or just a quick inspection before a road trip, SunRise Car Mechanic is your go-to shop for trusted automotive care.<br /><br />
        </p>
      </section>

      {/* Services Preview */}
      <section className="py-10 px-6 bg-gray-100 text-center">
      <h2 className="text-4xl font-bold mb-6 text-center">Our Popular Services</h2>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-50">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
          <div className="h-50 w-full relative">
            <Image src="/OilChange.png" alt="Oil Change" fill className="object-cover"/>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Oil Change</h3>
            <p className="text-gray-600 text-sm">
              Keep your engine running smoothly with our quick and reliable oil change service.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
          <div className="h-50 w-full relative">
            <Image src="/BrakeService.png" alt="Brake Service" fill className="object-cover"/>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Brake Service</h3>
            <p className="text-gray-600 text-sm">
              Ensure your safety with expert brake inspection and maintenance.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
          <div className="h-50 w-full relative">
            <Image src="/TireChange.png" alt="Tire Change" fill className="object-cover"/>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Tire Replacement</h3>
            <p className="text-gray-600 text-sm">
              Stay safe on the road with our professional tire replacement services.
            </p>
          </div>
        </div>
      </div>

      {/* Show More Button */}
      <div className="mt-10 mb-10">
        <a
          href="/services"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform duration-200"
        >
          Show More Services
        </a>
      </div>
      </section>

      {/* Reviews Section */}
        <section className="relative py-10 px-6 text-center bg-cover bg-gray-100 bg-center">
          <Image src="/ReviewsBackground.png" alt="Reviews Background" fill className="object-cover object-top brightness-70 blur-xs"/>
            <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 text-center">What Our Customers Say</h2>

            {/* Reviews Grid */}
            <div className="flex flex-col md:flex-row justify-center gap-6">
              {/* Review 1 */}
              <div className="bg-white shadow-md rounded-lg p-4 w-72 hover:shadow-lg transition">
                <p className="text-gray-700 text-sm">"Amazing service, quick and affordable! My car feels brand new."</p>
                <p className="mt-2 font-semibold text-sm">- John D.</p>
                <p className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</p>
              </div>

              {/* Review 2 */}
              <div className="bg-white shadow-md rounded-lg p-4 w-72 hover:shadow-lg transition">
                <p className="text-gray-700 text-sm">"They really care about your car like it's their own. Highly recommend!"</p>
                <p className="mt-2 font-semibold text-sm">- Sarah K.</p>
                <p className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</p>
              </div>

              {/* Review 3 */}
              <div className="bg-white shadow-md rounded-lg p-4 w-72 hover:shadow-lg transition hidden md:block">
                <p className="text-gray-700 text-sm">"Great customer service and fast turnaround. Will be back for sure."</p>
                <p className="mt-2 font-semibold text-sm">- Michael T.</p>
                <p className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</p>
              </div>
            </div>

            {/* Write Review Button */}
            <div className="mt-10">
              <a
                href="/reviews"
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