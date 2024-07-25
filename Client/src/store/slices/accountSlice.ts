import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import config from '../../../config.json'

export interface AccountState {
    name: string;
    role: string;
    permissions: string[];
    error: string | null;
    isLoggedIn: boolean | null;
}

export const initialState: AccountState = {
    name: '',
    role: '',
    permissions: [],
    error: null,
    isLoggedIn: null,
};

const accountSlice = createSlice({
    name: 'accountInfo',
    initialState,
    reducers: {
        //@ts-ignore
        getAccountInfo(state, action) {},
        getAccountStatus() {},
        setAccountInfo: (state, action: PayloadAction<{ username: string; role: string; permissions: string[] }>) => {
            console.log('setAccountInfo reducer called with:', action.payload);
            state.name = action.payload.username;
            state.role = action.payload.role;
            state.permissions = action.payload.permissions;
            state.error = null;
            state.isLoggedIn = true;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoggedIn = false;
        },
        logout: (state) => {
            fetch(`${config.apiEndpoint}/Auth/Logout`, {credentials: 'include'});
            state.name = '';
            state.role = '';
            state.permissions = [];
            state.error = null;
            state.isLoggedIn = false;
        },
    },
});

export const { getAccountInfo, setAccountInfo, setError, logout, getAccountStatus } = accountSlice.actions;
export default accountSlice.reducer;
