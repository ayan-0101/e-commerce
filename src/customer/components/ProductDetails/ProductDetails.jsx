import React, { useEffect, useMemo, useState } from "react";
import { Rating } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProductById } from "../../../State/Product/Action";
import { addItemToCart } from "../../../State/Cart/Action";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import SimilarProductsSection from "./SimilarProductsSection";
import { get } from "lodash";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  // The product slice might be { product: {...}, products: [...] } or product itself
  const productSlice = useSelector((s) => s.product || {});
  const productData = productSlice.product || productSlice || null;
  const productCategory = get(productData, 'category.name', '');
  const loading = productSlice.isFetching ?? productSlice.loading ?? false;
  const error = productSlice.error ?? null;

  // Local UI state
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Normalize sizes: support productData.size or productData.sizes (both arrays)
  const sizes = useMemo(() => {
    const raw = productData?.size ?? productData?.sizes ?? [];
    // ensure uniform shape: { name, quantity, _id }
    return Array.isArray(raw)
      ? raw.map((s) => ({
          name: s.name ?? s.size ?? s._id ?? String(s._id ?? ""),
          quantity: Number(s.quantity ?? s.qty ?? 0),
          _id: s._id ?? null,
        }))
      : [];
  }, [productData]);

  // Compute overall stock (sum of size quantities or product.quantity)
  const totalStock = useMemo(() => {
    if (!productData) return 0;
    if (sizes.length > 0) {
      return sizes.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0);
    }
    return Number(productData.quantity ?? 0) || 0;
  }, [productData, sizes]);

  // Effects: fetch product when id changes
  useEffect(() => {
    if (!params?.productId) return;
    dispatch(findProductById({ id: params.productId }));
    // reset selections when switching product
    setMainImageIndex(0);
    setSelectedSize(null);
    setQuantity(1);
  }, [params.productId, dispatch]);

  // auto-select size if there is exactly one available size
  useEffect(() => {
    if (sizes.length === 1 && sizes[0].quantity > 0) {
      setSelectedSize(sizes[0].name);
    }
  }, [sizes]);

  // Image list: support productData.imageUrl (single) or productData.images array
  // replace your existing images useMemo with this
  const images = useMemo(() => {
    if (!productData) return [];

    // 1) If productData.images exists:
    if (Array.isArray(productData.images) && productData.images.length > 0) {
      return productData.images
        .map((it) => {
          // support object or string
          if (!it) return null;
          if (typeof it === "string") {
            return { src: it, alt: productData.title || "Product image" };
          }
          // object case: prefer many possible keys
          const src = it.src || it.url || it.imageUrl || "";
          const alt =
            it.alt || it.altText || productData.title || "Product image";
          return src ? { src, alt } : null;
        })
        .filter(Boolean);
    }

    // 2) If imageUrl is an array of strings
    if (
      Array.isArray(productData.imageUrl) &&
      productData.imageUrl.length > 0
    ) {
      return productData.imageUrl
        .filter(Boolean)
        .map((src) => ({ src, alt: productData.title || "Product image" }));
    }

    // 3) Single-string fallbacks
    const single =
      productData.imageUrl ||
      productData.image ||
      productData.imageUrlString ||
      "";
    return single
      ? [{ src: single, alt: productData.title || "Product image" }]
      : [];
  }, [productData]);

  // Safe display values
  const title = productData?.title || productData?.name || "Product";
  const brand = productData?.brand || productData?.manufacturer || "";
  const priceVal =
    productData?.discountedPrice ??
    productData?.price ??
    productData?.sellingPrice ??
    null;
  const price = typeof priceVal === "number" ? `₹${priceVal}` : priceVal;
  const originalPrice =
    productData?.price && productData?.discountedPrice
      ? `₹${productData.price}`
      : productData?.originalPrice;

  // Quantity controls
  const changeQuantity = (delta) => {
    setQuantity((q) => {
      const next = q + delta;
      if (next < 1) return 1;

      // If size selected, cap by that size's available quantity
      if (selectedSize && sizes.length > 0) {
        const sizeObj = sizes.find(
          (s) => s.name === selectedSize || s._id === selectedSize
        );
        if (sizeObj) {
          return Math.min(Math.max(1, next), Math.max(1, sizeObj.quantity));
        }
      }

      return Math.min(next, 99);
    });
  };

  const handleSelectSize = (sizeObj) => {
    if (!sizeObj) return;
    if (Number(sizeObj.quantity) <= 0) return;
    setSelectedSize(sizeObj.name);
    setQuantity(1);
  };

  // Proper isOutOfStock calculation
  const isOutOfStock = totalStock <= 0;

  const handleAddToCart = async () => {
    // require size if sizes exist
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size before adding to cart.", {
        position: "top-center",
      });
      return;
    }
    if (isOutOfStock) {
      toast.error("This item is out of stock.", { position: "top-center" });
      return;
    }

    const payload = {
      productId: productData?._id ?? productData?.id,
      quantity,
      size: selectedSize,
    };

    try {
      const result = dispatch(addItemToCart(payload));
      toast.success("Added to cart", { position: "top-center" });
      return result;
    } catch (err) {
      toast.error("Could not add to cart. Try again.", {
        position: "top-center",
      });
    }
  };

  // Back button handler
  const handleBack = () => {
    // Try to go back in history, if no history go to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // Skeleton while loading
  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-lg" />
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/6 mb-6" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!productData || error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Product not found
        </h2>
        <p className="text-gray-500 mb-6">
          {String(error ?? "We couldn't load this product.")}
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Go to home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Toaster />

      {/* Back Button */}
      <div className="flex justify-start">
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
      </div>

      <div className="pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Left: Images */}
          <div className="flex flex-col">
            <div className="bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-square">
              <img
                src={images[mainImageIndex]?.src || "/placeholder.png"}
                alt={images[mainImageIndex]?.alt || title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex gap-3 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImageIndex(idx)}
                  className={classNames(
                    "w-20 h-20 rounded-md overflow-hidden border focus:outline-none",
                    idx === mainImageIndex
                      ? "ring-2 ring-purple-500 border-transparent"
                      : "border-gray-200"
                  )}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `Product image ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="mt-10 lg:mt-0">
            <div className="text-sm text-gray-600 mb-1">{brand}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

            <div className="flex items-baseline gap-4 mb-4">
              <div className="text-3xl font-extrabold text-gray-900">
                {price != null ? price : "—"}
              </div>
              {originalPrice && (
                <div className="text-lg text-gray-500 line-through">
                  {originalPrice}
                </div>
              )}
              {productData.discountPercentage && (
                <div className="text-sm text-green-600 font-medium">
                  {productData.discountPercentage}% OFF
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Rating
                value={Number(productData.rating ?? 0)}
                precision={0.5}
                readOnly
              />
              <div className="text-sm text-gray-600">
                {(productData.numRatings ?? 0).toLocaleString()} ratings
              </div>
            </div>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((s, i) => {
                    const qty = Number(s.quantity ?? 0);
                    const label = s.name ?? `Size ${i + 1}`;
                    const isSelected = selectedSize === label;
                    return (
                      <button
                        key={s._id ?? label}
                        type="button"
                        onClick={() => handleSelectSize(s)}
                        disabled={qty <= 0}
                        aria-pressed={isSelected}
                        className={classNames(
                          "w-12 h-12 border rounded-md flex items-center justify-center text-sm font-medium focus:outline-none",
                          qty <= 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : isSelected
                            ? "ring-2 ring-purple-500 bg-white text-gray-900 border-transparent"
                            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {selectedSize
                    ? `${
                        sizes.find((x) => x.name === selectedSize)?.quantity ??
                        "—"
                      } items available`
                    : `${totalStock} items available`}
                </div>
              </div>
            )}

            {/* Quantity & Add to cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => changeQuantity(-1)}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="px-4 py-2 w-14 text-center">{quantity}</div>
                <button
                  onClick={() => changeQuantity(1)}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={classNames(
                  isOutOfStock || (sizes.length > 0 && !selectedSize)
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700",
                  "py-3 px-6 rounded-md text-sm font-semibold transition-colors"
                )}
                aria-disabled={
                  isOutOfStock || (sizes.length > 0 && !selectedSize)
                }
              >
                Add to cart
              </button>
            </div>

            {/* Short description */}
            <div className="prose-sm text-gray-700 mb-6">
              <p>{productData.description}</p>
            </div>

            {/* Highlights */}
            {Array.isArray(productData.highlights) &&
              productData.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Highlights
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {productData.highlights.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>

        {/* Reviews & Rating products */}
        <section className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Ratings & Reviews</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((id) => (
                  <div
                    key={id}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">U</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">User {id}</h4>
                          <Rating
                            value={4.5}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                        </div>
                        <p className="text-sm text-gray-700">
                          Great product, loved it!
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          2 days ago
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Product Ratings</h3>
              <div className="flex items-center gap-4 mb-4">
                <Rating
                  value={Number(productData.rating ?? 0)}
                  precision={0.5}
                  readOnly
                />
                <div className="text-sm text-gray-600">
                  {(productData.numRatings ?? 0).toLocaleString()} Ratings
                </div>
              </div>

              {[
                {
                  label: "Excellent",
                  value: 80,
                  count: 19259,
                  color: "bg-green-500",
                },
                {
                  label: "Very Good",
                  value: 70,
                  count: 15420,
                  color: "bg-green-400",
                },
                {
                  label: "Good",
                  value: 50,
                  count: 5830,
                  color: "bg-yellow-500",
                },
                {
                  label: "Average",
                  value: 30,
                  count: 1850,
                  color: "bg-orange-500",
                },
                { label: "Poor", value: 15, count: 448, color: "bg-red-500" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <div className="w-20 text-sm text-gray-700">{r.label}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${r.color} h-2 rounded-full`}
                      style={{ width: `${r.value}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">
                    {r.count.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-10">
          <SimilarProductsSection category={productCategory}/>
        </section>
      </div>
    </div>
  );
}
