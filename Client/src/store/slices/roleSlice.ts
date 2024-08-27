import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Role} from "../../models/User.ts";
import SliceState from "../../models/SliceState.ts";

export interface RoleState extends SliceState {
    roles: Role[];
}

const initialState: RoleState = {
    roles: [],
    status: 'loading',
    error: null
};

const roleSlice = createSlice(
    {
        name: 'roles',
        initialState,
        reducers: {
            rolesRequest(state: RoleState){
                state.status = 'loading';
            },
            rolesRequestResolve(state: RoleState, action: PayloadAction<Role[]>) {
                state.status = 'idle';
                state.roles = action.payload;
            },
            setError(state: RoleState, action) {
                state.status = 'error';
                state.error = action.payload.error
            }
        }
    }
);

export const {
    rolesRequest,
    rolesRequestResolve,
    setError
} = roleSlice.actions;

export default roleSlice.reducer;