import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import AddressCard from "../AddressCard/AddressCard";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../../State/Order/Action";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const DeliveryAddressForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    mobile: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order } = useSelector((state) => state);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields are filled
    const requiredFields = ['firstName', 'lastName', 'streetAddress', 'city', 'state', 'zipCode', 'mobile'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      toast.error(`Please fill in: ${emptyFields.join(', ')}`, {
        position: "top-center",
      });
      return;
    }

    // Validate mobile number (basic validation)
    if (formData.mobile.length < 10) {
      toast.error("Please enter a valid mobile number", {
        position: "top-center",
      });
      return;
    }

    const addressData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      mobile: formData.mobile,
    };

    try {
      dispatch(createOrder({ address: addressData, navigate }));
      toast.success("Order created successfully!", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to create order. Please try again.", {
        position: "top-center",
      });
      console.error("Order creation error:", error);
    }
  };


  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <Toaster />
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left Side - Address Card */}
        <div className="lg:w-2/5 w-full">
          <div className="bg-white rounded-lg shadow-md flex flex-col h-full">
            <div className="p-4 sm:p-6 border-b flex-1 overflow-y-auto">
              <Typography variant="h6" className="mb-4 text-gray-600">
                Saved Address
              </Typography>
              <AddressCard />
            </div>
            <div className="p-6 border-t">
              <Button
                variant="contained"
                fullWidth
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
                sx={{
                  bgcolor: "#9c27b0",
                  "&:hover": { bgcolor: "#7b1fa2" },
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                DELIVER HERE
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-3/5 w-full">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <Typography variant="h6" className="mb-6 text-gray-800">
              Add New Delivery Address
            </Typography>
            
            <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  required
                  name="firstName"
                  label="First Name"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!formData.firstName && formData.firstName !== ''}
                />
                <TextField
                  required
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!formData.lastName && formData.lastName !== ''}
                />
              </div>

              {/* Street Address */}
              <TextField
                required
                name="streetAddress"
                label="Street Address"
                fullWidth
                multiline
                rows={3}
                value={formData.streetAddress}
                onChange={handleChange}
                error={!formData.streetAddress && formData.streetAddress !== ''}
                helperText="House number, building name, street name"
              />

              {/* City & State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  required
                  name="city"
                  label="City"
                  fullWidth
                  value={formData.city}
                  onChange={handleChange}
                  error={!formData.city && formData.city !== ''}
                />
                <TextField
                  required
                  name="state"
                  label="State/Province/Region"
                  fullWidth
                  value={formData.state}
                  onChange={handleChange}
                  error={!formData.state && formData.state !== ''}
                />
              </div>

              {/* Zip & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  required
                  name="zipCode"
                  label="Zip / Postal code"
                  fullWidth
                  value={formData.zipCode}
                  onChange={handleChange}
                  error={!formData.zipCode && formData.zipCode !== ''}
                />
                <TextField
                  required
                  name="mobile"
                  label="Mobile Number"
                  fullWidth
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={!formData.mobile && formData.mobile !== ''}
                  helperText="10 digit mobile number"
                  inputProps={{ 
                    pattern: "[0-9]*",
                    maxLength: 10 
                  }}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={order?.loading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
                sx={{
                  bgcolor: "#9c27b0",
                  "&:hover": { bgcolor: "#7b1fa2" },
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                {order?.loading ? "CREATING ORDER..." : "DELIVER HERE"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressForm;