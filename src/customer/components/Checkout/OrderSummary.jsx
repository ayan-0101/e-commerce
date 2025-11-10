import React, { useEffect } from "react";
import AddressCard from "../AddressCard/AddressCard";
import CartItem from "../Cart/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../../State/Order/Action";
import { get } from "lodash";
import { Tag, Truck } from "lucide-react";

const formatPrice = (amount) =>
  amount === undefined || amount === null
    ? "₹0"
    : `₹${Number(amount).toLocaleString()}`;

const OrderSummary = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state);

  const orderData = get(order, "order", {});
  const orderId = get(orderData, "_id", "");
  const orderItems = get(orderData, "orderItems", []);
  const shippingAddress = get(orderData, "shippingAddress", {});
  const paymentDetails = get(orderData, "paymentDetails", {});
  const totalItems = orderData?.totalItem || 0;
  const totalPrice = orderData?.totalPrice || 0;
  const totalDiscountedPrice = orderData?.totalDiscountedPrice || 0;
  const discount = orderData?.discount || 0;

  // delivery charge logic (free delivery threshold same as cart)
  const FREE_DELIVERY_THRESHOLD = 499;
  const DELIVERY_CHARGE = 49;
  const isFreeDelivery = totalDiscountedPrice >= FREE_DELIVERY_THRESHOLD;
  const deliveryCharge = isFreeDelivery ? 0 : DELIVERY_CHARGE;
  const finalAmount = totalDiscountedPrice + deliveryCharge;
  const amountToFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - totalDiscountedPrice
  );

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById({ orderId }));
    }
  }, [dispatch, orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Summary</h1>
          <p className="text-gray-600 mt-2">
            Order ID:{" "}
            <span className="font-medium text-gray-800">{orderId}</span>
          </p>
          <p className="text-gray-600 mt-1">
            Payment Method:{" "}
            <span className="font-medium">
              {paymentDetails.paymentMethod || "—"}
            </span>
          </p>
          <p className="text-gray-600 mt-1">
            Payment Status:{" "}
            <span className="font-medium">
              {paymentDetails.paymentStatus || "—"}
            </span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Items and Address */}
          <div className="flex-1 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <AddressCard address={shippingAddress} />
            </div>

            {/* Ordered Items */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ordered Items
              </h2>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <CartItem key={item._id} cartItem={item}/>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Payment Details */}
          {orderItems.length > 0 && (
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
                        You saved {formatPrice(discount)} on this order! 🎉
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

                {/* Checkout / Pay Now button */}
                <button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  PAY NOW
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

export default OrderSummary;
