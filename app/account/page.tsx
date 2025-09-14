'use client'

import React, { useState } from 'react'

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

  const saveCustomer = () => {
    setCustomer(draftCustomer)
    setEditCustomer(false)
    alert('Customer info saved')
  }
  const cancelCustomer = () => {
    setDraftCustomer(customer)
    setEditCustomer(false)
  }

  const saveVehicle = () => {
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
      className={`border px-3 py-2 rounded-md w-full ${props.className ?? ''}`}
    />
  )

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="font-semibold">{label}</p>
      <p>{value}</p>
    </div>
  )

  return (
    <div className="mt-32 px-6 md:px-10 flex flex-col gap-10 mb-40">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
        <section className="bg-white text-black rounded-xl shadow-md p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Customer Information</h2>
            {!editCustomer ? (
              <button className="nav-btn" onClick={() => setEditCustomer(true)}>
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="nav-btn" onClick={cancelCustomer}>Cancel</button>
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform duration-200"
                  onClick={saveCustomer}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          {!editCustomer ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <p className="font-semibold mb-1">First Name</p>
                <TextInput
                  value={draftCustomer.firstName}
                  onChange={(e) => onCust('firstName', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Province</p>
                <TextInput
                  value={draftCustomer.province}
                  onChange={(e) => onCust('province', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Last Name</p>
                <TextInput
                  value={draftCustomer.lastName}
                  onChange={(e) => onCust('lastName', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">City</p>
                <TextInput
                  value={draftCustomer.city}
                  onChange={(e) => onCust('city', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Phone Number</p>
                <TextInput
                  value={draftCustomer.phone}
                  onChange={(e) => onCust('phone', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Address</p>
                <TextInput
                  value={draftCustomer.address}
                  onChange={(e) => onCust('address', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Email</p>
                <TextInput
                  type="email"
                  value={draftCustomer.email}
                  onChange={(e) => onCust('email', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Postal Code</p>
                <TextInput
                  value={draftCustomer.postalCode}
                  onChange={(e) => onCust('postalCode', e.target.value)}
                />
              </div>
            </div>
          )}
        </section>
        <section className="bg-white text-black rounded-xl shadow-md p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Vehicle Information</h2>
            {!editVehicle ? (
              <button className="nav-btn" onClick={() => setEditVehicle(true)}>
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="nav-btn" onClick={cancelVehicle}>Cancel</button>
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform duration-200"
                  onClick={saveVehicle}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          {!editVehicle ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <Field label="Make:" value={vehicle.make} />
              <Field label="Year:" value={vehicle.year} />
              <Field label="Model:" value={vehicle.model} />
              <Field label="Mileage:" value={vehicle.mileage} />
              <Field label="Color:" value={vehicle.color} />
              <Field label="VIN:" value={vehicle.vin} />
              <Field label="License Plate:" value={vehicle.plate} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <p className="font-semibold mb-1">Make</p>
                <TextInput
                  value={draftVehicle.make}
                  onChange={(e) => onVeh('make', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Year</p>
                <TextInput
                  value={draftVehicle.year}
                  onChange={(e) => onVeh('year', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Model</p>
                <TextInput
                  value={draftVehicle.model}
                  onChange={(e) => onVeh('model', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Mileage</p>
                <TextInput
                  value={draftVehicle.mileage}
                  onChange={(e) => onVeh('mileage', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Color</p>
                <TextInput
                  value={draftVehicle.color}
                  onChange={(e) => onVeh('color', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">VIN</p>
                <TextInput
                  value={draftVehicle.vin}
                  onChange={(e) => onVeh('vin', e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">License Plate</p>
                <TextInput
                  value={draftVehicle.plate}
                  onChange={(e) => onVeh('plate', e.target.value)}
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
