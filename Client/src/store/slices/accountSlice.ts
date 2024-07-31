import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';
import {User} from './userSlice';

export interface AccountState {
    user: User;
    users: User[];
    error: string | null;
    token: string;
    isLoggedIn: boolean | null;
}

export const initialState: AccountState = {
    user: <User>{},
    users: [],
    token: '',
    error: null,
    isLoggedIn: null,
};

interface JWTData {
    username: string;
    role: string;
    firstname: string;
    lastname: string;
    permissions: string[];
}

const accountSlice = createSlice({
    name: 'accountInfo',
    initialState,
    reducers: {
        //@ts-ignore
        getAccessToken(state, payload) {
        },
        setAccountInfo: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('authToken', action.payload);
            const data: JWTData = jwtDecode(action.payload) as JWTData;
            state.user.firstname = data.firstname;
            state.user.lastname = data.lastname;
            state.user.role = data.role;
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

export const {getAccessToken, setAccountInfo, setError, logout} = accountSlice.actions;
export default accountSlice.reducer;
