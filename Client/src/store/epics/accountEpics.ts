import {
    setError, logout,
    tokenRequest, tokenRequestResolve,
    accountInfoRequest, accountInfoRequestResolve,
} from "../slices/accountSlice";
import {createEpic} from "./helpers/createEpic";
import {ResponseCode} from "../../models/ResponseError.ts";

export const loginEpic = createEpic(
    tokenRequest.type,
    action => `
    mutation {
        auth {
            login(username: "${action.payload.username}", password: "${action.payload.password}") 
        } 
    }`,
    data => tokenRequestResolve(data.data.auth.login),
    error => setError(error.message)
);

export const userInfoEpic = createEpic(
    accountInfoRequest.type,
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
    data => accountInfoRequestResolve(data.data.user.user),
    error => {
        if (error.code === ResponseCode.ServiceUnavailable || error.code === ResponseCode.ServerError) {
            return logout();
        }
        return setError(error.message);
    }
);

export const accountEpics = [
    loginEpic,
    userInfoEpic,
];