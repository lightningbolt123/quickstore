import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cartAPI } from "../services/cartAPI";

export const getCart = createAsyncThunk(
    "cart/getCartStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartAPI.getCartAPI();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addItemToCartStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await cartAPI.addToCartAPI(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCartStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await cartAPI.removeItemFromCartAPI(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    cart: [],
    msg: {},
    loading: false
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCart.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(getCart.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.cart = payload.data;
        });
        builder.addCase(getCart.rejected, (state, { payload }) => {
            state.loading = false;
            state.msg = payload;
        });
        builder.addCase(addToCart.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(addToCart.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.cart = state.cart.push(payload.data);
        });
        builder.addCase(addToCart.rejected, (state, { payload }) => {
            state.loading = false;
            state.msg = payload;
        });
        builder.addCase(removeFromCart.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(removeFromCart.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.cart = state.cart.filter(item => item.productid !== payload.id);
        });
        builder.addCase(removeFromCart.rejected, (state, { payload }) => {
            state.loading = false;
            state.msg = payload;
        });
    }
});

export default cartSlice.reducer;