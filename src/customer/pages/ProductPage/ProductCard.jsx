import { useNavigate } from "react-router-dom";

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23f3f4f6' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial, Helvetica, sans-serif' font-size='20'%3EImage unavailable%3C/text%3E%3C/svg%3E";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!product?._id) return;
    navigate(`/product/${product._id}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate();
    }
  };

  const fmt = (value) => {
    if (value == null || isNaN(Number(value))) return "";
    // Use product.currency if provided, otherwise default to INR (change if you prefer USD)
    const currency = product?.currency || "INR";
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(Number(value));
    } catch {
      // fallback plain formatting
      return Number(value).toLocaleString();
    }
  };

  const discounted = product?.discountedPrice ?? product?.price;
  const original = product?.price;

  const discountBadge =
    product?.discountPercentage && product.discountPercentage > 0;

  const rating = product?.rating; // expected 0-5

  return (
    <div
      role="button"
      aria-label={`View product ${product?.title || product?.brand || ""}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onClick={handleNavigate}
      className="productCard p-3 w-72 md:w-80 m-3 bg-white rounded-2xl overflow-hidden shadow-sm transition transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-64 md:h-72 bg-gray-100">
        {/* Discount / Stock badges */}
        {discountBadge && (
          <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-md bg-emerald-600 text-white text-xs font-semibold shadow">
            {product.discountPercentage}% off
          </div>
        )}
        {product?.countInStock === 0 && (
          <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-md bg-red-600 text-white text-xs font-semibold shadow">
            Out of stock
          </div>
        )}

        <img
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          src={product?.imageUrl || fallbackImage}
          alt={product?.title || product?.brand || "product image"}
          className="h-full w-full object-cover object-top"
        />
      </div>

      {/* Text content */}
      <div className="p-3 space-y-2">
        {/* Brand + Title */}
        <div>
          <p className="text-sm font-semibold text-gray-700 truncate">
            {product?.brand}
          </p>
          <p
            title={product?.title}
            className="text-sm text-gray-800 font-medium mt-0.5 line-clamp-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product?.title}
          </p>
        </div>

        {/* Rating */}
        {typeof rating === "number" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < Math.round(rating);
                return (
                  <svg
                    key={i}
                    viewBox="0 0 20 20"
                    fill={filled ? "currentColor" : "none"}
                    stroke="currentColor"
                    className={`w-4 h-4 ${filled ? "text-amber-400" : "text-gray-300"}`}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="0"
                      d="M10 1.5l2.6 5.27L18 7.9l-4 3.9L15.2 18 10 15.2 4.8 18 6 11.8 2 7.9l5.4-.13L10 1.5z"
                    />
                  </svg>
                );
              })}
            </div>
            <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-3">
          <span className="font-bold text-lg text-gray-900">
            {fmt(discounted)}
          </span>
          {original && Number(original) > Number(discounted) && (
            <span className="text-sm line-through text-gray-400">
              {fmt(original)}
            </span>
          )}
        </div>

        {/* Small CTA */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {product?.shortDesc || ""}
          </span>
          <button
            type="button"
            onClick={(e) => {
              // stop propagation so clicking the small button won't re-trigger navigation twice
              e.stopPropagation();
              // Example inline functionality: open product page in new tab
              if (product?._id) window.open(`/product/${product._id}`, "_blank");
            }}
            className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
