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
                const users: User[] = Object.keys(action.payload).map(index => ({
                    id: action.payload[index].id,
                    firstname: action.payload[index].firstName,
                    lastname: action.payload[index].lastName,
                    role: action.payload[index].role,
                    permissions: action.payload[index].permissions
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