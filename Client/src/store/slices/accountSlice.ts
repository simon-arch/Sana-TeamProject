import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import User from "../../models/User.ts";
import {ErrorType, Status} from "../../helpers/types.ts";


export interface AccountState {
    user: User;
    status: Status;
    error: ErrorType;
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
        getAccessToken(state: AccountState, action) {},
        setTokenPayload: (state: AccountState, action: PayloadAction<string>) => {
            localStorage.setItem('authToken', action.payload);
            const data: JWTData = jwtDecode(action.payload) as JWTData;
            state.user.username = data.sub;
            state.error = null;
            state.isLoggedIn = true;
        },
        //@ts-ignore
        getAccountInfo(state: AccountState, action) {
            state.status = 'loading';
        },
        setAccountInfo(state: AccountState, action: PayloadAction<User>) {
            state.user = action.payload;
            state.status = 'idle';
        },
        setError: (state: AccountState, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoggedIn = false;
        },
        logout: (state: AccountState) => {
            localStorage.clear();
            state.user = <User>{};
            state.error = null;
            state.isLoggedIn = false;
        },
    },
});

export const {
    getAccessToken, setTokenPayload,
    getAccountInfo, setAccountInfo,
    setError,
    logout
} = accountSlice.actions;

export default accountSlice.reducer;
