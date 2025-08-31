import React from "react";

const CartItem = () => {
  return (
    <div className="p-5 shadow-lg border rounded-md flex items-start gap-4">
      {/* Product Image */}
      <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem] flex-shrink-0">
        <img
          className="w-full h-full object-cover object-top rounded-md"
          src="https://m.media-amazon.com/images/I/61SDTiZdvHL._AC_UL640_FMwebp_QL65_.jpg"
          alt="Men Slim Mid Rise Black Jeans"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 gap-2">
        <h2 className="font-medium text-lg">
          Men Slim Mid Rise Black Jeans
        </h2>
        <p className="text-sm text-gray-600">Size: L, White</p>
        <p className="text-sm text-gray-600">
          Seller: <span className="text-gray-800">Crishtaliyo 2fashion</span>
        </p>

        {/* Price & Discount */}
        <div className="flex items-center gap-2">
          <span className="line-through text-gray-400">₹1799</span>
          <span className="text-lg font-semibold">₹494</span>
          <span className="text-green-600 font-medium">72% off</span>
        </div>

        {/* Quantity and Remove */}
        <div className="flex items-center gap-5 mt-2">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
            <button className="px-2 py-1 text-xl">−</button>
            <span className="px-3">1</span>
            <button className="px-2 py-1 text-xl text-purple-600">+</button>
          </div>

          {/* Remove Button */}
          <button className="text-purple-600 font-medium hover:underline">
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
