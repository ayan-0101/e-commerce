import "./App.css";
import Footer from "./customer/components/Footer/Footer";
import Navigation from "./customer/components/Navigations/Navigation";
import HomePage from "./customer/pages/HomePage";

function App() {
  return (
    <div className="App">
      <Navigation />
      <div>
        <HomePage/>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
