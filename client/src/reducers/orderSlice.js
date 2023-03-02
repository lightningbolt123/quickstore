import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { orderAPI } from "../services/orderAPI";

export const placeOrder = createAsyncThunk(
    "order/placeOrderStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await orderAPI.placeOrder(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getInvoices = createAsyncThunk(
    "order/getInvoicesStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getInvoices();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getInvoice = createAsyncThunk(
    "order/getInvoiceStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getInvoice(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getOrders = createAsyncThunk(
    "order/getOrdersStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getOrders();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateInvoice = createAsyncThunk(
    "order/updateInvoiceStatus",
    async (orderData, { rejectWithValue }) => {
        try {
            const { id, item_id, data } = orderData;
            const response = await orderAPI.updateInvoiceStatus(id, item_id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getOrder = createAsyncThunk(
    "order/getOrderStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getOrder(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    loading: true,
    orders: [],
    invoice: {},
    invoices: [],
    message: {},
    errors: []
};

// Auth slice
export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        clearOrderMessages: (state) => {
            state.message = {};
            state.errors = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(placeOrder.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(placeOrder.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.message = rest;
            if (data) state.invoices.unshift(data); 
        });
        builder.addCase(placeOrder.rejected, (state, { payload }) => {
            state.loading = false;
            if (payload.errors && payload.errors.length > 0) {
                state.errors = payload.errors;
            } else {
                state.message = payload;
            }
        });
        builder.addCase(getInvoices.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(getInvoices.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.invoices = data;
            state.message = rest;
        });
        builder.addCase(getInvoices.rejected, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
        builder.addCase(getOrders.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(getOrders.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.orders = data;
            state.message = rest;
        });
        builder.addCase(getOrders, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
        builder.addCase(getInvoice.pending, (state, { payload }) => {
            state.loading = true;
            state.invoice = {};
        });
        builder.addCase(getInvoice.fulfilled, (state, { payload }) => {
            state.loading = false;
            const { data, ...rest } = payload;
            state.invoice = data;
            state.message = rest;
        });
        builder.addCase(getInvoice.rejected, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
        builder.addCase(updateInvoice.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(updateInvoice.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
            state.invoice = state.invoice.goodspurchased.map(item => item._id === payload.item_id ? {...item, status: payload.order_status } : item);
        });
        builder.addCase(updateInvoice.rejected, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
        builder.addCase(getOrder.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(getOrder.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.message = { status: payload.status, status_code: payload.status_code };
            state.invoice = payload.data;
        });
        builder.addCase(getOrder.rejected, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
    }
});

export const { clearOrderMessages } = orderSlice.actions;

export default orderSlice.reducer;