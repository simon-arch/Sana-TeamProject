import { 
    setError, 
    planCreate, planCreateResolve, 
    planDelete, planDeleteResolve, 
    planRequest, planRequestResolve, 
    planUpdate, planUpdateResolve 
} from "../slices/planSlice.ts";
import {createEpic} from "./helpers/createEpic.ts";

export const planRequestEpic = createEpic(
    planRequest.type,
    (action) => {
        const usernames = action.payload;
        return `query {
                plan {
                    get_by_usernames(usernames: [${usernames.map((username: string) => `"${username}"`).join(',')}]) {
                        id
                        title
                        description
                        timeStart
                        timeEnd
                        owner
                    }
            } 
    }`},
    data => planRequestResolve(data.data.plan.get_by_usernames),
    error => setError(error.message)
);

export const planUpdateEpic = createEpic(
    planUpdate.type,
    (action) => {
        const { id, timeStart, title, description, timeEnd } = action.payload;
        return `mutation {
                plan {
                    set_time(id: ${id}, title: "${title}", description: "${description}", timeStart: "${timeStart}", timeEnd: "${timeEnd}")
            } 
    }`},
    _ => planUpdateResolve(),
    error => setError(error.message)
);

export const planDeleteEpic = createEpic(
    planDelete.type,
    (action) => {
        const id = action.payload;
        return `mutation {
                plan {
                    remove(id: ${id})
            } 
    }`},
    _ => planDeleteResolve(),
    error => setError(error.message)
);

export const planCreateEpic = createEpic(
    planCreate.type,
    (action) => {
        const { title, description, timeStart, timeEnd, username } = action.payload;
        return `mutation {
                plan {
                    add(plan: {title: "${title}", description: "${description}", timeStart: "${timeStart}", timeEnd: "${timeEnd}", owner: "${username}"}) {
                        id
                    }
            } 
    }`},
    _ => planCreateResolve(),
    error => setError(error.message)
);

export const planEpics = [
    planRequestEpic,
    planUpdateEpic,
    planDeleteEpic,
    planCreateEpic
];







