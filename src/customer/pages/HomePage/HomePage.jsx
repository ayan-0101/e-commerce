import React, { useEffect } from "react";
import MainCarousel from "../../components/MainCarousel/MainCarousel";
import HomeSectionCarousel from "../../components/HomeSectionCarousel/HomeSectionCarousel";
import { useDispatch, useSelector } from "react-redux";
import { get, isEmpty } from "lodash";
import { findProductAllProduct } from "../../../State/Product/Action";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { product } = useSelector((state) => state);
  const products = get(product, "products.content", []) || [];
  const query = new URLSearchParams(location.search);
  const entries = Array.from(query.entries());


  useEffect(()=>{
    dispatch(findProductAllProduct({ pageNumber: 1, pageSize: 10 }));
  }, [dispatch]);
  return (
    <div>
      <MainCarousel />
      <div className="py-20 px-5 lg:px-10 sm:py-10 space-y-10 flex flex-col justify-center">
        <HomeSectionCarousel data={products} />
        {isEmpty(entries) && <HomeSectionCarousel data={products} />}
      </div>
    </div>
  );
};

export default HomePage;
