import { isEmpty } from "lodash";
import React from "react";

const HomeSectionCard = ({ product }) => {
  return (
    <div className="
      flex flex-col bg-white rounded-lg overflow-hidden 
      w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] 
      flex-shrink-0 relative group hover:shadow-lg transition-shadow duration-300 shadow-sm
    ">
      {/* Offer Badge */}
      {!isEmpty(product.offer) && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          {product.offer}
        </div>
      )}

      {/* Image */}
      <div className="h-[180px] sm:h-[220px] md:h-[240px] lg:h-[280px] w-full bg-gray-50 flex items-center justify-center">
        <img
          className="object-contain w-full h-full p-2 sm:p-3"
          src={product.imageUrl}
          alt={product.title}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      {/* Details */}
      <div className="p-2 sm:p-3 flex flex-col justify-between min-h-[110px] sm:min-h-[120px]">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 truncate">
          {product.brand}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-4 sm:leading-5 h-8 sm:h-10 overflow-hidden">
          {product.title}
        </p>

        {/* Price */}
        <div className="flex items-baseline space-x-1 sm:space-x-2 mt-auto">
          <span className="text-sm sm:text-lg font-bold text-gray-900">
            ₹{product.discountedPrice}
          </span>
          <span className="text-xs text-gray-500 line-through">
            ₹{product.price}
          </span>
          <span className="text-xs font-medium text-green-600">
            {product.discountPercent}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeSectionCard;
