export const ROUTES = {
  home: "/",                               // Homepage
  cart: "/cart",                           // Cart Page
  checkout: "/checkout",                   // Checkout Page

  // Product-related
  productPage: "/:levelOne/:levelTwo/:levelThree",   // Dynamic product listing
  productDetails: "/:product/:productId",        // Specific product details

  // Orders
  order: "/order",                        // All Orders Page
  orderDetails: "/order/:orderId",         // Single Order Details Page

  
};
