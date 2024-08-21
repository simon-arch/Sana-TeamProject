import {createEpic} from "./helpers/createEpic";
import {
    setError, User,
    getUsers, setUsers,
    deleteUser, deleteUserSuccess,
    registerRequest, registerSuccess,
    updateRequest, updateSuccess,
    setUserState, setUserStateSuccess
} from "../slices/userSlice";
import {PayloadAction} from "@reduxjs/toolkit";

export const registerUserEpic = createEpic(
    registerRequest.type,
    action => {
        const {username, password, firstName, lastName, role, permissions, state, workType, workTime} = action.payload;
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
                        workTime: ${workTime}
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
                        workType: ${user.workType}
                        workTime: ${user.workTime}
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
                        setState(username: "${username}", state: ${state}) { username }
                    }
            }`;
    },
    data => setUserStateSuccess(data.data.user.setState.username),
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
                workTime`;
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

export const userEpics = [
    registerUserEpic,
    deleteUserEpic,
    setUserStateEpic,
    getAllUsersEpic,
    updateUserEpic
];