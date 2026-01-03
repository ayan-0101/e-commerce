import { api } from "../../ApiConfig/apiConfig";
import {
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_ALL_ORDERS_FAILURE,
  GET_ALL_ORDERS_REQUEST,
  GET_ALL_ORDERS_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_HISTORY_FAILURE,
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_SUCCESS,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
} from "./ActionTypes";

export const createOrder = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });

  try {
    const { data } = await api.post(`api/orders`, reqData.address);

    // Extract order data - backend returns { success, message, data: orderObject }
    const orderData = data.data || data;
    
    // Extract order ID
    const orderId = orderData._id || orderData.id;

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: orderData,
    });

    // Return the order data with success flag so component can handle navigation
    return {
      success: true,
      payload: orderData,
      orderId: orderId
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create order";

    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload: errorMessage,
    });

    // Return error info
    return {
      success: false,
      error: errorMessage
    };
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

    const orderData = data.data || data;

    dispatch({
      type: GET_ORDER_BY_ID_SUCCESS,
      payload: orderData,
    });

    return {
      success: true,
      payload: orderData
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch order";

    dispatch({
      type: GET_ORDER_BY_ID_FAILURE,
      payload: errorMessage,
    });

    return {
      success: false,
      error: errorMessage
    };
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
    
    return {
      success: true,
      payload: payload
    };
  } catch (error) {
    const errorMessage = error?.response?.data?.message ?? error?.message ?? String(error);
    
    dispatch({
      type: GET_ORDER_HISTORY_FAILURE,
      payload: errorMessage,
    });
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const getAllOrders = () => async (dispatch) => {
  dispatch({ type: GET_ALL_ORDERS_REQUEST });

  try {
    const { data } = await api.get("/api/admin/orders");
    const payload = data?.data ?? data;

    dispatch({
      type: GET_ALL_ORDERS_SUCCESS,
      payload,
    });

    return {
      success: true,
      payload: payload
    };
  } catch (error) {
    const errorMessage = error?.response?.data?.message ?? error?.message ?? String(error);
    
    dispatch({
      type: GET_ALL_ORDERS_FAILURE,
      payload: errorMessage,
    });
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
  dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

  try {
    const { data } = await api.put("/api/admin/orders/status", {
      orderId,
      status,
    });

    dispatch({
      type: UPDATE_ORDER_STATUS_SUCCESS,
      payload: data.data || data,
    });

    return {
      success: true,
      payload: data.data || data
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update order status";

    dispatch({
      type: UPDATE_ORDER_STATUS_FAILURE,
      payload: errorMessage,
    });

    return {
      success: false,
      error: errorMessage
    };
  }
};

export const deleteOrder = (orderId) => async (dispatch) => {
  dispatch({ type: DELETE_ORDER_REQUEST });

  try {
    const { data } = await api.delete(`/api/admin/orders/${orderId}`);

    dispatch({
      type: DELETE_ORDER_SUCCESS,
      payload: orderId,
    });

    return {
      success: true,
      payload: data
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete order";

    dispatch({
      type: DELETE_ORDER_FAILURE,
      payload: errorMessage,
    });

    return {
      success: false,
      error: errorMessage
    };
  }
};