import React, { useState } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import AddressCard from '../AddressCard/AddressCard'

const DeliveryAddressForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()

    const addressObject = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      phoneNumber: formData.phoneNumber,
    }

    console.log("Submitted Address:", addressObject)

    return addressObject
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">

        {/* Left Side - Address Card */}
        <div className="lg:w-2/5 w-full">
          <div className="bg-white rounded-lg shadow-md h-[500px] flex flex-col">
            <div className="p-6 border-b flex-1 overflow-y-auto">
              <Typography variant="h6" className="mb-4 text-gray-600">
                Address
              </Typography>
              <AddressCard />
            </div>
            <div className="p-6 border-t">
              <Button
                variant="contained"
                fullWidth
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
                sx={{ bgcolor: "#9c27b0", "&:hover": { bgcolor: "#7b1fa2" }, textTransform: 'none', fontSize: '16px' }}
              >
                DELIVER HERE
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-3/5 w-full">
          <div className="bg-white rounded-lg shadow-md p-6 h-[500px]">
            <form className="h-full flex flex-col" onSubmit={handleSubmit}>
              <div className="flex-1 space-y-6">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField required id="firstName" name="firstName" label="First Name" fullWidth variant="outlined" value={formData.firstName} onChange={handleChange} />
                  <TextField required id="lastName" name="lastName" label="Last Name" fullWidth variant="outlined" value={formData.lastName} onChange={handleChange} />
                </div>

                {/* Address */}
                <div>
                  <TextField required id="address" name="address" label="Address" fullWidth multiline rows={3} variant="outlined" value={formData.address} onChange={handleChange} />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField required id="city" name="city" label="City" fullWidth variant="outlined" value={formData.city} onChange={handleChange} />
                  <TextField required id="state" name="state" label="State/Province/Region" fullWidth variant="outlined" value={formData.state} onChange={handleChange} />
                </div>

                {/* Zip & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField required id="zipCode" name="zipCode" label="Zip / Postal code" fullWidth variant="outlined" value={formData.zipCode} onChange={handleChange} />
                  <TextField required id="phoneNumber" name="phoneNumber" label="Phone Number" fullWidth variant="outlined" type="tel" value={formData.phoneNumber} onChange={handleChange} />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button type="submit" variant="contained" fullWidth className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
                  sx={{ bgcolor: "#9c27b0", "&:hover": { bgcolor: "#7b1fa2" }, textTransform: 'none', fontSize: '16px' }}>
                  DELIVER HERE
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryAddressForm
