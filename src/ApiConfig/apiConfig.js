import axios from "axios";

export const BASE_URL = "http://localhost:8080";

export const jwtToken = localStorage.getItem("token");

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach a request interceptor to set Authorization dynamically from localStorage
api.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                // Ensure Authorization is not set when no token
                if (config.headers) delete config.headers.Authorization;
            }
        } catch (e) {
            // ignore localStorage errors in non-browser envs
        }
        return config;
    },
    (error) => Promise.reject(error)
);