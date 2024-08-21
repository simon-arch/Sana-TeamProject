import { createSlice } from "@reduxjs/toolkit";
import { Status } from "../../helpers/types";

export interface UserState {
    permissions: string[];
    status: Status;
    error: string | null;
}

const initialState: UserState = {
    permissions: [],
    status: 'loading',
    error: null
};

const permissionSlice = createSlice(
    {
        name: 'permissions',
        initialState,
        reducers: {
            getPermissions(state){
                state.status = 'loading';
            },
            setPermissions(state, action) {
                state.status = 'idle';
                state.permissions = action.payload.map((perm: string) => perm );
            },
            setError(state, action) {
                state.status = 'error';
                state.error = action.payload.error;
            }
        }
    }
);

export const {
    getPermissions,
    setPermissions,
    setError
} = permissionSlice.actions;

export default permissionSlice.reducer;