import { api } from "../../ApiConfig/apiConfig";
import { FIND_ALL_PRODUCTS_FAILURE, FIND_ALL_PRODUCTS_REQUEST, FIND_ALL_PRODUCTS_SUCCESS, FIND_PRODUCT_BY_ID_FAILURE, FIND_PRODUCT_BY_ID_REQUEST, FIND_PRODUCT_BY_ID_SUCCESS } from "./ActionType";

export const findProductAllProduct = (reqData) => async (dispatch) => {
  dispatch({ type: FIND_ALL_PRODUCTS_REQUEST });
  const {
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    category,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqData;
  try {
    // Build a safe query string (omit undefined/null/empty values)
    const params = new URLSearchParams();

    const add = (key, val) => {
      if (val === undefined || val === null || val === "") return;
      if (Array.isArray(val)) {
        // append multiple values for the same key
        val.forEach((v) => params.append(key, v));
      } else {
        params.append(key, val);
      }
    };

    add("color", color);
    add("sizes", sizes);
    add("minPrice", minPrice);
    add("maxPrice", maxPrice);
    add("minDiscount", minDiscount);
    add("category", category);
    add("sort", sort);
    add("stock", stock);
    add("pageNumber", pageNumber);
    add("pageSize", pageSize);

    const qs = params.toString();
    const url = `/api/products${qs ? `?${qs}` : ""}`;

    const { data } = await api.get(url);
    dispatch({ type: FIND_ALL_PRODUCTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FIND_ALL_PRODUCTS_FAILURE, payload: error.message });
  }
};

export const findProductById = (reqData) => async (dispatch) => {
  const { id } = reqData;
  dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/products/id/${id}`);
    dispatch({ type: FIND_PRODUCT_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FIND_PRODUCT_BY_ID_FAILURE, payload: error.message });
  }
};