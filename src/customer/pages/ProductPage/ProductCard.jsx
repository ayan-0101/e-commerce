import React from "react";
import "./ProductCard.css";
const ProductCard = ({product}) => {
  return (
    <div className="productCard w-[15rem] m-3 transition-all cursor-pointer">
      <div className="h-[20rem]">
        <img
          className="h-full w-full object-cover object-left-top"
          src={product.imageUrl}
          alt="image"
        />
      </div>

      <div className="textPart bg-white p-3 space-y-2">
        {/* Product Title */}
        <div>
          <p className="font-bold opacity-70">{product.brand}</p>
          <p className="text-sm">{product.title}</p>
        </div>

        {/* Price and Discount Section */}
        <div className=" space-x-2">
          <span className="font-semibold text-lg">{product.discountedPrice}</span>
          <span className="line-through text-gray-500 text-base">{product.price}</span>
          <span className="text-green-600 font-semibold text-base whitespace-nowrap">
            {product.discountPercent}% off
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
