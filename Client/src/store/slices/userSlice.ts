import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { sendRequest } from "../epics/helpers/request";

export interface User {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    role: string;
    permissions: string[];
}

export interface UserState {
    users: User[];
    status: 'idle' | 'loading' | 'error';
    error: string | null;
}

const initialState: UserState = {
    users: [],
    status: 'loading',
    error: null
};

const userSlice = createSlice(
    {
        name: 'users',
        initialState,
        reducers: {
            getUsers(state){
                state.status = 'loading';
            },
            setUsers(state, action) {
                state.users = Object.keys(action.payload).map(index => ({
                    username: action.payload[index].username,
                    password: action.payload[index].password,
                    firstname: action.payload[index].firstName,
                    lastname: action.payload[index].lastName,
                    role: action.payload[index].role,
                    permissions: action.payload[index].permissions
                }));
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
            registerRequest(state, action: PayloadAction<User>) {
                state.status = 'loading';
                console.log('State request:', action.payload);
            },
            registerSuccess(state, action: PayloadAction<User>) {
                state.users.push(action.payload);
                state.status = 'idle';
                console.log('User added to state:', action.payload);
            },

            deleteUser(state) {
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