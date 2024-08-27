import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Permission} from "../../models/User.ts";
import SliceState from "../../models/SliceState.ts";

export interface PermissionState extends SliceState {
    permissions: Permission[];
}

const initialState: PermissionState = {
    permissions: [],
    status: 'loading',
    error: null
};

const permissionSlice = createSlice(
    {
        name: 'permissions',
        initialState,
        reducers: {
            permissionsRequest(state: PermissionState){
                state.status = 'loading';
            },
            permissionsRequestResolve(state: PermissionState, action: PayloadAction<Permission[]>) {
                state.status = 'idle';
                state.permissions = action.payload;
            },
            setError(state: PermissionState, action) {
                state.status = 'error';
                state.error = action.payload.error;
            }
        }
    }
);

export const {
    permissionsRequest,
    permissionsRequestResolve,
    setError
} = permissionSlice.actions;

export default permissionSlice.reducer;