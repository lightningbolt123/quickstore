import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildCheckFunction } from "express-validator";
import { walletAPI } from "../services/walletAPI";

// Function for getting wallet balance
export const getBalance = createAsyncThunk(
    "wallet/getWalletBalanceStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await walletAPI.getWalletBalance();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Function for withdrawing funds
export const withdrawFunds = createAsyncThunk(
    "wallet/withdrawFundsStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await walletAPI.withdrawFundFromWallet(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// State for storing the wallet data
const initialState = {
    loading: false,
    available_balance: 0,
    ledger_balance: 0,
    currency: '',
    walletMessage: {},
    errors: []
}

// Wallet slice
export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        clearWalletMessage: (state) => {
            state.walletMessage = {};
        },
        clearWalletErrors: (state) => {
            state.errors = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getBalance.pending, (state, { payload }) => {
            state.loading = true;
        });

        builder.addCase(getBalance.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.walletMessage = rest;
            state.available_balance = data.available_balance;
            state.ledger_balance = data.ledger_balance;
            state.currency = data.currency;
        });

        builder.addCase(getBalance.rejected, (state, { payload }) => {
            state.loading = false;
            state.walletMessage = payload;
        });

        builder.addCase(withdrawFunds.pending, (state, { payload }) => {
            state.loading = true;
        });

        builder.addCase(withdrawFunds.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.walletMessage = payload;
        });

        builder.addCase(withdrawFunds.rejected, (state, { payload }) => {
            state.loading = false;
            if (payload.errors) {
                state.errors = payload.errors;
            } else {
                state.walletMessage = payload;
            }
        });
    }
});

export const { clearWalletErrors, clearWalletMessage } = walletSlice.actions;
export default walletSlice.reducer;