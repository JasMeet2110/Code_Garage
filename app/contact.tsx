import Navbar from "../components/Navbar";

export default function Contact() {
  return (
    <div>
      <Navbar />
      <section className="px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Get In Touch</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-4">
            <p>📞 Phone: <span className="font-semibold">+1 (604) 710-3226</span></p>
            <p>📧 Email: <span className="font-semibold">sunriseautomechanic@gmail.com</span></p>
            <p>📍 Address: <span className="font-semibold">123 Auto Street, Ontario, Canada</span></p>
            <p>🕒 Hours: Mon–Fri 7:00 AM – 6:00 PM</p>
          </div>

          {/* Form */}
          <form className="space-y-4 bg-white shadow-md rounded-lg p-6">
            <input type="text" placeholder="Your Name" className="w-full border p-2 rounded" />
            <input type="email" placeholder="Your Email" className="w-full border p-2 rounded" />
            <textarea placeholder="Your Message" className="w-full border p-2 rounded" rows={4}></textarea>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
