import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productAPI } from '../services/productAPI';

export const getProducts = createAsyncThunk(
    "product/getProductsStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await productAPI.fetchProducts();
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    products: [],
    product: {},
    loading: false,
    error: {}
};

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(getProducts.fulfilled, (state, { payload }) => {
            state.products = payload.data;
            state.loading = false;
        });
        builder.addCase(getProducts.rejected, (state, { payload }) => {
            state.error = payload;
            state.loading = false;
        });
    }
});

export default productSlice.reducer;