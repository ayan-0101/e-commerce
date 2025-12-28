import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  GET_ALL_ORDERS_REQUEST,
  GET_ALL_ORDERS_SUCCESS,
  GET_ALL_ORDERS_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_SUCCESS,
  GET_ORDER_HISTORY_FAILURE,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
} from "./ActionTypes";

const initialState = {
  loading: false,
  order: null,
  orders: [],
  error: null,
  updating: false, // For status update loading
  deleting: false, // For delete loading
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    // REQUESTS
    case CREATE_ORDER_REQUEST:
    case GET_ORDER_BY_ID_REQUEST:
    case GET_ORDER_HISTORY_REQUEST:
    case GET_ALL_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // UPDATE REQUEST
    case UPDATE_ORDER_STATUS_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };

    // DELETE REQUEST
    case DELETE_ORDER_REQUEST:
      return {
        ...state,
        deleting: true,
        error: null,
      };

    // SINGLE ORDER SUCCESS
    case CREATE_ORDER_SUCCESS:
    case GET_ORDER_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: null,
      };

    // USER ORDER HISTORY SUCCESS
    case GET_ORDER_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload, 
        error: null,
      };

    // ADMIN ALL ORDERS SUCCESS
    case GET_ALL_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
        error: null,
      };

    // UPDATE ORDER STATUS SUCCESS
    case UPDATE_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        updating: false,
        order: action.payload,
        // Update the order in the orders array
        orders: {
          ...state.orders,
          orders: state.orders.orders?.map((order) =>
            order._id === action.payload._id ? action.payload : order
          ),
        },
        error: null,
      };

    // DELETE ORDER SUCCESS
    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        deleting: false,
        // Remove the deleted order from the orders array
        orders: {
          ...state.orders,
          orders: state.orders.orders?.filter(
            (order) => order._id !== action.payload
          ),
          totalElements: (state.orders.totalElements || 0) - 1,
        },
        error: null,
      };

    // FAILURES
    case CREATE_ORDER_FAILURE:
    case GET_ORDER_BY_ID_FAILURE:
    case GET_ORDER_HISTORY_FAILURE:
    case GET_ALL_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_ORDER_STATUS_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    case DELETE_ORDER_FAILURE:
      return {
        ...state,
        deleting: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
