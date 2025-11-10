import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../pages/ProductPage/ProductCard";
import { useEffect } from "react";
import { findProductAllProduct } from "../../../State/Product/Action";
import { get } from "lodash";

const SimilarProductsSection = ({ category }) => {  
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product || {});
  const products = get(productState, "products.content", productState.products || []) || [];
  
  useEffect(() => {
    if (!category) return;

    const categoryId =
      typeof category === "object" ? category.name : category.name;

    if (!categoryId) return;

    dispatch(findProductAllProduct({ category: categoryId, pageNumber: 1, pageSize: 9 }));
  }, [dispatch, category]); 

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Similar products</h3>

      <div className="flex flex-wrap gap-4 justify-center">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((item) => (
            <ProductCard
              key={item._id}
              product={item}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No similar products found.</p>
        )}
      </div>
    </div>
  );
};

export default SimilarProductsSection;
