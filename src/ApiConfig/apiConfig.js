import axios from "axios";

export const BASE_URL = "http://localhost:8080";

export const jwtToken = localStorage.getItem("token");

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : "",
        contentType: "application/json",
    },
})