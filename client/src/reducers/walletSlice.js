import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { walletAPI } from "../services/walletAPI";

export const addBankAccount = createAsyncThunk(
    "wallet/addBankAccountStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await walletAPI.addBankAccount(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const editBankAccount = createAsyncThunk(
    "wallet/editBankAccountStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await walletAPI.addBankAccount(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getBankAccount = createAsyncThunk(
    "wallet/getBankAccountStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await walletAPI.getBankAccount(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getBankAccounts = createAsyncThunk(
    "wallet/getBankAccountsStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await walletAPI.getBankAccounts();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const initialState = {
    bankAccount: {},
    bankAccounts: [],
    loading: false,
    message: {},
    errors: []
}

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addBankAccount.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(addBankAccount.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.bankAccounts = payload.data;
        });
    }
});