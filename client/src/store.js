import { configureStore } from '@reduxjs/toolkit';
import productReducer from './reducers/productSlice';
import authReducer from './reducers/authSlice';

const store = configureStore({
    reducer: {
        product: productReducer,
        auth: authReducer
    },
});

export default store;