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
    setUsers
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
            get(username: "${action.payload}") { username, firstName, lastName, role, permissions } 
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
        const { username, password, firstname, lastname, role, permissions } = action.payload;
        console.log('Register request action:', action);
        return `
        mutation {
            auth {
                register(user: { 
                    username: "${username}", 
                    password: "${password}", 
                    firstName: "${firstname}", 
                    lastName: "${lastname}", 
                    role: ${role}, 
                    permissions: ${JSON.stringify(permissions).replace(/"/g, '')} 
                }) 
                { 
                    username 
                    password
                    firstName 
                    lastName 
                    role 
                    permissions 
                }
            }
        }`;
    },
    data => {
        console.log('Register response data:', data);
        return registerSuccess(data.data.user.register);
    },
    error => {
        console.error('Register error:', error);
        return setError(error.message);
    }
);


export const deleteUserEpic = createEpic(
    deleteUser.type,
    (action: any) => `
    mutation {
        user {
            delete(username: "${action.payload.username}") { username }
        }
    }`,
    data => {
        console.log(data);
        return deleteUserSuccess(data.data.user.delete_user.username);
    },
    error => setError(error.message)
);

export const getAllUsersEpic = createEpic(
    getUsers.type,
    () => `
    query { 
        user { 
            get_all { username, firstName, lastName, role, permissions } 
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
    getAllUsersEpic,
    permissionsEpic,
    rolesEpic
];







