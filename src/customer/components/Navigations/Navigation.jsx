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
import { getUserCart } from "../../../State/Cart/Action";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // default true (we'll correct it in effect once auth/user is known)
  const [showBanner, setShowBanner] = useState(true);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalForm, setAuthModalForm] = useState("login");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const { cart } = useSelector((state) => state);
  const token = localStorage.getItem("token");

  // Get cart items count - handle nested structure
  const totalItems = cart?.cart?.cartItems?.length || 0;

  // Fetch user on component mount if token exists (maintain session)
  useEffect(() => {
    if (token && !auth.user) {
      dispatch(fetchUser());
    }
  }, [dispatch, auth.user, token]);

  // Fetch cart when user logs in or on mount
  useEffect(() => {
    if (token && auth.user) {
      dispatch(getUserCart());
    }
  }, [dispatch, auth.user, token]);

  // Initialize banner visibility per-user (localStorage) or per-session for guests
  useEffect(() => {
    if (auth.user) {
      // If user logged in, check localStorage for that user's dismissed flag
      const key = `bannerDismissed_${auth.user._id || auth.user.id}`;
      const dismissed = localStorage.getItem(key);
      setShowBanner(!dismissed);
    } else {
      // Guest: use sessionStorage so it resets when the browser session ends
      const dismissedGuest = sessionStorage.getItem("bannerDismissed_guest");
      setShowBanner(!dismissedGuest);
    }
  }, [auth.user]);

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
  }, [auth.user]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Always fetch cart on mount (keeps cart in sync)
  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  // New: persist banner dismissal based on whether user is logged in
  const handleCloseBanner = () => {
    if (auth.user) {
      const key = `bannerDismissed_${auth.user._id || auth.user.id}`;
      localStorage.setItem(key, "1"); // persists across reloads for this user
    } else {
      sessionStorage.setItem("bannerDismissed_guest", "1"); // persists for session
    }
    setShowBanner(false);
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
              Get free delivery on orders over INR 499!
            </p>
            <button
              onClick={handleCloseBanner}
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
                <button
                  onClick={() => navigate("/")}
                  className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                >
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

                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />

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

                {/* Cart with Badge */}
                <button
                  onClick={handleCartClick}
                  className="group relative -m-2 flex items-center p-2 hover:opacity-75 transition-opacity"
                  aria-label="View cart"
                >
                  <ICONS.shoppingBag
                    aria-hidden="true"
                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 transition-colors"
                  />

                  {/* Cart Count Badge */}
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}

                  <span className="sr-only">items in cart, view cart</span>
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
