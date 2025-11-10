import React, { useEffect } from "react";
import MainCarousel from "../../components/MainCarousel/MainCarousel";
import HomeSectionCarousel from "../../components/HomeSectionCarousel/HomeSectionCarousel";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import { findProductAllProduct } from "../../../State/Product/Action";

const HomePage = () => {
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state);
  const products = get(product, "products.content", []) || [];
  console.log("objects", product);

  useEffect(()=>{
    dispatch(findProductAllProduct({ pageNumber: 1, pageSize: 10 }));
  }, [dispatch]);
  return (
    <div>
      <MainCarousel />
      <div className="py-20 px-5 lg:px-10 sm:py-10 space-y-10 flex flex-col justify-center">
        {[1,1].map(() => {
          return (
            <HomeSectionCarousel data={products} />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
