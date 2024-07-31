import {createSlice} from "@reduxjs/toolkit";

const initialState: string[] = [];

const roleSlice = createSlice(
    {
        name: 'roles',
        initialState,
        reducers: {
            getRoles() {
            },
            setRoles(state, action) {
                state;
                const roles: string[] = action.payload.map((role: string) => (role));
                return roles;
            },
        }
    }
);

export const {
    getRoles,
    setRoles
} = roleSlice.actions;

export default roleSlice.reducer;