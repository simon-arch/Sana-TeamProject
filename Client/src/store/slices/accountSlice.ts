import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';
import User from "../../models/User.ts";
import SliceState from "../../models/SliceState.ts";
import {sendRequest} from "../epics/helpers/sendRequest.ts";


export interface AccountState extends SliceState {
    user: User;
    isTokenExpired: boolean | null;
    isLoggedIn: boolean | null;
}

export const initialState: AccountState = {
    user: <User>{},
    status: 'loading',
    error: null,
    isTokenExpired: null,
    isLoggedIn: null,
};

const accountSlice = createSlice({
    name: 'accountInfo',
    initialState,
    reducers: {
        //@ts-ignore
        tokenRequest(state: AccountState, action: PayloadAction<{username: string, password: string}>) {},
        tokenRequestResolve: (state: AccountState, action: PayloadAction<string>) => {
            localStorage.setItem('authToken', action.payload);
            state.user.username = jwtDecode(action.payload).sub!;
            state.error = null;
            state.isTokenExpired = false;
            state.isLoggedIn = true;
        },
        //@ts-ignore
        accountInfoRequest(state: AccountState, action: PayloadAction<string>) {
            state.status = 'loading';
        },
        accountInfoRequestResolve(state: AccountState, action: PayloadAction<User>) {
            state.user = action.payload;
            state.status = 'idle';
        },
        setError: (state: AccountState, action: PayloadAction<string>) => {
            state.status = 'error';
            state.error = action.payload;
        },
        setTokenExpire(state: AccountState, action: PayloadAction<boolean>) {
            state.isTokenExpired = action.payload;
        },
        logout: (state: AccountState) => {
            sendRequest(`mutation { auth { logout } }`).then();
            localStorage.clear();
            state.user = <User>{};
            state.error = null;
            state.isTokenExpired = null;
            state.isLoggedIn = false;
        },
    },
});

export const {
    tokenRequest, tokenRequestResolve,
    accountInfoRequest, accountInfoRequestResolve,
    setError, setTokenExpire,
    logout
} = accountSlice.actions;

export default accountSlice.reducer;
