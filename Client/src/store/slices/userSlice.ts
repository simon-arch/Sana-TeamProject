import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { sendRequest } from "../epics/helpers/request";

export interface User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
    state: 'AVALIABLE' | 'VACATION' | 'FIRED'
}

export interface UserState {
    users: User[];
    totalCount: number;
    status: 'idle' | 'loading' | 'error';
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
            getUsers(state, action){
                state.status = 'loading';
            },
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
            registerRequest(state, action: PayloadAction<User>) {
                state.status = 'loading';
            },
            registerSuccess(state, action: PayloadAction<User>) {
                state.users.push({
                    username: action.payload.username,
                    password: action.payload.password,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    role: action.payload.role,
                    permissions: action.payload.permissions,
                    state: action.payload.state
                });
                state.status = "idle";
            },

            //@ts-ignore
            deleteUser(state, action: PayloadAction<{ username: string }>) {
                state.status = 'loading';
            },
            deleteUserSuccess(state, action: PayloadAction<string>) {
                state.users = state.users.filter(user => user.username !== action.payload);
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
    getUsers,
    setUsers,
    setUserRole,
    setUserPermissions,
    registerRequest,
    registerSuccess,
    deleteUser,
    deleteUserSuccess,
    setError
} = userSlice.actions;

export default userSlice.reducer;