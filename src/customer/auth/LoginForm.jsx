import { Button } from "@headlessui/react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const LoginForm = ({ onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      console.log("Login data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success toast
      toast.success(
        <div>
          <strong>Welcome back!</strong>
          <p className="text-sm">You have successfully logged in.</p>
        </div>,
        {
          duration: 3000,
          position: "top-center",
          icon: "🎉",
          style: {
            background: "#10b981",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
          },
        }
      );

      // Clear the form
      e.target.reset();
    } catch (error) {
      toast.error("Invalid credentials. Please try again.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <Toaster
        toastOptions={{
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-sm">
          Sign in to continue shopping
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Email */}
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
          disabled={isSubmitting}
        />

        {/* Password with Show/Hide */}
        <div>
          <TextField
            required
            id="password"
            name="password"
            placeholder="Password *"
            type={showPassword ? "text" : "password"}
            fullWidth
            autoComplete="current-password"
            variant="outlined"
            size="medium"
            sx={textFieldStyles}
            disabled={isSubmitting}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    disabled={isSubmitting}
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
          {/* Forgot Password Link */}
          <div className="mt-1.5 text-right">
            <button
              type="button"
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              onClick={() => console.log("Forgot password clicked")}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${
            isSubmitting
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white font-semibold py-3.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">Don't have an account?</span>
          </div>
        </div>

        {/* Create Account Button */}
        <Button
          type="button"
          onClick={() => onSwitch && onSwitch()}
          disabled={isSubmitting}
          className="w-full bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;