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
            getUsers(state: UserState, action) {
                state.status = 'loading';
            },

            setUsers(state: UserState, action: PayloadAction<ResultSet<User>>) {
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
            registerRequest(state: UserState, action: PayloadAction<User>) {
                state.status = 'loading';
            },
            registerSuccess(state: UserState) {
                state.status = "idle";
            },

            //@ts-ignore
            updateRequest(state: UserState, action) {
                state.status = 'loading';
            },
            updateSuccess(state: UserState) {
                state.status = "idle";
            },

            //@ts-ignore
            deleteUser(state: UserState, action: PayloadAction<{ username: string }>) {
                state.status = 'loading';
            },
            deleteUserSuccess(state: UserState, action: PayloadAction<string>) {
                state.users = state.users.filter(user => user.username !== action.payload);
                state.status = 'idle';
            },
            //@ts-ignore
            setUserState(state: UserState, action: PayloadAction<{ username: string, state: UserStatus }>) {
                state.status = 'loading';
            },
            setUserStateSuccess(state: UserState, action: PayloadAction<{ username: string, state: UserStatus }>) {
                state.users = state.users.map(user => {
                    if (user.username === action.payload.username) {
                        user.state = action.payload.state;
                    }
                    return user;
                });
                state.status = 'idle';
            },

            setError(state: UserState, action) {
                state.status = 'error'
                state.error = action.payload
            },
            dismissError(state) {
                state.error = null;
            }
        }
    }
);

export const {
    getUsers, setUsers,
    getUsersWithApproveVacationsPermission, setUsersWithApproveVacationsPermission,
    registerRequest, registerSuccess,
    deleteUser, deleteUserSuccess,
    setError, dismissError,
    updateRequest, updateSuccess,
    setUserState, setUserStateSuccess
} = userSlice.actions;

export default userSlice.reducer;