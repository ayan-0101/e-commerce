import { Button } from "@headlessui/react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const RegisterForm = ({ onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log("Form submitted:", data);

    // Show success toast
    toast.success("Account created successfully!", {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#10b981",
        color: "#fff",
        fontWeight: "500",
      },
    });

    // Clear the form
    e.target.reset();
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#f9fafb",
      "&:hover": {
        backgroundColor: "#ffffff",
      },
      "&.Mui-focused": {
        backgroundColor: "#ffffff",
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Toast Container */}
      <Toaster />

      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 text-sm">
          Join us today and start shopping
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            required
            id="firstName"
            name="firstName"
            placeholder="First Name *"
            fullWidth
            autoComplete="given-name"
            variant="outlined"
            size="medium"
            sx={textFieldStyles}
          />

          <TextField
            required
            id="lastName"
            name="lastName"
            placeholder="Last Name *"
            fullWidth
            autoComplete="family-name"
            variant="outlined"
            size="medium"
            sx={textFieldStyles}
          />
        </div>

        <TextField
          required
          id="email"
          name="email"
          placeholder="Email Address *"
          type="email"
          fullWidth
          autoComplete="email"
          variant="outlined"
          size="medium"
          sx={textFieldStyles}
        />

        <div>
          <TextField
            required
            id="password"
            name="password"
            placeholder="Password *"
            type={showPassword ? "text" : "password"}
            fullWidth
            autoComplete="new-password"
            variant="outlined"
            size="medium"
            sx={textFieldStyles}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    sx={{
                      color: "#6b7280",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "#374151",
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Must be at least 8 characters long
          </p>
        </div>

        {/* Create Account Button */}
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Create Account
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">Already have an account?</span>
          </div>
        </div>

        {/* Sign In Button */}
        <Button
          type="button"
          onClick={() => onSwitch && onSwitch()}
          className="w-full bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
