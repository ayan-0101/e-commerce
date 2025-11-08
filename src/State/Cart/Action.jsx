import { api } from "../../ApiConfig/apiConfig";
import {
  ADD_ITEM_TO_CART_FAILURE,
  ADD_ITEM_TO_CART_REQUEST,
  ADD_ITEM_TO_CART_SUCCESS,
  GET_USER_CART_FAILURE,
  GET_USER_CART_REQUEST,
  GET_USER_CART_SUCCESS,
  REMOVE_ITEM_FROM_CART_FAILURE,
  REMOVE_ITEM_FROM_CART_REQUEST,
  REMOVE_ITEM_FROM_CART_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
} from "./ActionType";

export const getUserCart = () => async (dispatch) => {
  dispatch({ type: GET_USER_CART_REQUEST });
  try {
    const { data } = await api.get(`api/cart`);
    const cartData = data.data || data;
    dispatch({ type: GET_USER_CART_SUCCESS, payload: cartData });
  } catch (error) {
    dispatch({ type: GET_USER_CART_FAILURE, payload: error.message });
  }
};

export const addItemToCart = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
  try {
    // Call add endpoint
    await api.put(`api/cart/add`, reqData);
    const { data } = await api.get(`api/cart`);
    const cartData = data.data || data;
    dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: cartData });
  } catch (error) {
    dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: error.message });
  }
};

//  Remove item then refetch cart
export const removeItemFromCart = (cartItemId) => async (dispatch) => {
  dispatch({ type: REMOVE_ITEM_FROM_CART_REQUEST });
  try {
    await api.delete(`api/cart-items/${cartItemId}`);
    const { data } = await api.get(`api/cart`);
    const cartData = data.data || data;
    dispatch({ type: REMOVE_ITEM_FROM_CART_SUCCESS, payload: cartData });
  } catch (error) {
    dispatch({ type: REMOVE_ITEM_FROM_CART_FAILURE, payload: error.message });
  }
};

//  Update item then refetch cart
export const updateCartItem = (cartItemId, updateData) => async (dispatch) => {
  dispatch({ type: UPDATE_CART_ITEM_REQUEST });
  try {
    await api.put(`api/cart-items/${cartItemId}`, updateData);
    const { data } = await api.get(`api/cart`);
    const cartData = data.data || data;
    dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: cartData });
  } catch (error) {
    dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: error.message });
  }
};
