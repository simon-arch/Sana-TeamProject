import { createSlice } from "@reduxjs/toolkit";

export interface User {
    name: string;
    role: string;
}

const initialState: User[] = [];

const userSlice = createSlice(
    {
        name: 'users',
        initialState,
        reducers: {
            getUsers(){},
            setUsers(state, action) {
                state;
                const users: User[] = Object.keys(action.payload).map(index => ({
                    name: index,
                    role: action.payload[index]
                }));
                return users;
            }
        }
    }
);

export const {
    getUsers,
    setUsers
} = userSlice.actions;

export default userSlice.reducer;