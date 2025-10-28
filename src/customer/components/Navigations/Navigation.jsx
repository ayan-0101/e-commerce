import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ICONS } from "../../../constants/icon";
import { navigation } from "../../ComponentData/navigationData";
import SearchBar from "./SearchBar";
import AuthModal from "../../auth/AuthModal";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import DesktopCategories from "./DesktopCategories";
import { logoutUser, fetchUser } from "../../../State/Auth/Actions";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalForm, setAuthModalForm] = useState("login");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  // ✅ Fetch user on component mount if token exists (maintain session)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !auth.user) {
      dispatch(fetchUser());
    }
  }, [dispatch, auth.user]);

  // Handle URL-based modal opening
  useEffect(() => {
    const path = location.pathname;
    if (path === "/login") {
      setAuthModalForm("login");
      setAuthModalOpen(true);
    } else if (path === "/register") {
      setAuthModalForm("register");
      setAuthModalOpen(true);
    }
  }, [location.pathname]);

  // Auto-close modal and redirect to home after successful registration
  useEffect(() => {
    if (auth.user && authModalOpen && authModalForm === "register") {
      handleCloseAuthModal();
    }
  }, [auth.user]);

  const handleOpenAuthModal = (form = "login") => {
    setAuthModalForm(form);
    setAuthModalOpen(true);
    navigate(form === "login" ? "/login" : "/register");
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
    navigate("/");
  };

  const handleAuthModalSwitch = (nextForm) => {
    setAuthModalForm(nextForm);
    navigate(nextForm === "login" ? "/login" : "/register");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <div className="bg-white z-50">
      {/* Mobile Menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Header */}
      <header className="relative bg-white">
        {/* Banner */}
        {showBanner && (
          <div className="relative bg-indigo-600">
            <p className="flex h-10 items-center justify-center px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
              Get free delivery on orders over INR 500
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-2 top-2 text-white hover:text-gray-200 transition-colors"
              aria-label="Close banner"
            >
              <ICONS.close className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 hover:text-gray-500 lg:hidden transition-colors"
                aria-label="Open menu"
              >
                <ICONS.menu aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="ml-2 flex lg:ml-0">
                <button onClick={() => navigate("/")} className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                  <span className="sr-only">Lowkey</span>
                  <img
                    alt="Lowkey Logo"
                    src="/assets/logo.jpg"
                    className="h-[50px] w-[60px] sm:h-[60px] sm:w-[80px] lg:h-[72px] lg:w-[74px] object-contain"
                  />
                </button>
              </div>

              {/* Desktop Categories */}
              <DesktopCategories navigation={navigation} />

              {/* Right Side Actions */}
              <div className="ml-auto flex items-center space-x-4">
                {/* Search */}
                <div className="flex lg:ml-6">
                  <SearchBar />
                </div>

                {/* Desktop Auth Buttons (when not logged in) */}
                {!auth.user && (
                  <div className="hidden lg:flex lg:items-center lg:space-x-4">
                    <Button
                      variant="text"
                      onClick={() => handleOpenAuthModal("login")}
                      sx={{ textTransform: "none" }}
                    >
                      Sign In
                    </Button>

                    <span
                      aria-hidden="true"
                      className="h-6 w-px bg-gray-200"
                    />

                    <Button
                      variant="contained"
                      onClick={() => handleOpenAuthModal("register")}
                      sx={{ textTransform: "none" }}
                    >
                      Create Account
                    </Button>
                  </div>
                )}

                {/* User Menu (when logged in) */}
                {auth.user && (
                  <UserMenu user={auth.user} onLogout={handleLogout} />
                )}

                {/* Cart */}
                <button
                  onClick={handleCartClick}
                  className="group -m-2 flex items-center p-2 hover:opacity-75 transition-opacity"
                  aria-label="View cart"
                >
                  <ICONS.shoppingBag
                    aria-hidden="true"
                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 transition-colors"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    {auth.cart?.totalItem || 0}
                  </span>
                  <span className="sr-only">items in cart</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal
        handleClose={handleCloseAuthModal}
        open={authModalOpen}
        form={authModalForm}
        onSwitch={handleAuthModalSwitch}
      />
    </div>
  );
}