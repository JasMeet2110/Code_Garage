'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export default function AccountPage() {
  const [customer, setCustomer] = useState({
    firstName: 'John',
    lastName: 'Doe',
    phone: '(403) 555-1234',
    email: 'john.doe@email.com',
    address: '123 Main Street',
    city: 'Calgary',
    province: 'Alberta',
    postalCode: 'T2X 1A1',
  })

  const [vehicle, setVehicle] = useState({
    make: 'Honda',
    model: 'Civic',
    year: '2020',
    vin: '2HGFC2F59LH000000',
    plate: 'ABC-1234',
    color: 'Black',
    mileage: '45,000 km',
  })

  const [editCustomer, setEditCustomer] = useState(false)
  const [editVehicle, setEditVehicle] = useState(false)

  const [draftCustomer, setDraftCustomer] = useState({ ...customer })
  const [draftVehicle, setDraftVehicle] = useState({ ...vehicle })

  const onCust = (k: keyof typeof draftCustomer, v: string) =>
    setDraftCustomer({ ...draftCustomer, [k]: v })
  const onVeh = (k: keyof typeof draftVehicle, v: string) =>
    setDraftVehicle({ ...draftVehicle, [k]: v })

  // simple inline validation (email + postal code + phone + VIN + year)
  const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
  const validPostal = (s: string) => /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(s.trim())
  const validPhone = (s: string) => /^\+?[\d ()-]{7,}$/.test(s.trim())
  const validYear = (s: string) =>
    /^\d{4}$/.test(s) && Number(s) >= 1980 && Number(s) <= new Date().getFullYear() + 1
  const validVIN = (s: string) => /^[A-HJ-NPR-Z0-9]{11,17}$/i.test(s.trim())

  const saveCustomer = () => {
    if (!validEmail(draftCustomer.email)) {
      alert('Please enter a valid email.')
      return
    }
    if (!validPostal(draftCustomer.postalCode)) {
      alert('Please enter a valid Canadian postal code (e.g., T2X 1A1).')
      return
    }
    if (!validPhone(draftCustomer.phone)) {
      alert('Please enter a valid phone number.')
      return
    }
    setCustomer(draftCustomer)
    setEditCustomer(false)
    alert('Customer info saved')
  }
  const cancelCustomer = () => {
    setDraftCustomer(customer)
    setEditCustomer(false)
  }

  const saveVehicle = () => {
    if (!validYear(draftVehicle.year)) {
      alert('Please enter a valid 4-digit year.')
      return
    }
    if (!validVIN(draftVehicle.vin)) {
      alert('Please enter a valid VIN (11–17 characters, no I/O/Q).')
      return
    }
    setVehicle(draftVehicle)
    setEditVehicle(false)
    alert('Vehicle info saved')
  }
  const cancelVehicle = () => {
    setDraftVehicle(vehicle)
    setEditVehicle(false)
  }

  const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className={`border px-3 py-2 rounded-md w-full bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500 ${props.className ?? ''}`}
    />
  )

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="text-left">
      <p className="font-semibold text-gray-600">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  )

  return (
    <div className="relative min-h-[900px] flex flex-col justify-center items-center text-center text-white">
      <Image
        src="/account.JPG"
        alt="Background"
        fill
        className="absolute inset-0 object-cover brightness-30"
        priority
      />
      <div className="relative z-10 w-full">
        <div className="mt-24 md:mt-28 px-6 md:px-10 mb-40">
          {/* Hero header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-orange-400 drop-shadow-lg">My Account</h1>
            <p className="text-lg text-white/95 drop-shadow-md">
              Manage your profile and vehicle details.
            </p>
          </header>

          {/* Content cards */}
          <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
            {/* Customer */}
            <section className="bg-white text-black rounded-xl shadow-lg p-6 w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Customer Information</h2>
                {!editCustomer ? (
                  <button className="px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition">
                    <span onClick={() => setEditCustomer(true)}>Edit</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button className="nav-btn" onClick={cancelCustomer}>Cancel</button>
                    <button
                      className="px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition"
                      onClick={saveCustomer}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {!editCustomer ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left">
                  <Field label="First Name:" value={customer.firstName} />
                  <Field label="Province:" value={customer.province} />
                  <Field label="Last Name:" value={customer.lastName} />
                  <Field label="City:" value={customer.city} />
                  <Field label="Phone Number:" value={customer.phone} />
                  <Field label="Address:" value={customer.address} />
                  <Field label="Email:" value={customer.email} />
                  <Field label="Postal Code:" value={customer.postalCode} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left">
                  <div>
                    <p className="font-semibold mb-1">First Name</p>
                    <TextInput
                      value={draftCustomer.firstName}
                      onChange={(e) => onCust('firstName', e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Province</p>
                    <TextInput
                      value={draftCustomer.province}
                      onChange={(e) => onCust('province', e.target.value)}
                      placeholder="Province"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Last Name</p>
                    <TextInput
                      value={draftCustomer.lastName}
                      onChange={(e) => onCust('lastName', e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">City</p>
                    <TextInput
                      value={draftCustomer.city}
                      onChange={(e) => onCust('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Phone Number</p>
                    <TextInput
                      value={draftCustomer.phone}
                      onChange={(e) => onCust('phone', e.target.value)}
                      placeholder="(403) 555-1234"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Address</p>
                    <TextInput
                      value={draftCustomer.address}
                      onChange={(e) => onCust('address', e.target.value)}
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Email</p>
                    <TextInput
                      type="email"
                      value={draftCustomer.email}
                      onChange={(e) => onCust('email', e.target.value)}
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Postal Code</p>
                    <TextInput
                      value={draftCustomer.postalCode}
                      onChange={(e) => onCust('postalCode', e.target.value)}
                      placeholder="T2X 1A1"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Vehicle */}
            <section className="bg-white text-black rounded-xl shadow-lg p-6 w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Vehicle Information</h2>
                {!editVehicle ? (
                  <button className="px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition">
                    <span onClick={() => setEditVehicle(true)}>Edit</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button className="nav-btn" onClick={cancelVehicle}>Cancel</button>
                    <button
                      className="px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition"
                      onClick={saveVehicle}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {!editVehicle ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left">
                  <Field label="Make:" value={vehicle.make} />
                  <Field label="Year:" value={vehicle.year} />
                  <Field label="Model:" value={vehicle.model} />
                  <Field label="Mileage:" value={vehicle.mileage} />
                  <Field label="Color:" value={vehicle.color} />
                  <Field label="VIN:" value={vehicle.vin} />
                  <Field label="License Plate:" value={vehicle.plate} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left">
                  <div>
                    <p className="font-semibold mb-1">Make</p>
                    <TextInput
                      value={draftVehicle.make}
                      onChange={(e) => onVeh('make', e.target.value)}
                      placeholder="Make"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Year</p>
                    <TextInput
                      value={draftVehicle.year}
                      onChange={(e) => onVeh('year', e.target.value)}
                      placeholder="YYYY"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Model</p>
                    <TextInput
                      value={draftVehicle.model}
                      onChange={(e) => onVeh('model', e.target.value)}
                      placeholder="Model"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Mileage</p>
                    <TextInput
                      value={draftVehicle.mileage}
                      onChange={(e) => onVeh('mileage', e.target.value)}
                      placeholder="e.g., 45,000 km"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Color</p>
                    <TextInput
                      value={draftVehicle.color}
                      onChange={(e) => onVeh('color', e.target.value)}
                      placeholder="Color"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">VIN</p>
                    <TextInput
                      value={draftVehicle.vin}
                      onChange={(e) => onVeh('vin', e.target.value)}
                      placeholder="VIN"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">License Plate</p>
                    <TextInput
                      value={draftVehicle.plate}
                      onChange={(e) => onVeh('plate', e.target.value)}
                      placeholder="Plate"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
