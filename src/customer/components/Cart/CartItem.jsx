import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCartItem, removeItemFromCart } from "../../../State/Cart/Action";
import { Trash2, Plus, Minus, Tag } from "lucide-react";

const formatPrice = (amount) =>
  amount === undefined || amount === null ? "₹0" : `₹${Number(amount).toLocaleString()}`;

const CartItem = ({ cartItem }) => {
  const dispatch = useDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Local optimistic quantity state
  const [optimisticQuantity, setOptimisticQuantity] = useState(cartItem?.quantity ?? 1);

  // Defensive checks
  const product = cartItem?.product ?? {};
  const title = product.title ?? "Product";
  const imageUrl = product.imageUrl ?? "";
  const selectedSize = cartItem?.size ?? "";
  const brand = product.brand ?? "Seller";

  // Use optimistic quantity for display
  const lineQuantity = optimisticQuantity;

  // Unit prices calculation
  const unitPrice =
    cartItem?.quantity && cartItem?.price
      ? Number(cartItem.price) / Number(cartItem.quantity)
      : product.price ?? 0;
      
  const unitDiscountedPrice =
    cartItem?.quantity && cartItem?.discountedPrice
      ? Number(cartItem.discountedPrice) / Number(cartItem.quantity)
      : product.discountedPrice ?? unitPrice;

  const percentOff =
    unitPrice && unitDiscountedPrice
      ? Math.round(((unitPrice - unitDiscountedPrice) / unitPrice) * 100)
      : product.discountPercentage ?? 0;

  // Available stock for selected size
  const sizeObj =
    Array.isArray(product.size) && selectedSize
      ? product.size.find((s) => s.name === selectedSize)
      : null;
  const availableStock = sizeObj?.quantity ?? product.quantity ?? 10;

  // Handlers with optimistic updates
  const handleIncrement = async () => {
    if (lineQuantity >= availableStock) return;
    
    const newQuantity = lineQuantity + 1;
    
    // Optimistically update UI immediately
    setOptimisticQuantity(newQuantity);
    
    // Update in background
    try {
     dispatch(updateCartItem(cartItem._id, { quantity: newQuantity }));
    } catch (error) {
      console.error("Error updating cart:", error);
      // Revert on error
      setOptimisticQuantity(lineQuantity);
    }
  };

  const handleDecrement = async () => {
    if (lineQuantity <= 1) return;
    
    const newQuantity = lineQuantity - 1;
    
    // Optimistically update UI immediately
    setOptimisticQuantity(newQuantity);
    
    // Update in background
    try {
      dispatch(updateCartItem(cartItem._id, { quantity: newQuantity }));
    } catch (error) {
      console.error("Error updating cart:", error);
      // Revert on error
      setOptimisticQuantity(lineQuantity);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;
    
    setIsRemoving(true);
    try {
      await dispatch(removeItemFromCart(cartItem._id));
    } catch (error) {
      console.error("Error removing item:", error);
      setIsRemoving(false);
    }
  };

  // Sync optimistic quantity when cart updates from Redux
  useEffect(() => {
    setOptimisticQuantity(cartItem?.quantity ?? 1);
  }, [cartItem?.quantity]);

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
        isRemoving ? "opacity-50 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 group">
          <img
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
            src={imageUrl || "https://via.placeholder.com/150"}
            alt={title}
            loading="lazy"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                {title}
              </h3>
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all disabled:opacity-50"
                aria-label="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Tag size={14} />
              <span className="font-medium">{brand}</span>
              <span className="text-gray-400">•</span>
              <span>Size: <span className="font-medium text-gray-800">{selectedSize}</span></span>
              {product.color && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>{product.color}</span>
                </>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(unitDiscountedPrice)}
              </span>
              <span className="line-through text-gray-400 text-sm">
                {formatPrice(unitPrice)}
              </span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                {percentOff}% OFF
              </span>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={handleDecrement}
                  disabled={lineQuantity <= 1}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center bg-white">
                  {lineQuantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={lineQuantity >= availableStock}
                  className="px-3 py-2 bg-gray-50 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                  title={
                    lineQuantity >= availableStock
                      ? `Only ${availableStock} available`
                      : "Increase quantity"
                  }
                >
                  <Plus size={16} />
                </button>
              </div>
              {availableStock <= 5 && (
                <span className="text-xs text-orange-600 font-medium">
                  Only {availableStock} left
                </span>
              )}
            </div>

            {/* Line Total - Calculate based on optimistic quantity */}
            <div className="text-right">
              <div className="text-sm text-gray-500">Subtotal</div>
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(unitDiscountedPrice * lineQuantity)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;