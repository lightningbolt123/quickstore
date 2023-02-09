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

export const getProduct = createAsyncThunk(
    "product/getProductStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await productAPI.fetchProduct(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createProduct = createAsyncThunk(
    "product/createProductStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await productAPI.createProduct(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    products: [],
    product: {},
    userProducts: [],
    loading: false,
    msg: {},
    errors: []
};

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductMessages: (state) => {
            state.msg = {};
            state.errors = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(getProducts.fulfilled, (state, { payload }) => {
            state.products = payload.data;
            state.loading = false;
        });
        builder.addCase(getProducts.rejected, (state, { payload }) => {
            state.msg = payload;
            state.loading = false;
        });
        builder.addCase(getProduct.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(getProduct.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.product = payload.data;
        });
        builder.addCase(getProduct.rejected, (state, { payload }) => {
            state.loading = false;
            state.msg = payload;
        });
        builder.addCase(createProduct.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(createProduct.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.userProducts.unshift(data);
            state.msg = rest;
        });
        builder.addCase(createProduct.rejected, (state, { payload }) => {
            state.loading = false;
            if (payload.errors) {
                state.errors = payload.errors;
            } else {
                state.msg = payload;
            }
        });
    }
});

export const { clearProductMessages } = productSlice.actions;
export default productSlice.reducer;