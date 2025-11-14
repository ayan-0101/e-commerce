import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Auth/Reducer";
import { CustomerProductReducer } from "./Product/Reducer";
import { CartReducer } from "./Cart/Reducer";
import { orderReducer } from "./Order/Reducer";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: CustomerProductReducer,
        cart: CartReducer,
        order: orderReducer,
        
    },
})