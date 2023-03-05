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
const getWishlist = createAsyncThunk(
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
const removeFromWishlist = createAsyncThunk(
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