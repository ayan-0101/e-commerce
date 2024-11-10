import React from "react";
import MainCarousel from "../../components/MainCarousel/MainCarousel";
import HomeSectionCarousel from "../../components/HomeSectionCarousel/HomeSectionCarousel";
import { mensKurta } from "../../../Data/mensKurta";
const HomePage = () => {
  return (
    <div>
      <MainCarousel />
      <div className="py-20 px-5 lg:px-10 space-y-10 flex flex-col justify-center">
        <HomeSectionCarousel data={mensKurta} sectionName={"Men's Kurta"}/>
        <HomeSectionCarousel data={mensKurta} sectionName={"Men's Shoes"}/>
        <HomeSectionCarousel data={mensKurta} sectionName={"Men's Shirt"}/>
        <HomeSectionCarousel data={mensKurta} sectionName={"Women's Saree"}/>
        <HomeSectionCarousel data={mensKurta} sectionName={"Women's Kurta"}/>
        <HomeSectionCarousel data={mensKurta} sectionName={"Women's Shoes"}/>
      </div>
    </div>
  );
};

export default HomePage;
