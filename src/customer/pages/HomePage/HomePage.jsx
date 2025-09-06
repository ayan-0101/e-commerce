import React from "react";
import MainCarousel from "../../components/MainCarousel/MainCarousel";
import HomeSectionCarousel from "../../components/HomeSectionCarousel/HomeSectionCarousel";
import { mensKurta } from "../../../Data/mensKurta";
const HomePage = () => {
  return (
    <div>
      <MainCarousel />
      <div className="py-20 px-5 lg:px-10 sm:py-10 space-y-10 flex flex-col justify-center">
        {
          [1,1,1,1,1].map(()=>{
            return(
               <HomeSectionCarousel data={mensKurta} sectionName={"Men's Kurta"}/>
            )
          })
        }
       
      </div>
    </div>
  );
};

export default HomePage;
