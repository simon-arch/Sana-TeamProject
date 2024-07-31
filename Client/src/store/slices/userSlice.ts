import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: number;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    role: string;
    permissions: string[];
}

interface UserState {
    users: User[];
    error: string | null;
}

const initialState: UserState = {
    users: [],
    error: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getUsers() {},
        setUsers(state, action: PayloadAction<User[]>) {
            state.users = action.payload;
        },
        //@ts-ignore
        registerRequest(state, action: PayloadAction<User>) {},
        registerSuccess(state, action: PayloadAction<User>) {
            state.users.push(action.payload);
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    },
});

export const {
    getUsers,
    setUsers,
    registerRequest,
    registerSuccess,
    setError,
} = userSlice.actions;

export default userSlice.reducer;
