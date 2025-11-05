import { Button } from "@headlessui/react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, loginUser } from "../../State/Auth/Actions";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onSwitch, handleClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const token = localStorage.getItem("token");
  const hasShownToast = useRef(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    hasShownToast.current = false; // Reset toast flag on new submission

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    dispatch(loginUser(data));

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

  // ✅ Show toast messages based on API response
  useEffect(() => {
    if (hasShownToast.current) return; // Prevent duplicate toasts

    if (auth.error) {
      hasShownToast.current = true;

      // Normalize error messages
      let errorMessage = auth.error;
      if (
        errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("user not found") ||
        errorMessage.toLowerCase().includes("not found")
      ) {
        errorMessage = "Invalid email address";
      } else if (errorMessage.toLowerCase().includes("password")) {
        errorMessage = "Invalid password";
      } else if (errorMessage.toLowerCase().includes("credentials")) {
        errorMessage = "Invalid email or password";
      }

      toast.error(errorMessage, {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
        },
      });
    } else if (auth.user && auth.jwt) {
      hasShownToast.current = true;

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
            fontWeight: "500",
          },
        }
      );

      // ✅ Close modal and redirect to home after short delay
      setTimeout(() => {
        handleClose();
        navigate("/");
      }, 1000);
    }
  }, [auth.error, auth.user, auth.jwt, navigate, handleClose]);

  // ✅ Fetch user if token exists
  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [token, dispatch]);

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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600 text-sm">Sign in to continue shopping</p>
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
          {/* Forgot Password Link */}
          <div className="mt-1.5 text-right">
            <button
              type="button"
              className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
              onClick={() =>
                toast("Password reset feature coming soon!", {
                  position: "top-center",
                  style: {
                    background: "#3b82f6", // blue
                    color: "#fff",
                    fontWeight: 500,
                    padding: "12px",
                  },
                  icon: "💬",
                })
              }
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Sign In
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">
              Don't have an account?
            </span>
          </div>
        </div>

        {/* Create Account Button */}
        <Button
          type="button"
          onClick={() => onSwitch && onSwitch()}
          className="w-full bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
