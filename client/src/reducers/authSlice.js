import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/authAPI';

// Function for logging in user
export const loginUser = createAsyncThunk(
    "auth/loginUserStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await authAPI.loginUser(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Function for loading user data
export const loadUser = createAsyncThunk(
    "auth/loadUserStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAPI.loadUser();
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Function for signing up a user
export const signupUser = createAsyncThunk(
    "auth/signupUserStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await authAPI.signupUser(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Function for verifying user accounts after sign up
export const verifyUser = createAsyncThunk(
    "auth/verifyUserStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await authAPI.verifyUser(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Function for resending otp
export const resendOtp = createAsyncThunk(
    "auth/resendOtpStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await authAPI.resendOtp(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Function for resending otp
export const retrievePassword = createAsyncThunk(
    "auth/retrievePasswordStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await authAPI.retrievePassword(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Function for generating authentication token when reseting forotten password
export const generateToken = createAsyncThunk(
    "auth/generateTokenStatus",
    async (data, { rejectWithValue }) => {
        try {
            const response = await authAPI.generateToken(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Function for creating new password
export const createNewPassword = createAsyncThunk(
    "auth/createNewPasswordStatus",
    async (token, data, { rejectWithValue }) => {
        try {
            const response = await authAPI.createNewPassword(token, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// The initial state of the reducer
const initialState = {
    token: localStorage.getItem("QuickstoreToken"),
    loading: false,
    message: {},
    errors: [],
    user: null,
    passwordResetToken: ''
};

// The auth slice
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state, { payload }) => {
            state.message = {};
            state.errors = [];
            state.loading = true;
        });
        builder.addCase(loginUser.fulfilled, (state, { payload }) => {
            if (payload.status === 'created') {
                state.message = payload;
            } else {
                state.token = localStorage.setItem("QuickstoreToken", payload.data);
            }
            state.loading = false;
        });
        builder.addCase(loginUser.rejected, (state, { payload }) => {
            state.errors = payload.errors;
            state.loading = false;
        });
        builder.addCase(loadUser.pending, (state, { payload }) => {
            state.errors = [];
            state.loading = true;
        });
        builder.addCase(loadUser.fulfilled, (state, { payload }) => {
            state.user = payload.data
            state.loading = false;
        });
        builder.addCase(loadUser.rejected, (state, { payload }) => {
            state.loading = false;
            state.errors = [...state, payload];
            state.user = null;
        });
        builder.addCase(signupUser.pending, (state, { payload }) => {
            state.message = {};
            state.errors = [];
            state.loading = true;
        });
        builder.addCase(signupUser.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
        builder.addCase(signupUser.rejected, (state, { payload }) => {
            state.loading = false;
            state.errors = payload.errors;
        });
        builder.addCase(verifyUser.pending, (state, { payload }) => {
            state.message = {};
            state.errors = [];
            state.loading = true;
        });
        builder.addCase(verifyUser.fulfilled, (state, { payload }) => {
            state.message = payload;
            state.loading = false;
        });
        builder.addCase(verifyUser.rejected, (state, { payload }) => {
            state.errors = payload.errors;
            state.loading = false;
        });
        builder.addCase(resendOtp.pending, (state, { payload }) => {
            state.message = {};
            state.loading = true;
            state.errors = [];
        });
        builder.addCase(resendOtp.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
        builder.addCase(resendOtp.rejected, (state, { payload }) => {
            state.loading = false;
            state.errors = payload.errors;
        });
        builder.addCase(retrievePassword.pending, (state, { payload }) => {
            state.message = {};
            state.loading = true;
            state.errors = [];
        });
        builder.addCase(retrievePassword.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
        builder.addCase(retrievePassword.rejected, (state, { payload }) => {
            state.loading = false;
            state.errors = payload.errors;
        });
        builder.addCase(generateToken.pending, (state, { payload }) => {
            state.message = {};
            state.passwordResetToken = '';
            state.loading = true;
            state.errors = [];
        });
        builder.addCase(generateToken.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.passwordResetToken = payload.data;
        });
        builder.addCase(generateToken.rejected, (state, { payload }) => {
            state.loading = false;
            state.errors = payload.errors;
        });
        builder.addCase(createNewPassword.pending, (state, { payload }) => {
            state.message = {};
            state.loading = true;
            state.errors = [];
        });
        builder.addCase(createNewPassword.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.message = payload;
        });
        builder.addCase(createNewPassword.rejected, (state, { payload }) => {
            state.loading = false;
            state.errors.push(payload);
        });
    }
});

export default authSlice.reducer;