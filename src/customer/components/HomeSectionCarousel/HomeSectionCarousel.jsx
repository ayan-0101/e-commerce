import React, { useState, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import { Button } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const HomeSectionCarousel = ({ data = [], sectionName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null); // Reference to AliceCarousel
  const itemsToShow = 5.5;

  const responsive = {
    0: { items: 1 },
    720: { items: 2 },
    1024: { items: itemsToShow },
  };

  const totalItems = data.length;

  const slidePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      carouselRef.current.slidePrev(); // Use carousel method
    }
  };

  const slideNext = () => {
    if (activeIndex < totalItems - itemsToShow) {
      setActiveIndex((prev) => prev + 1);
      carouselRef.current.slideNext(); // Use carousel method
    }
  };

  const syncActiveIndex = ({ item }) => {
    setActiveIndex(item);
  };

  const items = data
    .slice(0, 10)
    .map((item, index) => <HomeSectionCard key={index} product={item} />);

  return (
    <div className="border">
      <div className="px-4 lg:px-8 ">
      <h2 className="text-2xl font-extrabold text-gray-800 py-5">
        {sectionName}
      </h2>
        <div className="relative p-5">
          <AliceCarousel
            ref={carouselRef} // Reference the carousel
            items={items}
            disableButtonsControls={true}
            responsive={responsive}
            disableDotsControls={true}
            activeIndex={activeIndex}
            onSlideChanged={syncActiveIndex}
          />
          {/* Ensure sliding buttons are only shown within bounds */}
          {activeIndex < totalItems - itemsToShow && (
            <Button
              className="z-50"
              onClick={slideNext}
              variant="contained"
              sx={{
                position: "absolute",
                top: "8rem",
                right: "0rem",
                transform: "translateX(50%) rotate(90deg)",
              }}
              color="white"
              aria-label="next"
            >
              <KeyboardArrowLeftIcon sx={{ transform: "rotate(90deg)" }} />
            </Button>
          )}

          {activeIndex > 0 && (
            <Button
              className="z-50"
              onClick={slidePrev}
              variant="contained"
              sx={{
                position: "absolute",
                top: "8rem",
                left: "0rem",
                transform: "translateX(-50%) rotate(-90deg)",
              }}
              color="white"
              aria-label="prev"
            >
              <KeyboardArrowLeftIcon sx={{ transform: "rotate(90deg)" }} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSectionCarousel;
