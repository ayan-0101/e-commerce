const initialState = {
    cart: null,
    cartItems: [],
    isFetching: false,
    error: null,
}

export const CartReducer = (state= initialState, action) => {
    switch(action.type) {
        case "GET_USER_CART_REQUEST":
        case "ADD_ITEM_TO_CART_REQUEST":
        case "REMOVE_ITEM_FROM_CART_REQUEST":
        case "UPDATE_CART_ITEM_REQUEST":
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case "GET_USER_CART_SUCCESS":
            return {
                ...state,
                cart: action.payload,
                cartItems: action.payload.cartItems,
                isFetching: false,
                error: null,
            };
        case "ADD_ITEM_TO_CART_SUCCESS":
        case "REMOVE_ITEM_FROM_CART_SUCCESS":
        case "UPDATE_CART_ITEM_SUCCESS":
            return {
                ...state,
                cart: action.payload,
                cartItems: action.payload.cartItems,
                isFetching: false,
                error: null,
            };
        case "GET_USER_CART_FAILURE":
        case "ADD_ITEM_TO_CART_FAILURE":
        case "REMOVE_ITEM_FROM_CART_FAILURE":
        case "UPDATE_CART_ITEM_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        default:
            return state;
    }  
}