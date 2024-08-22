import {
    setError,
    getAccessToken, setTokenPayload,
    getAccountInfo, setAccountInfo,
    logout
} from '../slices/accountSlice';
import {createEpic} from "./helpers/createEpic.ts";
import {
    deleteUser, deleteUserSuccess,
    getUsers,
    registerRequest, registerSuccess,
    updateRequest, updateSuccess,
    setUsers,
    setUserState, setUserStateSuccess,
} from "../slices/userSlice.ts";
import {getPermissions, setPermissions} from "../slices/permissionSlice.ts";
import {getRoles, setRoles} from "../slices/roleSlice.ts";
import {getWorkTypes, setWorkTypes} from "../slices/workTypeSlice.ts";
import {PayloadAction} from "@reduxjs/toolkit";
import User from "../../models/User.ts";

export const loginEpic = createEpic(
    getAccessToken.type,
    action => `
    mutation {
        auth {
            login(username: "${action.payload.username}", password: "${action.payload.password}") 
        } 
    }`,
    data => setTokenPayload(data.data.auth.login),
    error => setError(error.message)
);

export const userInfoEpic = createEpic(
    getAccountInfo.type,
    action => `
    query { 
        user { 
            user(username: "${action.payload}") {
                username
                firstName
                lastName
                role
                permissions
                state
                workType
                workingTime
            } 
        } 
    }`,
    data => setAccountInfo(data.data.user.user),
    error => {
        if (error.message === "Failed to fetch") {
            return logout();
        }
        return setError(error.message);
    }
);

export const registerUserEpic = createEpic(
    registerRequest.type,
    action => {
        const {username, password, firstName, lastName, role, permissions, state, workType, workingTime} = action.payload;
        return `mutation {
            auth {
                register(
                    user: { 
                        username: "${username}", 
                        password: "${password}", 
                        firstName: "${firstName}", 
                        lastName: "${lastName}", 
                        role: ${role}, 
                        permissions: ${JSON.stringify(permissions).replace(/"/g, '')},
                        state: ${state},
                        workType: ${workType},
                        workingTime: ${workingTime}
                    }
                    ) { 
                        username 
                        firstName 
                        lastName 
                        role 
                        permissions
                        state
                        workType
                        workingTime
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
                        username: "${user.username}"
                        firstName: "${user.firstName}"
                        lastName: "${user.lastName}"
                        role: ${user.role}
                        permissions: [${(user.permissions)}]
                        }
                    ) {
                        username 
                    } 
                } 
        }`;
    },

    () => updateSuccess(),
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
)

export const getAllUsersEpic = createEpic(
    getUsers.type,
    action => {
        const {pageNumber, pageSize, query} = action.payload;
        const hasParams = pageNumber || pageSize || query;
        let { fields } = action.payload;
        if (!fields) {
            fields = `
                username
                firstName
                lastName
                role
                permissions
                state
                workType
                workingTime`;
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

export const permissionsEpic = createEpic(
    getPermissions.type,
    () => `
    query { 
        auth { 
            permissions 
        } 
    }`,
    data => setPermissions(data.data.auth.permissions),
    error => setError(error.message)
);

export const rolesEpic = createEpic(
    getRoles.type,
    () => `
    query { 
        auth { 
            roles 
        } 
    }`,
    data => setRoles(data.data.auth.roles),
    error => setError(error.message)
);

export const workTypesEpic = createEpic(
    getWorkTypes.type,
    () => `
    query { 
        auth { 
            workTypes 
        } 
    }`,
    data => setWorkTypes(data.data.auth.workTypes),
    error => setError(error.message)
);

export const userEpics = [
    loginEpic,
    userInfoEpic,
    registerUserEpic,
    deleteUserEpic,
    setUserStateEpic,
    getAllUsersEpic,
    permissionsEpic,
    updateUserEpic,
    rolesEpic,
    workTypesEpic
];







