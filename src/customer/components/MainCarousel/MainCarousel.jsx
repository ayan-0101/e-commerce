import React from "react";
import { map } from "lodash";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { mainCarouselData } from "../../ComponentData/mainCarouselData";

const items = map(mainCarouselData, (items) => (
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
