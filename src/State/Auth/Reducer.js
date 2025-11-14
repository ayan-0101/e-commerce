const initialState = {
    isAuthenticated: false,
    user: null,
    isFetching: false,
    error: null,
    jwt: null,
}
export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "REGISTER_REQUEST":
        case "LOGIN_REQUEST":
        case "GET_USER_REQUEST":
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case "REGISTER_SUCCESS":
        case "LOGIN_SUCCESS":
            return {
                ...state,
                isAuthenticated: true,
                isFetching: false,
                user: action.payload,
                jwt: action.payload.jwt,
                error: null,
            };
        case "GET_USER_SUCCESS":
            return {
                ...state,
                isAuthenticated: true,
                isFetching: false,
                user: action.payload,
                error: null,
            };
        case "REGISTER_FAILURE":
        case "LOGIN_FAILURE":
        case "GET_USER_FAILURE":
            return {
                ...state,
                isAuthenticated: false,
                isFetching: false,
                user: null,
                jwt: null,
                error: action.payload,
            };
        case "LOGOUT":
            return {
                ...initialState,
            };
        default:
            return state;
    }
}