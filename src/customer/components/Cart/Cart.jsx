import React, { useEffect } from "react";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart } from "../../../State/Cart/Action";
import { ShoppingCart, Package, Tag, Truck, ArrowLeft } from "lucide-react";

const formatPrice = (amount) =>
  amount === undefined || amount === null
    ? "₹0"
    : `₹${Number(amount).toLocaleString()}`;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart state from Redux store
  const { cart } = useSelector((store) => store);
  const cartData = cart?.cart;
  const isFetching = cart?.isFetching;
  const items = cartData?.cartItems ?? [];

  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  const handleCheckout = () => {
    navigate("/checkout");
  };
  const handleBack = () => {
    // Try to go back in history, if no history go to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // Calculate totals
  const totalItems =
    cartData?.totalItem ??
    items.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
  const totalPrice =
    cartData?.totalPrice ?? items.reduce((sum, it) => sum + (it.price ?? 0), 0);
  const totalDiscountedPrice =
    cartData?.totalDiscountedPrice ??
    items.reduce((sum, it) => sum + (it.discountedPrice ?? 0), 0);
  const discount =
    cartData?.discount ?? Math.max(0, totalPrice - totalDiscountedPrice);

  // Delivery charges logic
  const FREE_DELIVERY_THRESHOLD = 499;
  const DELIVERY_CHARGE = 49;
  const isFreeDelivery = totalDiscountedPrice >= FREE_DELIVERY_THRESHOLD;
  const deliveryCharge = isFreeDelivery ? 0 : DELIVERY_CHARGE;
  const finalAmount = totalDiscountedPrice + deliveryCharge;
  const amountToFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - totalDiscountedPrice
  );

  // Only show loading on initial fetch, not on updates
  const showLoading = isFetching && items.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-96 mb-8">
          <span className="sticky top-4 left-4 z-10 inline-block bg-white/80 backdrop-blur-md px-4 py-3 rounded-lg shadow-sm">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              <span className="font-medium">Back</span>
            </button>
          </span>
          <span className="flex items-center gap-3">
            <ShoppingCart size={32} className="text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Cart Items */}
          <div className="flex-1">
            {showLoading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your cart...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Package size={64} className="mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-500 mb-6">
                  Add some items to get started!
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((cartItem) => (
                  <CartItem key={cartItem._id} cartItem={cartItem} />
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Price Details */}
          {items.length > 0 && (
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Tag size={20} className="text-purple-600" />
                  Price Details
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Price */}
                  <div className="flex justify-between text-gray-700">
                    <span>Price ({totalItems} items)</span>
                    <span className="font-medium">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      -{formatPrice(discount)}
                    </span>
                  </div>

                  {/* Delivery Charges */}
                  <div className="flex justify-between text-gray-700">
                    <span className="flex items-center gap-1">
                      <Truck size={16} />
                      Delivery Charges
                    </span>
                    <span
                      className={`font-medium ${
                        isFreeDelivery ? "text-green-600" : "text-gray-900"
                      }`}
                    >
                      {isFreeDelivery ? (
                        <span className="flex items-center gap-1">
                          FREE
                          <span className="text-xs line-through text-gray-400">
                            {formatPrice(DELIVERY_CHARGE)}
                          </span>
                        </span>
                      ) : (
                        formatPrice(DELIVERY_CHARGE)
                      )}
                    </span>
                  </div>

                  {/* Total Amount */}
                  <div className="border-t-2 border-dashed pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-purple-600">
                        {formatPrice(finalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Savings Message */}
                  {discount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700 font-medium">
                        You will save {formatPrice(discount)} on this order! 🎉
                      </p>
                    </div>
                  )}

                  {/* Free Delivery Progress */}
                  {!isFreeDelivery && amountToFreeDelivery > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Truck
                          size={16}
                          className="text-blue-600 mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-blue-700 font-medium mb-2">
                            Add {formatPrice(amountToFreeDelivery)} more to get
                            FREE delivery! 🚚
                          </p>
                          {/* Progress bar */}
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (totalDiscountedPrice /
                                    FREE_DELIVERY_THRESHOLD) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Free Delivery Achieved */}
                  {isFreeDelivery && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Truck size={16} className="text-green-600" />
                        <p className="text-sm text-green-700 font-medium">
                          Yay! You've qualified for FREE delivery! 🎉
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={items.length === 0}
                >
                  PROCEED TO CHECKOUT
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Safe and Secure Payments. Easy returns. 100% Authentic
                  products.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
