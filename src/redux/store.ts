import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice'
import authReducer from './authSlice'
import wishlistReducer from './wishlistSlice'

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        authSlice: authReducer,
        wishlist: wishlistReducer
    }
})

export type rootState = ReturnType<typeof store.getState>
export type appDispatch = typeof store.dispatch