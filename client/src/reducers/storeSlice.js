import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storeAPI } from '../services/storeAPI';

// Function for retrieving the logged in user store
export const fetchLoggedInUserStore = createAsyncThunk(
    "store/fetchLoggedInUserStoreStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await storeAPI.getLoggedInUserStore();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Function for getting all stores on the platform
export const fetchStores = createAsyncThunk(
    "store/fetchStoresStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await storeAPI.fetchAllStores();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Function for fetching a single store
export const fetchStore = createAsyncThunk(
    "store/fetchStoreStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await storeAPI.fetchStore(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Function for creating and updating store

// Initial state
const initialState = {
    store: null,
    stores: [],
    loading: false,
    error: {},
    errors: []
}

// Store slice
export const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchLoggedInUserStore.pending, (state, { payload }) => {
            state.loading = true;
            state.store = null;
        });
        builder.addCase(fetchLoggedInUserStore.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.store = payload.data;
        });
        builder.addCase(fetchLoggedInUserStore.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(fetchStores.pending, (state, { payload }) => {
            state.loading = true;
            state.stores = [];
        });
        builder.addCase(fetchStores.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.stores = payload.data;
        });
        builder.addCase(fetchStores.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(fetchStore.pending, (state, { payload }) => {
            state.pending = true;
            state.store = null;
        });
        builder.addCase(fetchStore.fulfilled, (state, { payload }) => {
            state.pending = false;
            state.store = payload.data;
        });
        builder.addCase(fetchStore.rejected, (state, { payload }) => {
            state.pending = false;
            state.error = payload;
        });
    }
});

export default storeSlice.reducer;