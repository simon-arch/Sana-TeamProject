import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import User, {UserLite, UserStatus} from "../../models/User.ts";
import ResultSet from "../../models/ResultSet.ts";
import SliceState from "../../models/SliceState.ts";

export interface UserState extends SliceState {
    users: User[];
    usersWithApprovalPermission: UserLite[];
    totalCount: number;
}

const initialState: UserState = {
    users: [],
    usersWithApprovalPermission: [],
    totalCount: 0,
    status: 'idle',
    error: null
};

const userSlice = createSlice(
    {
        name: 'users',
        initialState,
        reducers: {
            //@ts-ignore
            usersRequest(state: UserState, action) {
                state.status = 'loading';
            },
            usersRequestResolve(state: UserState, action: PayloadAction<ResultSet<User>>) {
                state.totalCount = action.payload.totalCount;
                state.users = action.payload.results;
                state.status = 'idle';
            },
            getUsersWithApproveVacationsPermission(state: UserState) {
                state.status = 'loading';
            },
            setUsersWithApproveVacationsPermission(state: UserState, action: PayloadAction<UserLite[]>) {
                state.totalCount = action.payload.length;
                state.usersWithApprovalPermission = action.payload;
                state.status = 'idle';
            },
            //@ts-ignore
            userCreate(state: UserState, action: PayloadAction<User>) {
                state.status = 'loading';
            },
            userCreateResolve(state: UserState) {
                state.status = "idle";
            },

            //@ts-ignore
            userUpdate(state: UserState, action) {
                state.status = 'loading';
            },
            userUpdateResolve(state: UserState) {
                state.status = "idle";
            },

            //@ts-ignore
            userDelete(state: UserState, action: PayloadAction<{ username: string }>) {
                state.status = 'loading';
            },
            userDeleteResolve(state: UserState) {
                state.status = 'idle';
            },
            //@ts-ignore
            userStateUpdate(state: UserState, action: PayloadAction<{ username: string, state: UserStatus }>) {
                state.status = 'loading';
            },
            userStateUpdateResolve(state: UserState) {
                state.status = 'idle';
            },

            setError(state: UserState, action) {
                state.status = 'error';
                state.error = action.payload;
            },
            dismissError(state) {
                state.error = null;
            }
        }
    }
);

export const {
    usersRequest, usersRequestResolve,
    getUsersWithApproveVacationsPermission, setUsersWithApproveVacationsPermission,
    userCreate, userCreateResolve,
    userDelete, userDeleteResolve,
    setError, dismissError,
    userUpdate, userUpdateResolve,
    userStateUpdate, userStateUpdateResolve
} = userSlice.actions;

export default userSlice.reducer;