import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ErrorType, Status} from "../../helpers/types.ts";
import {Role} from "../../models/User.ts";

export interface RoleState {
    roles: Role[];
    status: Status;
    error: ErrorType;
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
            getRoles(state: RoleState){
                state.status = 'loading';
            },
            setRoles(state: RoleState, action: PayloadAction<Role[]>) {
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
    getRoles,
    setRoles,
    setError
} = roleSlice.actions;

export default roleSlice.reducer;