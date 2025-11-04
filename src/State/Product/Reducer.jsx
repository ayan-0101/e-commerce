const initialState = {
    products: [],
    product: null,
    isFetching: false,
    error: null,
}

export const CustomerProductReducer = (state= initialState, action) => {
    switch(action.type) {
        case "FIND_ALL_PRODUCTS_REQUEST":
        case "FIND_PRODUCT_BY_ID_REQUEST":
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case "FIND_ALL_PRODUCTS_SUCCESS":
            return {
                ...state,
                products: action.payload,
                isFetching: false,
                error: null,
            };
        case "FIND_PRODUCT_BY_ID_SUCCESS":
            return {
                ...state,
                product: action.payload,
                isFetching: false,
                error: null,
            };
        case "FIND_ALL_PRODUCTS_FAILURE":
        case "FIND_PRODUCT_BY_ID_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        default:
            return state;
    }  
}