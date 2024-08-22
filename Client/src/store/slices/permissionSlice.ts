import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ErrorType, Status} from "../../helpers/types.ts";
import {Permission} from "../../models/User.ts";

export interface PermissionState {
    permissions: Permission[];
    status: Status;
    error: ErrorType;
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
            getPermissions(state: PermissionState){
                state.status = 'loading';
            },
            setPermissions(state: PermissionState, action: PayloadAction<Permission[]>) {
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
    getPermissions,
    setPermissions,
    setError
} = permissionSlice.actions;

export default permissionSlice.reducer;