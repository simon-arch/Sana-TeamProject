import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import config from '../../../config.json'
import { User } from './userSlice';

export interface AccountState {
    user: User;
    error: string | null;
    isLoggedIn: boolean | null;
}

export const initialState: AccountState = {
    user: <User>{},
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
            state.user.firstname = action.payload.username;
            state.user.lastname = 'placeholder';
            state.user.role = action.payload.role;
            state.user.permissions = action.payload.permissions;
            state.error = null;
            state.isLoggedIn = true;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoggedIn = false;
        },
        logout: (state) => {
            fetch(`${config.apiEndpoint}/Auth/Logout`, {credentials: 'include'});
            state.user = <User>{};
            state.error = null;
            state.isLoggedIn = false;
        },
    },
});

export const { getAccountInfo, setAccountInfo, setError, logout, getAccountStatus } = accountSlice.actions;
export default accountSlice.reducer;
