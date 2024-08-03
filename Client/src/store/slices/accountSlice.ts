import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
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

interface JWTData {
    sub: string;
    permissions: string[];
}

const accountSlice = createSlice({
    name: 'accountInfo',
    initialState,
    reducers: {
        //@ts-ignore
        getAccessToken(state, action) {},
        setAccountInfo: (state, action: PayloadAction<string>) => {
            localStorage.setItem('authToken', action.payload);
            const data: JWTData = jwtDecode(action.payload) as JWTData;
            state.user.username = data.sub;
            state.user.permissions = (Array.isArray(data.permissions)) ? data.permissions : [data.permissions];
            state.error = null;
            state.isLoggedIn = true;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoggedIn = false;
        },
        logout: (state) => {
            localStorage.clear();
            state.user = <User>{};
            state.error = null;
            state.isLoggedIn = false;
        },
    },
});

export const { getAccessToken, setAccountInfo, setError, logout } = accountSlice.actions;
export default accountSlice.reducer;
