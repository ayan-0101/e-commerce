import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../customer/pages/HomePage/HomePage';
import Cart from '../customer/components/Cart/Cart';
import Navigation from '../customer/components/Navigations/Navigation';
import Footer from '../customer/components/Footer/Footer';
import ProductPage from '../customer/pages/ProductPage/ProductPage';
import ProductDetails from '../customer/components/ProductDetails/ProductDetails';
import Checkout from '../customer/components/Checkout/Checkout';
import Order from '../customer/components/Order/Order';
import OrderDetails from '../customer/components/Order/OrderDetails';
import { ROUTES } from '../constants/routes';

const CustomerRoutes = () => {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.cart} element={<Cart />} />
        <Route path={ROUTES.productPage} element={<ProductPage />} />
        <Route path={ROUTES.productDetails} element={<ProductDetails />} />
        <Route path={ROUTES.checkout} element={<Checkout />} />
        <Route path={ROUTES.order} element={<Order />} />
        <Route path={ROUTES.orderDetails} element={<OrderDetails />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default CustomerRoutes;
