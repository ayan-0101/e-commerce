import { Rating } from "@mui/material";

const product = {
  name: "Casual Puff Sleeves Solid Women White Top",
  brand: "Universaloutfit",
  price: "₹199",
  originalPrice: "₹211",
  discountPercent: 5,
  rating: 3.5,
  href: "#",
  breadcrumbs: [
    { id: 1, name: "Men", href: "#" },
    { id: 2, name: "Clothing", href: "#" },
  ],
  images: [
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
      alt: "Two each of gray, white, and black shirts laying flat.",
    },
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg",
      alt: "Model wearing plain black basic tee.",
    },
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg",
      alt: "Model wearing plain gray basic tee.",
    },
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg",
      alt: "Model wearing plain white basic tee.",
    },
  ],
  colors: [
    {
      id: "white",
      name: "White",
      classes: "bg-white checked:outline-gray-400",
    },
    {
      id: "gray",
      name: "Gray",
      classes: "bg-gray-200 checked:outline-gray-400",
    },
    {
      id: "black",
      name: "Black",
      classes: "bg-gray-900 checked:outline-gray-900",
    },
  ],
  sizes: [
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: false },
  ],
  description:
    "A traditional garment embodying elegance and grace. Crafted from fine fabrics, it features intricate embroidery and a relaxed fit, providing comfort and style.",
  highlights: [
    "Hand cut and sewn locally",
    "Dyed with our proprietary colors",
    "Pre-washed & pre-shrunk",
    "Ultra-soft 100% cotton",
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
};

const reviews = {
  href: "#",
  totalCount: 117,
  totalRatings: 42807,
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  return (
    <div className="bg-white">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    fill="currentColor"
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a
                href={product.href}
                aria-current="page"
                className="font-medium text-gray-500"
              >
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Main product section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start pt-10">
            {/* Image gallery */}
            <div className="flex flex-col">
              {/* Large main image */}
              <div className="aspect-square w-full max-w-lg mx-auto overflow-hidden rounded-lg mb-4">
                <img
                  alt={product.images[0].alt}
                  src={product.images[0].src}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail images */}
              <div className="flex gap-2 justify-center">
                {product.images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 overflow-hidden rounded-lg border"
                  >
                    <img
                      alt={image.alt}
                      src={image.src}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-75"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="mt-10 lg:mt-0">
              {/* Brand */}
              <div className="flex text-lg font-medium text-gray-700 mb-2">
                {product.brand}
              </div>

              {/* Product title */}
              <h1 className="flex text-3xl font-bold text-gray-900 sm:text-2xl mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price and discount */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="text-lg text-green-600 font-medium">
                    {product.discountPercent}% Off
                  </span>
                )}
              </div>

              {/* Reviews */}
              <div className="flex items-center mb-8">
                <Rating
                  name="product-rating"
                  value={product.rating}
                  precision={0.5}
                  readOnly
                  sx={{ fontSize: "1.5rem" }}
                />
                <span className="ml-4 text-base text-gray-600">
                  {reviews.totalRatings.toLocaleString()} Ratings
                </span>
                <a href={reviews.href} className="ml-4 text-base text-blue-600">
                  {reviews.totalCount} reviews
                </a>
              </div>

              {/* Size selection */}
              <div className="mb-8">
                <h3 className="flex text-lg font-medium text-gray-900 mb-4">Size</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      disabled={!size.inStock}
                      className={classNames(
                        size.inStock
                          ? "border-gray-300 text-gray-900 hover:border-gray-900 hover:bg-gray-50"
                          : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100 opacity-60",
                        "w-12 h-12 border rounded-lg text-base font-medium flex items-center justify-center"
                      )}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart button */}
              <button className="bg-purple-600 text-white py-4 px-12 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors duration-200 mb-10">
                ADD TO CART
              </button>

              {/* Description */}
              <div className="mb-8">
                <p className="text-base text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Highlights
                </h3>
                <ul className="space-y-3">
                  {product.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start text-base text-gray-700"
                    >
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-4 mt-2 flex-shrink-0"></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
