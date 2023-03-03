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
            const response = await walletAPI.editBankAccount(data);
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
    async (_, { rejectWithValue }) => {
        try {
            const response = await walletAPI.getBankAccounts();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteBankAccount = createAsyncThunk(
    "wallet/deleteBankAccountStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await walletAPI.deleteBank(id);
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
    reducers: {
        clearWalletMessages: (state) => {
            state.message = {};
            state.errors = [];
        },
        clearBankAccounts: (state) => {
            state.bankAccounts = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addBankAccount.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(addBankAccount.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            if (data) state.bankAccounts.unshift(data);
            state.message = rest;
        });
        builder.addCase(addBankAccount.rejected, (state, { payload }) => {
            state.loading = false;
            if (payload.errors) state.errors = payload.errors;
            state.message = payload;
        });
        builder.addCase(editBankAccount.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(editBankAccount.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.bankAccount = data;
            state.message = rest;
        });
        builder.addCase(editBankAccount.rejected, (state, { payload }) => {
            state.loading = false;
            if (payload.errors) state.errors = payload.errors;
            state.message = payload;
        });
        builder.addCase(getBankAccounts.pending, (state, { payload }) => {
            state.loading = true;
            state.bankAccount = {};
        });
        builder.addCase(getBankAccounts.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            if (data) state.bankAccounts = data;
            state.message = rest;
        });
        builder.addCase(getBankAccounts.rejected, (state, { payload }) => {
            state.loading = false;
        });
        builder.addCase(getBankAccount.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(getBankAccount.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            if (data) state.bankAccount = data;
            state.message = rest;
        });
        builder.addCase(getBankAccount.rejected, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
        builder.addCase(deleteBankAccount.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(deleteBankAccount.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { id, ...rest } = payload;
            state.bankAccounts = state.bankAccounts.filter(account => account._id !== id);
            state.message = rest;
        });
        builder.addCase(deleteBankAccount.rejected, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
    }
});

export const { clearWalletMessages, clearBankAccounts } = walletSlice.actions;
export default walletSlice.reducer;