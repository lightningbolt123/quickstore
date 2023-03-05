import { configureStore } from '@reduxjs/toolkit';
import productReducer from './reducers/productSlice';
import authReducer from './reducers/authSlice';
import storeReducer from './reducers/storeSlice';
import cartReducer from './reducers/cartSlice';
import orderReducer from './reducers/orderSlice';
import bankReducer from './reducers/bankSlice';
import walletReducer from './reducers/walletSlice';

const store = configureStore({
    reducer: {
        product: productReducer,
        auth: authReducer,
        store: storeReducer,
        cart: cartReducer,
        order: orderReducer,
        bank: bankReducer,
        wallet: walletReducer
    },
});

export default store;