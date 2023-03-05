import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bankAPI } from "../services/bankAPI";

export const addBankAccount = createAsyncThunk(
    "bank/addBankAccountStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await bankAPI.addBankAccount(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const editBankAccount = createAsyncThunk(
    "bank/editBankAccountStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await bankAPI.editBankAccount(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getBankAccount = createAsyncThunk(
    "bank/getBankAccountStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await bankAPI.getBankAccount(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getBankAccounts = createAsyncThunk(
    "bank/getBankAccountsStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await bankAPI.getBankAccounts();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteBankAccount = createAsyncThunk(
    "bank/deleteBankAccountStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await bankAPI.deleteBank(id);
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

export const bankSlice = createSlice({
    name: "bank",
    initialState,
    reducers: {
        clearBankMessages: (state) => {
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

export const { clearBankMessages, clearBankAccounts } = bankSlice.actions;
export default bankSlice.reducer;