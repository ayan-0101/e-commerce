export const filters = [
  {
    id: "color",
    name: "Color",
    type: 'checkbox',
    options: [
      { value: "white", label: "White" },
      { value: "beige", label: "Beige" },
      { value: "blue", label: "Blue" },
      { value: "brown", label: "Brown" },
      { value: "green", label: "Green" },
      { value: "purple", label: "Purple" },
    ],
  },
  {
    id: "size",
    name: "Size",
    type: 'checkbox',
    options: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
    ],
  },
   {
    id: "priceRange",
    name: "Price Range",
    type: 'radio',
    options: [
        { value: '0-50', label: 'Under ₹50' },
        { value: '50-100', label: '₹50 - ₹100' },
        { value: '100-200', label: '₹100 - ₹200' },
        { value: '200-500', label: '₹200 - ₹500' },
        { value: '500-above', label: '₹500 & Above' },
      ],
  },
  {
    id: "discount",
    name: "Discount Range",
    type: 'radio',
    options: [
        { value: '10', label: '10% or more' },
        { value: '20', label: '20% or more' },
        { value: '30', label: '30% or more' },
        { value: '40', label: '40% or more' },
        { value: '50', label: '50% or more' },
      ],
  },
  {
    id: "availability",
    name: "Availability",
    type: 'radio',
    options: [
        { value: 'in-stock', label: 'In Stock' },
        { value: 'out-of-stock', label: 'Out of Stock' },
      ],
  },
];
