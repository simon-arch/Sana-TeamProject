import {
    setError,
    worktimeCreate, worktimeCreateResolve,
    worktimeDelete, worktimeDeleteResolve,
    worktimeListRequest, worktimeListRequestResolve,
    worktimeUpdate, worktimeUpdateResolve
} from '../slices/timeStampSlice';
import {createEpic} from "./helpers/createEpic.ts";

export const worktimeRequestEpic = createEpic(
    worktimeListRequest.type,
    action => {
        const {username, pageSize, pageNumber} = action.payload;
        return `query {
                timeStamp {
                    byDateRange(username: "${username}", pageSize: ${pageSize}, pageNumber: ${pageNumber}) {
                        totalCount
                        results {
                            id
                            username
                            timeStart
                            timeEnd
                            source
                            editor
                        }
                    }
            } 
    }`},
    data => worktimeListRequestResolve(data.data.timeStamp["byDateRange"]),
    error => setError(error.message)
);

export const worktimeUpdateEpic = createEpic(
    worktimeUpdate.type,
    action => {
        const { id, timeStart, timeEnd, editor } = action.payload;
        return `mutation {
                timeStamp {
                    setTime(
                        id: ${id}
                        ${timeStart ? `timeStart: "${timeStart}"` : ""}
                        timeEnd: "${timeEnd}"
                        ${editor ? `editor: "${editor}"` : ""}
                    ) {
                        id
                        username
                        timeStart
                        timeEnd
                        source
                        editor
                    }
            } 
    }`},
    data => worktimeUpdateResolve(data.data.timeStamp.setTime),
    error => setError(error.message)
);

export const worktimeDeleteEpic = createEpic(
    worktimeDelete.type,
    action => {
        const id = action.payload;
        return `mutation {
                timeStamp {
                    remove(id: ${id}) { id }
            } 
    }`},
    data => worktimeDeleteResolve(data.data.timeStamp.remove.id),
    error => setError(error.message)
);

export const worktimeCreateEpic = createEpic(
    worktimeCreate.type,
    action => {
        const { username, timeStart, timeEnd, source, editor } = action.payload;
        return `mutation {
                timeStamp {
                    add(
                        timeStamp: {
                            username: "${username}"
                            timeStart: "${timeStart}"
                            ${timeEnd ? `timeEnd: "${timeEnd}"` : ""}
                            source: ${source}
                            ${editor ? `editor: "${editor}"` : ""}
                        }
                    ) {
                        id
                        username
                        timeStart
                        timeEnd
                        source
                        editor
                    }
            } 
    }`},
    data => worktimeCreateResolve(data.data.timeStamp.add),
    error => setError(error.message)
);

export const timeStampEpics = [
    worktimeRequestEpic,
    worktimeUpdateEpic,
    worktimeDeleteEpic,
    worktimeCreateEpic
];







