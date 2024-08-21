import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {sendRequest} from "../epics/helpers/request";
import { Status } from "../../helpers/types";

export interface User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
    state: string;
    workType: string;
    workTime: number | null;
}

export interface UserState {
    users: User[];
    totalCount: number;
    status: Status;
    error: string | null;
}

const initialState: UserState = {
    users: [],
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
            getUsers(state, action){ state.status = 'loading'; },

            setUsers(state, action) {
                state.totalCount = action.payload.totalCount;
                state.users = action.payload.results;
                state.status = 'idle';
            },
            setUserRole(state, action) {
                state;
                sendRequest(`mutation {
                                user {
                                    set_role(username:"${action.payload.username}", role:${action.payload.role}) { username role }
                                }
                        }`);
            },
            setUserPermissions(_, action) {
                sendRequest(`mutation {
                                user {
                                    set_permissions(username:"${action.payload.username}", permissions:[${action.payload.permissions}]) { username permissions }
                                }
                        }`);
            },
            //@ts-ignore
            registerRequest(state, action: PayloadAction<User>) { state.status = 'loading';},
            registerSuccess(state) { state.status = "idle";},

            //@ts-ignore
            updateRequest(state, action: PayloadAction<User>) { state.status = 'loading'; },
            updateSuccess(state) { state.status = "idle"; },

            //@ts-ignore
            deleteUser(state, action: PayloadAction<{ username: string }>) {
                state.status = 'loading';
            },
            deleteUserSuccess(state, action: PayloadAction<string>) {
                state.users = state.users.filter(user => user.username !== action.payload);
                state.status = 'idle';
            },
            //@ts-ignore
            setUserState(state, action: PayloadAction<{ username: string, state: string }>) {
                state.status = 'loading';
            },
            setUserStateSuccess(state, action: PayloadAction<string>) {
                state.users = state.users.map(user => {
                    if (user.username === action.payload) {
                        user.state = action.payload;
                    }
                    return user;
                });
                state.status = 'idle';
            },
            setError(state, action) {
                state.status = 'error'
                state.error = action.payload.error
            }
        }
    }
);

export const {
    getUsers, setUsers,
    setUserRole,
    setUserPermissions,
    registerRequest, registerSuccess,
    deleteUser, deleteUserSuccess,
    setError,
    updateRequest, updateSuccess,
    setUserState, setUserStateSuccess
} = userSlice.actions;

export default userSlice.reducer;