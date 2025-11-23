import { api } from "../../ApiConfig/apiConfig";
import {
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_HISTORY_FAILURE,
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_SUCCESS,
} from "./ActionTypes";

export const createOrder = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });

  try {
    const { data } = await api.post(`api/orders`, reqData.address);

    if (data?.data?.id || data?.data?._id) {
      const orderId = data.data.id || data.data._id;
      reqData.navigate(`/checkout?step=3&order_id=${orderId}`);
    } else if (data?.id || data?._id) {
      const orderId = data.id || data._id;
      reqData.navigate(`/checkout?step=3&order_id=${orderId}`);
    }

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data.data || data,
    });

    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create order";

    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload: errorMessage,
    });

    throw error;
  }
};

export const getOrderById = (reqData) => async (dispatch) => {
  dispatch({ type: GET_ORDER_BY_ID_REQUEST });

  try {
    const orderId = typeof reqData === "string" ? reqData : reqData?.orderId;

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    const { data } = await api.get(`api/orders/${orderId}`);

    dispatch({
      type: GET_ORDER_BY_ID_SUCCESS,
      payload: data.data || data,
    });

    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch order";

    dispatch({
      type: GET_ORDER_BY_ID_FAILURE,
      payload: errorMessage,
    });

    throw error;
  }
};

export const getOrderHistory = () => async (dispatch) => {
  dispatch({ type: GET_ORDER_HISTORY_REQUEST });

  try {
    const { data } = await api.get("/api/orders/user");
    const payload = data?.data ?? data;

    dispatch({
      type: GET_ORDER_HISTORY_SUCCESS,
      payload,
    });
    return data;
  } catch (error) {
    const payload = error?.response?.data ?? error?.message ?? String(error);
    dispatch({
      type: GET_ORDER_HISTORY_FAILURE,
      payload,
    });
    throw error;
  }
};
