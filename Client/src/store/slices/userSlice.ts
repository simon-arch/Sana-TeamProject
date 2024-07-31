import { createSlice } from "@reduxjs/toolkit";
import { sendRequest } from "../epics/helpers/request";

export interface User {
    id: number;
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
                    id: action.payload[index].id,
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
                                    set_role(id:${action.payload.id}, role:${action.payload.role}) { id }
                                }
                        }`, localStorage.getItem('authToken') || '');
            },
            setUserPermissions(_, action) {
                sendRequest(`mutation {
                                user {
                                    set_permissions(id:${action.payload.id}, permissions:[${action.payload.permissions}]) { id }
                                }
                        }`, localStorage.getItem('authToken') || '');
            },
            setError(state, action) {
                state.status = 'error',
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
    setError
} = userSlice.actions;

export default userSlice.reducer;