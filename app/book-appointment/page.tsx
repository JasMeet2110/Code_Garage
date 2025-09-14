"use client"; // tells next.js that the components is a client component refernce next.js Docs- Client Components
import { useMemo, useState } from "react"; //lets you store and update values and memoizes values to avoid recalculating them unnecessarily
import Link from "next/link"; //This imports Next.js’s <Link> component, which allows navigation between pages without reloading the browser Reference: Next.js Docs – Link Component
import { useRouter } from "next/navigation"; //gives access to Next.js’s router object, which lets you navigate programmatically between pages. Reference: Next.js Docs – useRouter
// Define types for services and fuel options
type ServiceKey = "basic_oil" | "full_maint"; //It restricts ServiceKey to only two possible string values: "basic_oil" or "full_maint". This ensures type safety when referring to services.Reference: TypeScript Docs – Union Types
type FuelType = "Petrol" | "Diesel" | "Electric"; //restricting FuelType to only "Petrol", "Diesel", or "Electric". This avoids invalid inputs like “Water” or “Banana” being used for fuel type.

const SERVICES: Record<ServiceKey, { name: string; price: string; duration: string; features: string[] }> = { //Create an object type whose keys are taken from ServiceKey, and whose values must match the given shape ({ name, price, duration, features }).”
  basic_oil: {
    name: "Basic Oil Change", 
    price: "$50–$80",
    duration: "30–45 min",//expected time to complete
    features: ["Quality motor oil", "Oil filter replacement", "Fluid level check"],//array of strings listing what’s included
  },
  full_maint: {
    name: "Full Maintenance",
    price: "$120",
    duration: "2–3 hours",
    features: ["Complete inspection", "All filters", "Brake system check", "Battery test"],
  },
};//constant called SERVICES that acts like a small database of service options. Record<K, T> is a TypeScript utility type
//Reference TypeScript Docs on Record: Utility Types – Record and MDN Docs on objects in JavaScript: Working with Objects
const FUEL_TYPES: FuelType[] = ["Petrol", "Diesel", "Electric"]; //line creates a constant array called FUEL_TYPES. It contains the only fuel types allowed: "Petrol", "Diesel", and "Electric".This ensures the array can only contain those three strings, nothing else.

