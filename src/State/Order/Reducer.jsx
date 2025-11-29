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
} from "./ActionTypes";

const initialState = {
  loading: false,
  order: null,
  orders: [],
  error: null,
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

    case CREATE_ORDER_FAILURE:
    case GET_ORDER_BY_ID_FAILURE:
    case GET_ORDER_HISTORY_FAILURE:
    case GET_ALL_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
