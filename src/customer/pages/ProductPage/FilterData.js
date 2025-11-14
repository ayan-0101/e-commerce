export const filters = [
  {
    id: "color",
    name: "Color",
    type: "checkbox",
    options: [
      { value: "white", label: "White" },
      { value: "black", label: "Black" },
      { value: "gray", label: "Gray" },
      { value: "beige", label: "Beige" },
      { value: "red", label: "Red" },
      { value: "maroon", label: "Maroon" },
      { value: "pink", label: "Pink" },
      { value: "orange", label: "Orange" },
      { value: "yellow", label: "Yellow" },
      { value: "lime", label: "Lime" },
      { value: "green", label: "Green" },
      { value: "teal", label: "Teal" },
      { value: "blue", label: "Blue" },
      { value: "navy", label: "Navy" },
      { value: "purple", label: "Purple" },
      { value: "brown", label: "Brown" },
      { value: "gold", label: "Gold" },
      { value: "silver", label: "Silver" },
      { value: "multicolor", label: "Multicolor" },
      { value: "printed", label: "Printed / Patterned" }
    ],
  },
  {
    id: "size",
    name: "Size",
    type: "checkbox",
    options: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
      { value: "xxl", label: "XXL" },
      { value: "free", label: "Free / One size" }
    ],
  },
  {
    id: "priceRange",
    name: "Price range",
    type: "radio",
    options: [
      { value: "0-199", label: "Under ₹200" },
      { value: "200-499", label: "₹200 - ₹499" },
      { value: "500-999", label: "₹500 - ₹999" },
      { value: "1000-1999", label: "₹1,000 - ₹1,999" },
      { value: "2000-4999", label: "₹2,000 - ₹4,999" },
      { value: "5000-above", label: "₹5,000 & above" },
    ],
  },
  {
    id: "discount",
    name: "Discount",
    type: "radio",
    options: [
      { value: "10", label: "10% or more" },
      { value: "20", label: "20% or more" },
      { value: "30", label: "30% or more" },
      { value: "40", label: "40% or more" },
      { value: "50", label: "50% or more" },
    ],
  },
  {
    id: "availability",
    name: "Availability",
    type: "radio",
    options: [
      { value: "in-stock", label: "In stock" },
      { value: "out-of-stock", label: "Out of stock" },
      { value: "preorder", label: "Pre-order" },
    ],
  },
];

export const sortOptions = [
  { name: "Price: Low to High", value: "price_low" },
  { name: "Price: High to Low", value: "price_high" },
  { name: "Newest", value: "newest" },
  { name: "Top Rated", value: "rating_desc" },
];