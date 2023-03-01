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
            console.log(error.response.data);
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
    cartMessage: {},
    errors: [],
    loading: false
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cart = [];
        },
        clearCartMessages: (state) => {
            state.cartMessage = {};
            state.errors = [];
        }
    },
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
            state.cartMessage = payload;
        });
        builder.addCase(addToCart.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(addToCart.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest} = payload;
            state.cartMessage = rest;
            if (data) state.cart.push(data);
        });
        builder.addCase(addToCart.rejected, (state, { payload }) => {
            state.loading = false;
            if (payload.errors) {
                state.errors = payload.errors;
            } else {
                state.cartMessage = payload;
            }
        });
        builder.addCase(removeFromCart.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(removeFromCart.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.cart = state.cart.filter(item => item._id !== payload.id);
        });
        builder.addCase(removeFromCart.rejected, (state, { payload }) => {
            state.loading = false;
            state.cartMessage = payload;
        });
    }
});

export const { clearCartMessages, clearCart } = cartSlice.actions;
export default cartSlice.reducer;