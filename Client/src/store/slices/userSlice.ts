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
    selectedUser: User | null;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    selectedUser: null,
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
        getSelectedUser(state, action: PayloadAction<number>) {
            const userId = action.payload;
            state.selectedUser = state.users.find(user => user.id === userId) || null;
        },
        setSelectedUser(state, action: PayloadAction<User>) {
            state.selectedUser = action.payload;
        },
        //@ts-ignore
        updateUserRequest(state, action: PayloadAction<User>) {},
        updateUserSuccess(state, action: PayloadAction<User>) {
            const updatedUser = action.payload;
            state.users = state.users.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            );
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
    getSelectedUser,
    setSelectedUser,
    updateUserRequest,
    updateUserSuccess,
    setError,
} = userSlice.actions;

export default userSlice.reducer;
