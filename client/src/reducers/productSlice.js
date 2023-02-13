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
            return rejectWithValue(error.response.data);
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

export const getVendorProducts = createAsyncThunk(
    "product/getVendorProductsStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await productAPI.fetchStoreProducts(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/updateProductStatus",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await productAPI.updateProduct(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addImageToProduct = createAsyncThunk(
    "product/addImageToProductStatus",
    async (productData, { rejectWithValue }) => {
        try {
            const { id, data } = productData;
            const response = await productAPI.addProductImage(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const removeImageFromProduct = createAsyncThunk(
    "product/removeImageFromProductStatus",
    async (data, { rejectWithValue }) => {
        const { pId, imgId } = data;
        try {
            const response = await productAPI.deleteProductImage(pId, imgId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteProductFromStore = createAsyncThunk(
    "product/deleteProductFromStoreStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await productAPI.deleteProduct(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    products: [],
    product: {},
    loading: false,
    imageLoading: false,
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
            state.products = [];
        });
        builder.addCase(createProduct.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.products.unshift(data);
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
        builder.addCase(getVendorProducts.pending, (state, { payload }) => {
            state.loading = true;
            state.products = [];
        });
        builder.addCase(getVendorProducts.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.msg = rest;
            state.products = data;
        });
        builder.addCase(getVendorProducts.rejected, (state, { payload }) => {
            state.loading = false;
            state.msg = payload;
        });
        builder.addCase(updateProduct.pending, (state, { payload }) => {
            state.loading = true;
            state.product = {};
        });
        builder.addCase(updateProduct.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.msg = rest;
            state.product = data;
        });
        builder.addCase(updateProduct.rejected, (state, { payload }) => {
            state.loading = false;
            if (payload.errors) {
                state.errors = payload.errors;
            } else {
                state.msg = payload;
            }
        });
        builder.addCase(addImageToProduct.pending, (state, { payload }) => {
            state.imageLoading = true;
        });
        builder.addCase(addImageToProduct.fulfilled, (state, { payload }) => {
            state.imageLoading = true;
            const { data, ...rest } = payload;
            state.msg = rest;
            if (state.product.product_images !== data) {
                state.product.product_images = data;
            }
        });
        builder.addCase(addImageToProduct.rejected, (state, { payload }) => {
            state.imageLoading = false;
            state.msg = payload;
        });
        builder.addCase(removeImageFromProduct.pending, (state, { payload }) => {
            state.imageLoading = true;
        });
        builder.addCase(removeImageFromProduct.fulfilled, (state, { payload }) => {
            state.imageLoading = false;
            const { id, ...rest } = payload;
            state.msg = rest;
            state.product.product_images = state.product.product_images.filter(image => image.public_id.toString() !== id.toString());
        });
        builder.addCase(removeImageFromProduct.rejected, (state, { payload }) => {
            state.imageLoading = false;
            state.msg = payload;
        });
        builder.addCase(deleteProductFromStore.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(deleteProductFromStore.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { id, ...rest } = payload;
            state.msg = rest;
            state.products.filter(product => product.id !== parseInt(id));
        });
        builder.addCase(deleteProductFromStore.rejected, (state, { payload }) => {
            state.loading = false;
            state.msg = payload;
        });
    }
});

export const { clearProductMessages } = productSlice.actions;
export default productSlice.reducer;