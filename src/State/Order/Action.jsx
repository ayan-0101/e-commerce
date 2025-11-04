import { api } from "../../ApiConfig/apiConfig";
import { CREATE_ORDER_REQUEST } from "./ActionTypes";

export const createOrder =  (reqData) => async (dispatch)=> {
    dispatch({type: CREATE_ORDER_REQUEST});

    try {
        const {data} = await api.post(`api/orders`);
        if(data.id){
            reqData.navigate({search: `step=3&orderId=${data.id}`});
        }
        dispatch({type: CREATE_ORDER_SUCCESS, payload: data});
        
    } catch (error) {
        dispatch({type: CREATE_ORDER_FAILURE, payload: error.message});
    }
}

export const getOrderById = (reqData) => async (dispatch) => {
    const {orderId} = reqData;
    dispatch({type: GET_ORDER_BY_ID_REQUEST});

    try {
        const {data} = await api.get(`api/orders/${orderId}`);
        dispatch({type: GET_ORDER_BY_ID_SUCCESS, payload: data});
        
    } catch (error) {
        dispatch({type: GET_ORDER_BY_ID_FAILURE, payload: error.message});
    }
}   