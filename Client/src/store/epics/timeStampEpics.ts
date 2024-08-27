import {
    setError,
    workTimeIntervalRequest, workTimeIntervalRequestResolve,
    workTimeCreate, workTimeCreateResolve,
    workTimeDelete, workTimeDeleteResolve,
    workTimeLatestRequest, workTimeLatestRequestResolve,
    workTimeListRequest, workTimeListRequestResolve,
    workTimeUpdate, workTimeUpdateResolve
} from '../slices/timeStampSlice';
import {createEpic} from "./helpers/createEpic";

export const workTimeLatestRequestEpic = createEpic(
    workTimeLatestRequest.type,
    action => {
        const username = action.payload.username;
        return `query {
                    timeStamp {
                        latest(username: "${username}") {
                            id
                            username
                            timeStart
                            timeEnd
                            source
                            editor
                        }
                    }
                }`
    },
    data => workTimeLatestRequestResolve(data.data.timeStamp.latest),
    error => setError(error.message)
);

export const workTimeListRequestEpic = createEpic(
    workTimeListRequest.type,
    action => {
        const {username, pageSize, pageNumber} = action.payload;
        return `query {
                timeStamp {
                    byUsername(username: "${username}", pageSize: ${pageSize}, pageNumber: ${pageNumber}) {
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
    data => workTimeListRequestResolve(data.data.timeStamp.byUsername),
    error => setError(error.message)
);

export const workTimeUpdateEpic = createEpic(
    workTimeUpdate.type,
    action => {
        const { id, timeStart, timeEnd, editor } = action.payload;
        return `mutation {
                timeStamp {
                    update(
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
    data => workTimeUpdateResolve(data.data.timeStamp.update),
    error => setError(error.message)
);

export const workTimeDeleteEpic = createEpic(
    workTimeDelete.type,
    action => {
        const id = action.payload;
        return `mutation {
                timeStamp {
                    remove(id: ${id}) { id }
            } 
    }`},
    data => workTimeDeleteResolve(data.data.timeStamp.remove.id),
    error => setError(error.message)
);

export const workTimeCreateEpic = createEpic(
    workTimeCreate.type,
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
    data => workTimeCreateResolve(data.data.timeStamp.add),
    error => setError(error.message)
);

export const workTimeByMonthRequestEpic = createEpic(
    workTimeIntervalRequest.type,
    action => {
        const { username, dateStart, dateEnd } = action.payload;
        return `query {
                timeStamp {
                    interval(
                            username: "${username}",
                            dateStart: "${dateStart}",
                            dateEnd: "${dateEnd}"
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
    data => workTimeIntervalRequestResolve(data.data.timeStamp.interval),
    error => setError(error.message)
);

export const timeStampEpics = [
    workTimeLatestRequestEpic,
    workTimeListRequestEpic,
    workTimeByMonthRequestEpic,
    workTimeUpdateEpic,
    workTimeDeleteEpic,
    workTimeCreateEpic
];

