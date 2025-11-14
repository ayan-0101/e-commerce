import axios from "axios";
import { BASE_URL } from "../../ApiConfig/apiConfig";
import { GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionTypes";

// Action creators
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

const getUserRequest = () => ({ type: GET_USER_REQUEST });
const getUserSuccess = (user) => ({ type: GET_USER_SUCCESS, payload: user });
const getUserFailure = (error) => ({ type: GET_USER_FAILURE, payload: error });

const logoutAction = () => ({ type: LOGOUT, payload: null });

// ✅ Register User
export const registerUser = (userData) => async (dispatch) => {
    dispatch(registerRequest());
    try {
        const response = await axios.post(`${BASE_URL}/auth/signup`, userData, {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
        });

        const user = response?.data;
        
        if (user?.jwt) {
            localStorage.setItem("token", user.jwt);
            return dispatch(registerSuccess(user));
        } else {
            return dispatch(registerFailure("JWT token not received from server"));
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Registration failed";
        return dispatch(registerFailure(errorMessage));
    }
};

// ✅ Login User
export const loginUser = (credentials) => async (dispatch) => {
    dispatch(loginRequest());
    try {
        const response = await axios.post(`${BASE_URL}/auth/signin`, credentials, {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
        });

        const user = response?.data;
        if (user?.jwt) {
            localStorage.setItem("token", user.jwt);
            return dispatch(loginSuccess(user));
        } else {
            return dispatch(loginFailure("JWT token not received from server"));
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Login failed";
        return dispatch(loginFailure(errorMessage));
    }
};

// ✅ Fetch Logged-in User Profile
export const fetchUser = () => async (dispatch) => {
    dispatch(getUserRequest());
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return dispatch(getUserFailure("No token available"));
        }

        const response = await axios.get(`${BASE_URL}/api/users/profile`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
        });

        const user = response?.data;
        return dispatch(getUserSuccess(user));

    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch user data";
        return dispatch(getUserFailure(errorMessage));
    }
};

// ✅ Logout User
export const logoutUser = () => (dispatch) => {
    localStorage.removeItem("token");
    dispatch(logoutAction());
}