import {createEpic} from "./helpers/createEpic.ts";
import {
    userCreate, userCreateResolve,
    userDelete, userDeleteResolve,
    usersRequest, usersRequestResolve,
    userUpdate,userUpdateResolve,
    userStateUpdate, userStateUpdateResolve,
    getUsersWithApproveVacationsPermission, setUsersWithApproveVacationsPermission,
    setError
} from "../slices/userSlice.ts";
import {PayloadAction} from "@reduxjs/toolkit";
import User, {Permission} from "../../models/User.ts";

export const userCreateEpic = createEpic(
    userCreate.type,
    action => {
        const user = action.payload;
        return `mutation {
            user {
                add(
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
    data => userCreateResolve(data.data.user.add),
    error => setError(error.message)
);

export const userDeleteEpic = createEpic(
    userDelete.type,
    action => {
        const username = action.payload.username;
        return `mutation {
                    user {
                        delete(username: "${username}") { username }
                    }
            }`;
    },

    () => userDeleteResolve(),
    error => setError(error.message)
);

export const userUpdateEpic = createEpic(
    userUpdate.type,
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

    data => userUpdateResolve(data.data.user.update),
    error => setError(error.message)
);

export const userStateUpdateEpic = createEpic(
    userStateUpdate.type,
    action => {
        const username = action.payload.username;
        const state = action.payload.state;
        return `mutation {
                    user {
                        setState(username: "${username}", state: ${state}) {
                            username
                        }
                    }
            }`;
    },
    () => userStateUpdateResolve(),
    error => setError(error.message)
);

export const usersRequestEpic = createEpic(
    usersRequest.type,
    action => {
        const {pageNumber, pageSize, sort, query, includeFired, fields} = action.payload;

        return `
            query { 
                user { 
                    users (
                        includeFired: ${includeFired ?? false}
                        ${pageNumber ? `pageNumber: ${pageNumber}` : ''}
                        ${pageSize ? `pageSize: ${pageSize}` : ''}
                        ${sort ? `sort: ${sort}` : ''}
                        ${query ? `query: "${query}"` : ''}
                    ) {
                        totalCount
                        results {
                            ${fields ?? `
                                username
                                firstName
                                lastName
                                role
                                permissions
                                state
                                workType
                                workTime
                                approvedVacationsByUsers`
                            }
                        }
                        } 
                } 
            }`;
    },
    data => usersRequestResolve(data.data.user.users),
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
    userCreateEpic,
    userDeleteEpic,
    userStateUpdateEpic,
    usersRequestEpic,
    userUpdateEpic,
    getUsersWithApproveVacationsPermissionEpic,
];