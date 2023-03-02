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
export const createOrUpdateStore = createAsyncThunk(
    "store/createOrUpdateStoreStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await storeAPI.createAndUpdateStore(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Function for uploading or updating store icon
export const uploadOrUpdateStoreIcon = createAsyncThunk(
    "store/uploadOrUpdateStoreIconStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await storeAPI.uploadOrUpdateStoreIcon(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Initial state
const initialState = {
    store: null,
    stores: [],
    loading: false,
    photoLoading: false,
    msg: {},
    errors: []
}

// Store slice
export const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.msg = {};
            state.errors = [];
        },
        clearStore: (state) => {
            state.store = null;
        }
    },
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
            state.msg = payload;
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
            state.msg = payload;
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
            state.msg = payload;
        });
        builder.addCase(createOrUpdateStore.pending, (state, { payload }) => {
            state.loading = true;
            state.msg = {};
        });
        builder.addCase(createOrUpdateStore.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.msg = payload;
        });
        builder.addCase(createOrUpdateStore.rejected, (state, { payload }) => {
            state.loading = false;
            if (!payload.errors) {
                state.msg = payload;
            } else {
                state.errors = payload.errors;
            }
        });
        builder.addCase(uploadOrUpdateStoreIcon.pending, (state, { payload }) => {
            state.photoLoading = true;
            state.msg = {};
        });
        builder.addCase(uploadOrUpdateStoreIcon.fulfilled, (state, { payload }) => {
            state.photoLoading = false;
            const { data, ...rest } = payload;
            state.store.icon = data;
            state.msg = rest;
        });
        builder.addCase(uploadOrUpdateStoreIcon.rejected, (state, { payload }) => {
            state.photoLoading = false;
            state.msg = payload;
        });
    }
});

export const { clearMessages, clearStore } = storeSlice.actions;

export default storeSlice.reducer;