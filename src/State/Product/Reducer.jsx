const initialState = {
    products: [],
    product: null,
    isFetching: false,
    error: null,
    deletedProductId: null,
}

export const CustomerProductReducer = (state= initialState, action) => {
    switch(action.type) {
        case "FIND_ALL_PRODUCTS_REQUEST":
        case "FIND_PRODUCT_BY_ID_REQUEST":
        case "DELETE_PRODUCT_BY_ID_REQUEST":
        case "CREATE_NEW_PRODUCT_REQUEST":
        case "UPDATE_PRODUCT_BY_ID_REQUEST":
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
        case "DELETE_PRODUCT_BY_ID_SUCCESS":
            return {
                ...state,
                products: Array.isArray(state.products.content)
                ? {
                    ...state.products,
                    content: state.products.content.filter(
                        (product) => product._id !== action.payload
                    ),
                    }
                : state.products.filter((product) => product._id !== action.payload),
                deletedProductId: action.payload,
                isFetching: false,
                error: null,
            };
        case "CREATE_NEW_PRODUCT_SUCCESS": {
            const newProduct = action.payload;

            // If products is paginated object with content array
            if (state.products && Array.isArray(state.products.content)) {
                return {
                ...state,
                products: {
                    ...state.products,
                    content: [newProduct, ...state.products.content], // prepend new product
                },
                isFetching: false,
                error: null,
                };
            }

            // If products is a normal array
            if (Array.isArray(state.products)) {
                return {
                ...state,
                products: [newProduct, ...state.products],
                isFetching: false,
                error: null,
                };
            }

            // fallback
            return {
                ...state,
                isFetching: false,
                error: null,
            };
            }
        case "UPDATE_PRODUCT_BY_ID_SUCCESS":{

        }

        case "FIND_ALL_PRODUCTS_FAILURE":
        case "FIND_PRODUCT_BY_ID_FAILURE":
        case "DELETE_PRODUCT_BY_ID_FAILURE":
        case "CREATE_NEW_PRODUCT_FAILURE":
        case "UPDATE_PRODUCT_BY_ID_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        default:
            return state;
    }  
}