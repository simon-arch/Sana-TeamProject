import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccountState {
    name: string;
    role: string;
    permissions: string[];
    error: string | null;
    isLoggedIn: boolean;
}

const initialState: AccountState = {
    name: '',
    role: '',
    permissions: [],
    error: null,
    isLoggedIn: false,
};

const accountSlice = createSlice({
    name: 'accountInfo',
    initialState,
    reducers: {
        getAccountInfo() {},
        checkAuthStatus() {},
        setAccountInfo: (state, action: PayloadAction<{ userName: string; userRole: string; permissions: string[] }>) => {
            console.log('setAccountInfo reducer called with:', action.payload);
            state.name = action.payload.userName;
            state.role = action.payload.userRole;
            state.permissions = action.payload.permissions;
            state.error = null;
            state.isLoggedIn = true;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoggedIn = false;
        },
        logout: (state) => {
            state.name = '';
            state.role = '';
            state.permissions = [];
            state.error = null;
            state.isLoggedIn = false;
        },
    },
});

export const { getAccountInfo, setAccountInfo, setError, logout, checkAuthStatus } = accountSlice.actions;
export default accountSlice.reducer;
