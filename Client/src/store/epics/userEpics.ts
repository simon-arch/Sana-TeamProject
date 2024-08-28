import {createEpic} from "./helpers/createEpic.ts";
import {
    registerRequest,
    registerSuccess,
    deleteUser,
    deleteUserSuccess,
    getUsers,
    setUsers,
    setError,
    setUserState,
    setUserStateSuccess,
    updateRequest,
    updateSuccess,
    getUsersWithApproveVacationsPermission,
    setUsersWithApproveVacationsPermission
} from "../slices/userSlice.ts";
import {PayloadAction} from "@reduxjs/toolkit";
import User, {Permission} from "../../models/User.ts";

export const registerUserEpic = createEpic(
    registerRequest.type,
    action => {
        const user = action.payload;
        return `mutation {
            auth {
                register(
                    user: { 
                        username: "${user.username}", 
                        password: "${user.password}", 
                        firstName: "${user.firstName}", 
                        lastName: "${user.lastName}", 
                        role: ${user.role}, 
                        permissions: ${JSON.stringify(user.permissions).replace(/"/g, '')},
                        state: ${user.state},
                        workType: ${user.workType},
                        workTime: ${user.workTime},
                        approvedVacationsByUsers: ${JSON.stringify(user.approvedVacationsByUsers)}
                    }
                    ) { 
                        username 
                        firstName 
                        lastName 
                        role 
                        permissions
                        state
                        workType
                        workTime
                        approvedVacationsByUsers
                    }
            }
        }`;
    },
    data => registerSuccess(data.data.auth.register),
    error => setError(error.message)
);

export const deleteUserEpic = createEpic(
    deleteUser.type,
    action => {
        const username = action.payload.username;
        return `mutation {
                    user {
                        delete(username: "${username}") { username }
                    }
            }`;
    },

    data => deleteUserSuccess(data.data.user.delete.username),
    error => setError(error.message)
);

export const updateUserEpic = createEpic(
    updateRequest.type,
    (action: PayloadAction<User>) => {
        const user = action.payload;
        return `mutation {
            user {
                update(
                    user: {
                        username: "${user.username}",
                        firstName: "${user.firstName}",
                        lastName: "${user.lastName}",
                        role: ${user.role},
                        permissions: [${(user.permissions)}],
                        workType: ${user.workType},
                        workTime: ${user.workTime},
                        approvedVacationsByUsers: [${user.approvedVacationsByUsers.map(user => `"${user}"`)}]
                        }
                    ) {
                        username
                    } 
                } 
        }`;
    },

    data => updateSuccess(data.data.user.update),
    error => setError(error.message)
);

export const setUserStateEpic = createEpic(
    setUserState.type,
    action => {
        const username = action.payload.username;
        const state = action.payload.state;
        return `mutation {
                    user {
                        setState(username: "${username}", state: ${state}) {
                            username
                            state 
                        }
                    }
            }`;
    },
    data => setUserStateSuccess(data.data.user.setState),
    error => setError(error.message)
);

export const getAllUsersEpic = createEpic(
    getUsers.type,
    action => {
        const {pageNumber, pageSize, query} = action.payload;
        const hasParams = pageNumber || pageSize || query;
        let {fields} = action.payload;
        if (!fields) {
            fields = `
                username
                firstName
                lastName
                role
                permissions
                state
                workType
                workTime
                approvedVacationsByUsers`;
        }
        return `
            query { 
                user { 
                    users ${hasParams ? `(
                        ${pageNumber ? `pageNumber: ${pageNumber}` : ''}
                        ${pageSize ? `pageSize: ${pageSize}` : ''}
                        ${query ? `query: "${query}"` : ''}
                    )` : ""} {
                            totalCount
                            results {
                                ${fields}
                            }
                        } 
                } 
            }`;
    },
    data => setUsers(data.data.user.users),
    error => setError(error.message)
);

export const getUsersWithApproveVacationsPermissionEpic = createEpic(
    getUsersWithApproveVacationsPermission.type,
    () => {
        const approveVacationsPermission = Permission.ApproveVacations;
        return `query {
            user {
                usersWithPermission(permissions: [${approveVacationsPermission}]) {
                    username
                    firstName
                    lastName
                    role
                    state
                }
            }
        }`;
    },
    data => setUsersWithApproveVacationsPermission(data.data.user.usersWithPermission),
    error => setError(error.message)
);

export const userEpics = [
    registerUserEpic,
    deleteUserEpic,
    setUserStateEpic,
    getAllUsersEpic,
    updateUserEpic,
    getUsersWithApproveVacationsPermissionEpic,
];