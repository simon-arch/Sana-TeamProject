import { createSlice } from "@reduxjs/toolkit";

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    role: string;
    permissions: string[];
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
                console.log(action.payload);
                const users: User[] = Object.keys(action.payload).map(index => ({
                    id: Number(index),
                    firstname: action.payload[index].Name,
                    lastname: 'placeholder',
                    role: action.payload[index].Role,
                    permissions: action.payload[index].Permissions
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