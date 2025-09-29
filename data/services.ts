export type Service = {
  slug: string;
  name: string;
  description: string;
  image: string;
  signs?: string[];
  why?: string;
  process?: string;
  price: string;
};

export const SERVICES: Service[] = [
  {
    slug: "car-ac-repair",
    name: "Car AC Repair",
    description:
      "Keep your cool with our expert A/C repair services for all vehicle makes and models.",
    image: "/services/AC.png",
    signs: [
      "Weak airflow",
      "Strange noises",
      "Inconsistent temperatures",
    ],
    why: "A/C systems are complex and can fail for various reasons. Regular maintenance is key to avoiding costly repairs.",
    process:
      "We inspect the A/C system, check refrigerant levels, and repair or replace components as needed.",
    price: "120-350"
  },
  {
    slug: "alternator-repair",
    name: "Alternator Repair",
    description:
      "We diagnose, repair, and replace alternators to ensure your car’s electrical systems run smoothly.",
    image: "/services/Alternator.png",
    signs: [
      "Dimming headlights",
      "Battery warning light",
      "Car stalling unexpectedly",
    ],
    why: "The alternator powers your car’s battery and electrical systems. Ignoring issues may leave you stranded.",
    process:
      "Our technicians test the alternator, inspect belts, and replace faulty parts quickly and affordably.",
    price: "250-500"
  },
  {
    slug: "brake-repair",
    name: "Brake Repair",
    description:
      "Reliable brake inspection and replacement to keep you safe on Calgary’s roads.",
    image: "/services/Brake.png",
    signs: ["Squeaking noises", "Soft brake pedal", "Increased stopping distance"],
    why: "Brakes are critical for your safety. Worn brakes reduce stopping power and increase accident risk.",
    process:
      "We inspect pads, rotors, and fluid levels, then repair or replace as needed for optimal performance.",
    price: "200-600"
  },
  {
    slug: "car-battery-services",
    name: "Car Battery Services",
    description:
      "Comprehensive battery testing, replacement, and maintenance to keep your vehicle running smoothly.",
    image: "/services/Battery.png",
    signs: ["Slow engine crank", "Dim lights", "Check engine light"],
    why: "A failing battery can leave you stranded. Regular checks ensure reliability and longevity.",
    process:
      "We test battery health, clean terminals, and replace batteries with high-quality options.",
    price: "150-350"
  },
  {
    slug: "cooling-system",
    name: "Cooling System Service",
    description:
      "Keep your engine cool with our comprehensive cooling system services.",
    image: "/services/Cooling.png",
    signs: ["Overheating", "Coolant leaks", "Unpleasant odors"],
    why: "A well-functioning cooling system is vital to prevent engine damage. Regular checks can save you from costly repairs.",
    process:
      "We inspect the radiator, hoses, and coolant levels, then flush and refill the system as needed.",
    price: "150-400"
  },
  {
    slug: "auto-diagnostics",
    name: "Auto Diagnostics",
    description:
      "Advanced diagnostic services to identify and resolve vehicle issues quickly.",
    image: "/services/AutoDiagnostics.png",
    signs: ["Check engine light", "Unusual noises", "Poor performance"],
    why: "Early detection of issues can prevent costly repairs down the line.",
    process:
      "We use state-of-the-art diagnostic tools to pinpoint problems and recommend solutions.",
    price: "50-150"
  },
  {
    slug: "drivetrain-and-differential-repair",
    name: "Drivetrain & Differential Repair",
    description:
      "Expert repair services for your vehicle's drivetrain and differential systems.",
    image: "/services/Drivetrain.png",
    signs: ["Unusual noises", "Vibration", "Difficulty turning"],
    why: "The drivetrain and differential are crucial for power distribution. Issues can lead to more extensive damage.",
    process:
      "We inspect the drivetrain and differential components, diagnose issues, and perform necessary repairs or replacements.",
    price: "300-1000"
  },
  {
    slug: "auto-electrical-repair",
    name: "Auto Electrical Repair",
    description:
      "Comprehensive electrical system diagnostics and repairs to keep your vehicle running smoothly.",
    image: "/services/Electrical.png",
    signs: ["Flickering lights", "Power window issues", "Dead battery"],
    why: "Electrical problems can affect your vehicle's performance and safety. Timely repairs are essential.",
    process:
      "We diagnose electrical issues, repair wiring, and replace faulty components to restore functionality.",
    price: "200-700"
  },
  {
    slug: "engine-repair",
    name: "Engine Repair",
    description:
      "Comprehensive engine diagnostics and repair services to keep your vehicle running smoothly.",
    image: "/services/Engine.png",
    signs: ["Check engine light", "Unusual noises", "Poor acceleration"],
    why: "Engine issues can lead to poor performance and costly repairs. Timely diagnostics are crucial.",
    process:
      "We perform thorough diagnostics, identify issues, and carry out necessary repairs or replacements.",
    price: "300-2000"
  },
  {
    slug: "general-car-repair",
    name: "General Car Repair",
    description:
      "Comprehensive car repair services to address a wide range of issues.",
    image: "/services/General.png",
    signs: ["Unusual noises", "Fluid leaks", "Warning lights"],
    why: "General wear and tear can lead to various issues. Regular maintenance helps prevent breakdowns.",
    process:
      "We perform a thorough inspection, identify issues, and carry out necessary repairs.",
    price: "100-400"
  },
  {
    slug: "heater-repair",
    name: "Heater Repair",
    description:
      "Stay warm with our expert heater repair services for all vehicle makes and models.",
    image: "/services/Heater.png",
    signs: ["Weak airflow", "Strange noises", "Inconsistent temperatures"],
    why: "A malfunctioning heater can make winter driving uncomfortable and unsafe. Regular maintenance is key.",
    process:
      "We inspect the heater system, check for leaks, and repair or replace components as needed.",
    price: "100-300"
  },
  {
    slug: "oil-change",
    name: "Oil Change",
    description:
      "Keep your engine running smoothly with our quick and affordable oil change services.",
    image: "/services/OilChange.png",
    signs: ["Engine noise", "Oil smell", "Warning light"],
    why: "Regular oil changes are essential for engine health and performance.",
    process:
      "We drain the old oil, replace the oil filter, and refill with high-quality oil.",
    price: "50-150"
  },
  {
    slug: "starter-repair",
    name: "Starter Repair",
    description:
      "Expert starter repair services to ensure your vehicle starts smoothly every time.",
    image: "/services/Starter.png",
    signs: ["Engine won't start", "Clicking noise", "Intermittent starting issues"],
    why: "A faulty starter can leave you stranded. Timely repairs are essential for reliable vehicle operation.",
    process:
      "We diagnose starter issues, perform necessary repairs or replacements, and ensure proper functionality.",
    price: "100-300"
  },
  {
    slug: "suspension-steering-repair",
    name: "Suspension & Steering Repair",
    description:
      "Comprehensive suspension and steering system diagnostics and repairs.",
    image: "/services/Steering.png",
    signs: ["Unusual noises", "Poor handling", "Vibration"],
    why: "Suspension and steering issues can affect vehicle control and safety.",
    process:
      "We inspect the suspension and steering components, diagnose issues, and perform necessary repairs or replacements.",
    price: "150-400"
  },
  {
    slug: "tire-repair",
    name: "Tire Repair",
    description:
      "Fast and reliable tire repair services to keep you safe on the road.",
    image: "/services/Tire.png",
    signs: ["Flat tire", "Uneven wear", "Vibration while driving"],
    why: "Tires are your vehicle's only contact with the road. Proper maintenance is crucial for safety.",
    process:
      "We assess the tire damage, repair punctures, and recommend replacements when necessary.",
    price: "80-200"
  },
  {
    slug: "transmission-repair",
    name: "Transmission Repair",
    description:
      "Expert transmission repair services to ensure smooth and reliable gear shifting.",
    image: "/services/Transmission.png",
    signs: ["Slipping gears", "Delayed engagement", "Unusual noises"],
    why: "Transmission issues can lead to costly repairs if not addressed promptly.",
    process:
      "We perform a comprehensive inspection, diagnose transmission problems, and carry out necessary repairs or replacements.",
    price: "200-1000"
  },
  {
    slug: "wheel-alignment",
    name: "Wheel Alignment",
    description:
      "Professional wheel alignment services to ensure your vehicle drives straight and true.",
    image: "/services/WheelAlignment.png",
    signs: ["Uneven tire wear", "Pulling to one side", "Steering wheel off-center"],
    why: "Proper wheel alignment is crucial for safe handling and tire longevity.",
    process:
      "We use advanced equipment to measure and adjust the alignment angles of your wheels.",
    price: "100-200"
  }
];
