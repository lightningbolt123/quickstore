import { configureStore } from '@reduxjs/toolkit';
import productReducer from './reducers/productSlice';
import authReducer from './reducers/authSlice';
import storeReducer from './reducers/storeSlice';

const store = configureStore({
    reducer: {
        product: productReducer,
        auth: authReducer,
        store: storeReducer
    },
});

export default store;