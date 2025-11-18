import { api } from "../../ApiConfig/apiConfig";
import {
  CREATE_NEW_PRODUCT_FAILURE,
  CREATE_NEW_PRODUCT_REQUEST,
  CREATE_NEW_PRODUCT_SUCCESS,
  DELETE_PRODUCT_BY_ID_FAILURE,
  DELETE_PRODUCT_BY_ID_REQUEST,
  DELETE_PRODUCT_BY_ID_SUCCESS,
  FIND_ALL_PRODUCTS_FAILURE,
  FIND_ALL_PRODUCTS_REQUEST,
  FIND_ALL_PRODUCTS_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  UPDATE_PRODUCT_BY_ID_FAILURE,
  UPDATE_PRODUCT_BY_ID_REQUEST,
  UPDATE_PRODUCT_BY_ID_SUCCESS,
} from "./ActionType";

/**
 * Helper: convert value (string|array) into a query value that backend expects.
 * We'll send arrays as comma-separated values (e.g. size=xs,s,m) which your service handles.
 */
const toQueryValue = (val) => {
  if (val === undefined || val === null) return undefined;
  if (Array.isArray(val))
    return val
      .map((v) => String(v).trim())
      .filter(Boolean)
      .join(",");
  return String(val).trim();
};

export const findProductAllProduct =
  (reqData = {}) =>
  async (dispatch) => {
    dispatch({ type: FIND_ALL_PRODUCTS_REQUEST });

    try {
      const {
        title,
        color,
        size,
        minPrice,
        maxPrice,
        minDiscount,
        category,
        sort,
        stock,
        pageNumber,
        pageSize,
      } = reqData;

      const params = new URLSearchParams();

      const add = (key, val) => {
        const qv = toQueryValue(val);
        if (!qv && qv !== 0) return;
        params.append(key, qv);
      };

      add("title", title);
      add("color", color);
      add("size", size);
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

      // payload shape: backend returns { content, currentPage, totalPages } or similar
      dispatch({ type: FIND_ALL_PRODUCTS_SUCCESS, payload: data });

      // return data so caller can await and use it
      return data;
    } catch (error) {
      // Prefer useful server message if available
      const payload = error?.response?.data ?? error?.message ?? String(error);
      console.error("findProductAllProduct error:", payload);
      dispatch({ type: FIND_ALL_PRODUCTS_FAILURE, payload });
      // rethrow so callers know the request failed
      throw error;
    }
  };

export const findProductById =
  (reqData = {}) =>
  async (dispatch) => {
    const { id } = reqData;
    dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });
    try {
      // NOTE: adjust the path if your backend uses a different route (e.g. /api/products/:id)
      const { data } = await api.get(`/api/products/id/${id}`);
      dispatch({ type: FIND_PRODUCT_BY_ID_SUCCESS, payload: data });
      return data;
    } catch (error) {
      const payload = error?.response?.data ?? error?.message ?? String(error);
      console.error("findProductById error:", payload);
      dispatch({ type: FIND_PRODUCT_BY_ID_FAILURE, payload });
      throw error;
    }
  };

export const deleteProductById = (productId) => async (dispatch) => {
  dispatch({ type: DELETE_PRODUCT_BY_ID_REQUEST });
  try {
    const { data } = await api.delete(`/api/admin/products/${productId}`);
    dispatch({ type: DELETE_PRODUCT_BY_ID_SUCCESS, payload: productId });
    return data;
  } catch (error) {
    const payload = error?.response?.data ?? error?.message ?? String(error);
    console.error("deleteProductById error:", payload);
    dispatch({ type: DELETE_PRODUCT_BY_ID_FAILURE, payload });
    throw error;
  }
};

export const updateProductById =
  (productId, updatedData = {}) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_BY_ID_REQUEST });
    try {
      const { data } = await api.put(
        `/api/admin/products/${productId}`,
        updatedData
      );
      dispatch({ type: UPDATE_PRODUCT_BY_ID_SUCCESS, payload: data });
      return data;
    } catch (error) {
      const payload = error?.response?.data ?? error?.message ?? String(error);
      console.error("updateProductById error:", payload);
      dispatch({ type: UPDATE_PRODUCT_BY_ID_FAILURE, payload });
      throw error;
    }
  };

export const createNewProduct =
  (reqData = {}) =>
  async (dispatch) => {
    dispatch({ type: CREATE_NEW_PRODUCT_REQUEST });
    try {
      const { data } = await api.post(`/api/admin/products/`, reqData);
      dispatch({ type: CREATE_NEW_PRODUCT_SUCCESS, payload: data });
      console.log("object", data);
      return data;
    } catch (error) {
      const payload = error?.response?.data ?? error?.message ?? String(error);
      console.error("createNewProduct error:", payload);
      dispatch({ type: CREATE_NEW_PRODUCT_FAILURE, payload });
      throw error;
    }
  };