// quick demo slot generator (front-end only)
function generateSlots(dateISO: string) {//function called generateSlots and dateISO a string in ISO date format like "2025-09-12"
  if (!dateISO) return [];
  const base = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"]; //Converts the given ISO date string into a JavaScript Date and extracts the day of the month
  // simple “variation” so different dates don’t look identical
  const day = new Date(dateISO).getDate();
  return base.filter((_, i) => (i + day) % 5 !== 0); //Loops over the base times and filters out some slots based on the day number.
}//(i + day) % 5 !== 0 is just a trick to remove a different slot each day so the schedule looks less repetitive in the demo.
//Reference MDN Docs – Date.getDate() and MDN Docs – Array.prototype.filter()
export default function BookAppointmentPage() {//Declares the booking page component and makes it the default export so Next.js can render it as a route
  const [service, setService] = useState<ServiceKey | null>(null);//Creates state to track which service the user picked and null nothing chosen ServiceKey | null means it can only be "basic_oil", "full_maint", or nothing
  const [fuel, setFuel] = useState<FuelType | "">("");//Tracks which fuel type the user selected/ empty string starts/FuelType | "" means it can be "Petrol", "Diesel", "Electric", or nothing yet.
  const [date, setDate] = useState("");//Tracks which date the user picked in the form and starts blank
  const [slot, setSlot] = useState("");//Tracks which time slot the user selected and starts blank
  const [vehicle, setVehicle] = useState({ make: "", model: "", year: "", plate: "" });//Stores vehicle details as an object with 4 fields/ All fields start empty until the user fills them
  const [towing, setTowing] = useState(false);//Tracks whether the user checked “Need Towing?” and starts false means not requested
  const [pickup, setPickup] = useState("");//Stores the pickup location if towing is needed and starts blank
  const slots = useMemo(() => generateSlots(date), [date]);//Calls generateSlots(date) whenever the date changes/ seMemo makes sure slots are only recalculated when date updates, which improves performance
  const router = useRouter();//gives access to Next.js’s router object, which lets you navigate programmatically between pages.
//References React Docs – useState and React Docs – useMemo
  const readyToConfirm =
    !!service &&//Checks if a service was selected
    !!fuel &&//Checks if a fuel type was chosen (Petrol, Diesel, or Electric)
    !!date &&//Ensures the user picked a date.
    !!slot &&//Ensures the user picked a time slot.
    vehicle.make.trim() &&//Makes sure the "make" field (e.g., Toyota) is not just empty spaces
    vehicle.model.trim() &&//Same check for the car’s model.
    vehicle.year.trim() &&//Ensures the year field has been filled in.
    vehicle.plate.trim() &&//Ensures the license plate field has been filled in.
    (!towing || pickup.trim());//If towing is not requested !towing = true, this passes and If towing is requested, then it checks that the pickup location is not empty.
//Reference MDN – Logical AND (&&) and MDN – Double NOT (!!)
    function handleConfirm() {//handleConfirm is called when the user clicks the Confirm Booking button
    
    const payload = {//contains all the booking information object
      service,//the service the user selected.
      fuel,//fuel type chosen
      date,//selected appointment date.
      slot,//chosen time slot
      vehicle,//object with make, model, year, and plate
      towing,//towing was requested
      pickup: towing ? pickup : undefined,//if towing is true, saves the pickup location; otherwise undefined
    };

     console.log("BOOKING_PAYLOAD", payload);//Prints the booking data to the browser console
    router.push('/book-appointment/payment'); // Redirect to payment page
  }//Reference MDN Docs – Functions MDN Docs – console.log() and MDN Docs – window.alert()

  return (
    <main className="booking section">
        
        {/* Page header with title and description */}
      <header className="section-header text-center mb-8">
        <h2>Book Your Appointment</h2>
        <p>Choose a service, fill your vehicle info, pick a time, and confirm.</p>
      </header>

      {/* Services */}
      <div className="cards-grid">
        {/* Loop through the SERVICES object using Object.keys */}
        {(Object.keys(SERVICES) as ServiceKey[]).map((key) => {
          const s = SERVICES[key];
          const selected = service === key;
          return (
            
            <article
              key={key}
              className={`card ${selected ? "card--selected" : ""}`}
              onClick={() => setService(key)}
              role="button"
              tabIndex={0}
            >
                {/* Card header with name, duration, and price */}
              <header className="card-head">
                <div>
                  <h4 className="card-title">{s.name}</h4>
                  <p className="card-sub">Duration: {s.duration}</p>
                </div>
                <span className="price-badge">{s.price}</span>
              </header>
              
              <ul className="feature-list">
                {s.features.map((f) => (
                  <li key={f}><span className="check">✔</span> {f}</li>
                ))}
              </ul>
              
              <button className="btn-primary" type="button">
                Select {s.name}
              </button>
            </article>
          );
        })}
      </div>

      {/* Fuel & Vehicle */}
      <section className="panel">
        <h3>Vehicle & Fuel</h3>
        <div className="grid-2">
            {/* Column 1: Fuel type options */}
          <div>
            <label className="label">Fuel Type</label>
            <div className="chip-row">
              {FUEL_TYPES.map((t) => (
                <button
                  key={t}
                  className={`chip ${fuel === t ? "chip--active" : ""}`}
                  onClick={() => setFuel(t)}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

           {/* Column 2: Towing option */}

          <div className="towing">
            <label className="label">Need Towing?</label>
            <div className="row">
                {/* Checkbox to request towing */}
              <input
                id="towing"
                type="checkbox"
                checked={towing}
                onChange={(e) => setTowing(e.target.checked)} // update state when checked/unchecked
              />
              <label htmlFor="towing">Request towing (front-end only)</label>
            </div>

            {/* Conditional rendering: only show input if towing is true */}
            {towing && (
              <input
                placeholder="Pickup location (e.g., 123 Main St, Calgary)"
                className="input"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            )}
          </div>
        </div>

        
       {/* Vehicle Details (Make, Model, Year, Plate) */}
        <div className="grid-4">
          <div>
            <label className="label">Make</label>
            <input
              className="input"
              placeholder="Toyota"// example placeholder
              value={vehicle.make}// bind to vehicle.make state
              onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}// update state when user types
            />
          </div>
          <div>
             {/* Car Model */}
            <label className="label">Model</label>
            <input
              className="input"
              placeholder="Camry"
              value={vehicle.model}
              onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
            />
          </div>
          <div>
            {/* Car Year */}
            <label className="label">Year</label>
            <input
              className="input"
              placeholder="2018"
              value={vehicle.year}
              onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
            />
          </div>
          <div>
            {/* License Plate */}
            <label className="label">License Plate</label>
            <input
              className="input"
              placeholder="ABC-1234"
              value={vehicle.plate}
              onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Date & Slots */}
      <section className="panel">
        <h3>Pick Date & Time</h3>
        {/* Grid layout: 2 columns (one for Date, one for Slots) */}
        <div className="grid-2">
             {/* Column 1: Date picker */}
          <div>
            <label className="label">Date</label>
            <input className="input"
             type="date"// HTML5 date picker
             value={date} // controlled input, bound to state
             onChange={(e) => setDate(e.target.value)}// updates state when user selects date
              />
          </div>
           {/* Column 2: Time slots */}
          <div>
            <label className="label">Available Slots</label>
            <div className="chip-row">
                {/* If no date is chosen, show this message */}
              {slots.length === 0 && <span className="muted">Choose a date to view slots</span>}
              {slots.map((s) => (
                <button
                  key={s}// unique key for React list
                  className={`chip ${slot === s ? "chip--active" : ""}`}// update selected slot
                  onClick={() => setSlot(s)}
                  type="button"
                >
                  {s}{/* Display slot time (e.g., 09:00, 10:30) */}
                </button>//References MDN Docs – HTML <input type="date"> /MDN Docs – Array.prototype.map()/React Docs – Conditional Rendering
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Summary & Confirm */}
      <section className="panel">
        <h3>Summary</h3>
        <div className="summary">
          <div>
             {/* Show the selected service or a dash if none chosen */}
            <div><strong>Service:</strong> {service ? SERVICES[service].name : "—"}</div>
            {/* Show fuel type or a dash */}
            <div><strong>Fuel:</strong> {fuel || "—"}</div>
             {/* Show date and slot (time) or dashes */}
            <div><strong>Date:</strong> {date || "—"} <strong>Time:</strong> {slot || "—"}</div>
            <div>
              {/* Show vehicle details: make, model, year, plate */}
              <strong>Vehicle:</strong> {vehicle.make || "—"} {vehicle.model || ""} {vehicle.year || ""} ({vehicle.plate || "—"})
            </div>
            {/* Conditionally show towing info if towing is true */}
            {towing && <div><strong>Towing pickup:</strong> {pickup || "—"}</div>}
          </div>
          {/* Confirm button: only enabled if readyToConfirm is true */}
          <button className="btn-primary" disabled={!readyToConfirm} onClick={handleConfirm}  >
            Confirm Booking
          </button>
        </div>
         {/* Note for the user (reminder this is front-end only) */}
        <p className="muted" style={{ marginTop: 8 }}
        >
          
        </p>
      </section>
    </main>
  );
}


