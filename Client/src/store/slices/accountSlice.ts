import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { User } from './userSlice';

export interface AccountState {
    user: User;
    status: 'idle' | 'loading' | 'error';
    error: string | null;
    isLoggedIn: boolean | null;
}

export const initialState: AccountState = {
    user: <User>{},
    status: 'loading',
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
        setTokenPayload: (state, action: PayloadAction<string>) => {
            localStorage.setItem('authToken', action.payload);
            const data: JWTData = jwtDecode(action.payload) as JWTData;
            state.user.username = data.sub;
            state.error = null;
            state.isLoggedIn = true;
        },
        //@ts-ignore
        getAccountInfo(state, action) {
            state.status = 'loading';
        },
        setAccountInfo(state, action) {
            state.user.firstName = action.payload.firstName;
            state.user.lastName = action.payload.lastName;
            state.user.role = action.payload.role;
            state.user.permissions = action.payload.permissions;
            state.user.state = action.payload.state;
            state.user.workType = action.payload.workType;
            state.user.workingTime = action.payload.workingTime;
            state.status = 'idle';
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

export const {
    getAccessToken,
    setTokenPayload,
    getAccountInfo,
    setAccountInfo,
    setError,
    logout
} = accountSlice.actions;

export default accountSlice.reducer;
