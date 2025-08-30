import "./App.css";
import Cart from "./customer/components/Cart/Cart";
import Footer from "./customer/components/Footer/Footer";
import Navigation from "./customer/components/Navigations/Navigation";
import ProductDetails from "./customer/components/ProductDetails/ProductDetails";
import HomePage from "./customer/pages/HomePage/HomePage";
import ProductPage from "./customer/pages/ProductPage/ProductPage";

function App() {
  return (
    <div className="App">
      <Navigation />
      <div>
        {/* <HomePage/> */}
        {/* <ProductPage/> */}
        {/* <ProductDetails/> */}
        {/* <Cart/> */}
      </div>
      <Footer/>
    </div>
  );
}

export default App;
