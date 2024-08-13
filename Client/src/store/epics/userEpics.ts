import {
    getAccessToken,
    setTokenPayload,
    setError,
    getAccountInfo,
    setAccountInfo,
    logout
} from '../slices/accountSlice';
import {createEpic} from "./helpers/createEpic.ts";
import {
    deleteUser,
    deleteUserSuccess,
    getUsers,
    registerRequest,
    registerSuccess,
    setUsers, setUserState, setUserStateSuccess
} from "../slices/userSlice.ts";
import {getPermissions, setPermissions} from "../slices/permissionSlice.ts";
import {getRoles, setRoles} from "../slices/roleSlice.ts";

export const loginEpic = createEpic(
    getAccessToken.type,
    (action: any) => `
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
    (action: any) => `
    query { 
        user { 
            get(username: "${action.payload}") { username, firstName, lastName, role, permissions, state } 
        } 
    }`,
    data => setAccountInfo(data.data.user.get),
    error => {
        if (error.message === "Failed to fetch") {
            return logout();
        }
        return setError(error.message);
    }
);

export const registerUserEpic = createEpic(
    registerRequest.type,
    (action: any) => {
        const {username, password, firstName, lastName, role, permissions} = action.payload;
        return `
        mutation {
            auth {
                register(user: { 
                    username: "${username}", 
                    password: "${password}", 
                    firstName: "${firstName}", 
                    lastName: "${lastName}", 
                    role: ${role}, 
                    permissions: ${JSON.stringify(permissions).replace(/"/g, '')}
                }) 
                { 
                    username 
                    firstName 
                    lastName 
                    role 
                    permissions
                    state
                }
            }
        }`;
    },
    data => registerSuccess(data.data.auth.register),
    error => setError(error.message)
);

export const deleteUserEpic = createEpic(
    deleteUser.type,
    (action: any) => {
        const username = action.payload.username;
        return `mutation {
                    user {
                        delete_user(username: "${username}") { username }
                    }
            }`;
    },

    data => deleteUserSuccess(data.data.user.delete_user.username),
    error => setError(error.message)
);

export const setUserStateEpic = createEpic(
    setUserState.type,
    (action: any) => {
        const username = action.payload.username;
        const state = action.payload.state;
        return `mutation {
                    user {
                        set_state(username: "${username}", state: ${state}) { username }
                    }
            }`;
    },
    data => setUserStateSuccess(data.data.user.set_state.username),
    error => setError(error.message)
);

export const getAllUsersEpic = createEpic(
    getUsers.type,
    () => `
    query { 
        user { 
            get_all { username, firstName, lastName, role, permissions, state } 
        } 
    }`,
    data => setUsers(data.data.user.get_all),
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

export const userEpics = [
    loginEpic,
    userInfoEpic,
    registerUserEpic,
    deleteUserEpic,
    setUserStateEpic,
    getAllUsersEpic,
    permissionsEpic,
    rolesEpic
];







