import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { wishlistAPI } from "../services/wishlistAPI";

// Function for adding item to wishlist
export const addToWishlist = createAsyncThunk(
    "wishlist/addItemToWishlistStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await wishlistAPI.addItemToWishlist(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Function for getting all items in wishlist
export const getWishlist = createAsyncThunk(
    "wishlist/getWishlistStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await wishlistAPI.getWishlist();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Function for removing item from wishlist
export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlistStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await wishlistAPI.removeItemFromWishlist(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Initial state
const initialState = {
    loading: false,
    items: [],
    wishlistMessage: {},
    errors: []
}
// Wishlist slice
export const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        clearWishlistMessage: (state) => {
            state.wishlistMessage = {};
        },
        clearWishlistErrors: (state) => {
            state.errors = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addToWishlist.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(addToWishlist.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { item, ...rest } = payload;
            state.wishlistMessage = rest;
            state.items.unshift(item);
        });
        builder.addCase(addToWishlist.rejected, (state, { payload }) => {
            state.loading = false;
            if (payload.errors) {
                state.errors = payload.errors;
            } else {
                state.wishlistMessage = payload;
            }
        });
        builder.addCase(getWishlist.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(getWishlist.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.wishlistMessage = rest;
            state.items = data;
        });
        builder.addCase(getWishlist.rejected, (state, { payload }) => {
            state.loading = false;
            state.wishlistMessage = payload;
        });
        builder.addCase(removeFromWishlist.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(removeFromWishlist.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { id, ...rest } = payload;
            state.wishlistMessage = rest;
            state.items = state.items.filter(item => item.productid.toString() !== id.toString());
        });
        builder.addCase(removeFromWishlist.rejected, (state, { payload }) => {
            state.loading = false;
            state.wishlistMessage = payload;
        });
    }
});

export const { clearWishlistMessage, clearWishlistErrors } = wishlistSlice.actions;
export default wishlistSlice.reducer;