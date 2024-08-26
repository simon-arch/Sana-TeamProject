import {
    setError, logout,
    getAccessToken, setTokenPayload,
    getAccountInfo, setAccountInfo, 
} from "../slices/accountSlice";
import {createEpic} from "./helpers/createEpic";

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
                workTime
                approvedVacationsByUsers
                approveVacationsForUsers
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

export const accountEpics = [
    loginEpic,
    userInfoEpic,
];