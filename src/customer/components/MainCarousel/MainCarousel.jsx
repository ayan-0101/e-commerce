import React from "react";
import { map } from "lodash";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { homeCarouseldata } from "./HomeCarouselData";

const items = map(homeCarouseldata, (items) => (
  <img
    className="cursor-pointer h-1/5 w-full"
    role="presentation"
    src={items.image}
    alt="hello"
  />
));
const MainCarousel = () => (
  <AliceCarousel
    items={items} 
    disableButtonsControls
    autoPlay
    autoPlayInterval={1000}
    infinite
   />
);

export default MainCarousel;
