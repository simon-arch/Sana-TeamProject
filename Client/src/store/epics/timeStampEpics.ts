import {
    setError,
    worktimeCreate, worktimeCreateResolve,
    worktimeDelete, worktimeDeleteResolve,
    worktimeRequest, worktimeRequestResolve,
    worktimeUpdate, worktimeUpdateResolve
} from '../slices/timeStampSlice';
import {createEpic} from "./helpers/createEpic.ts";

export const worktimeRequestEpic = createEpic(
    worktimeRequest.type,
    (action) => {
        const username = action.payload;
        return `query {
                timeStamp {
                    get_by_username(username: "${username}") {
                        id
                        username
                        timeStart
                        timeEnd
                        source
                        editor
                    }
            } 
    }`},
    data => worktimeRequestResolve(data.data.timeStamp.get_by_username),
    error => setError(error.message)
);

export const worktimeUpdateEpic = createEpic(
    worktimeUpdate.type,
    (action) => {
        const { id, username, timeStart, timeEnd } = action.payload;
        return `mutation {
                timeStamp {
                    set_time(id: ${id}, timeStart: "${timeStart}", timeEnd: "${timeEnd}", editor: "${username}")
            } 
    }`},
    _ => worktimeUpdateResolve(),
    error => setError(error.message)
);

export const worktimeDeleteEpic = createEpic(
    worktimeDelete.type,
    (action) => {
        const id = action.payload;
        return `mutation {
                timeStamp {
                    remove(id: ${id})
            } 
    }`},
    _ => worktimeDeleteResolve(),
    error => setError(error.message)
);

export const worktimeCreateEpic = createEpic(
    worktimeCreate.type,
    (action) => {
        const { username, timeStart, timeEnd } = action.payload;
        return `mutation {
                timeStamp {
                    add(timeStamp: {username: "${username}", timeStart: "${timeStart}", timeEnd: "${timeEnd}", source: USER, editor: "${username}"}) {
                        id
                    }
            } 
    }`},
    _ => worktimeCreateResolve(),
    error => setError(error.message)
);

export const timeStampEpics = [
    worktimeRequestEpic,
    worktimeUpdateEpic,
    worktimeDeleteEpic,
    worktimeCreateEpic
];







