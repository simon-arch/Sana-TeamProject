import { createSlice } from "@reduxjs/toolkit";
import { Status } from "../../helpers/types";

export interface UserState {
    roles: string[];
    status: Status;
    error: string | null
}

const initialState: UserState = {
    roles: [],
    status: 'loading',
    error: null
};

const roleSlice = createSlice(
    {
        name: 'roles',
        initialState,
        reducers: {
            getRoles(state){
                state.status = 'loading';
            },
            setRoles(state, action) {
                state.status = 'idle';
                state.roles = action.payload.map((role: string) => role );
            },
            setError(state, action) {
                state.status = 'error';
                state.error = action.payload.error
            }
        }
    }
);

export const {
    getRoles,
    setRoles,
    setError
} = roleSlice.actions;

export default roleSlice.reducer;