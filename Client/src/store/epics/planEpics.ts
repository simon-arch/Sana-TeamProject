import { 
    setError, 
    planCreate, planCreateResolve, 
    planDelete, planDeleteResolve, 
    planRequest, planRequestResolve, 
    planUpdate, planUpdateResolve 
} from "../slices/planSlice";
import { createEpic } from "./helpers/createEpic";

export const planRequestEpic = createEpic(
    planRequest.type,
    action => {
        const usernames = action.payload;
        return `query {
                plan {
                    byUsernames(usernames: [${usernames.map((username: string) => `"${username}"`).join(',')}]) {
                        id
                        timeStart
                        timeEnd
                        owner
                    }
            }
    }`},
    data => planRequestResolve(data.data.plan["byUsernames"]),
    error => setError(error.message)
);

export const planUpdateEpic = createEpic(
    planUpdate.type,
    action => {
        const { id, timeStart, timeEnd } = action.payload;
        return `mutation {
                plan {
                    update(
                        id: ${id}
                        timeStart: "${timeStart}"
                        timeEnd: "${timeEnd}"
                    ) {
                        id
                        timeStart
                        timeEnd
                        owner  
                    }
            } 
    }`},
    data => planUpdateResolve(data.data.plan.update),
    error => setError(error.message)
);

export const planDeleteEpic = createEpic(
    planDelete.type,
    action => {
        const id = action.payload;
        return `mutation {
                plan {
                    remove(id: ${id}) { id }
            } 
    }`},
    data => planDeleteResolve(data.data.plan.remove.id),
    error => setError(error.message)
);

export const planCreateEpic = createEpic(
    planCreate.type,
    action => {
        const { timeStart, timeEnd, username } = action.payload;
        return `mutation {
                plan {
                    add(
                        plan: {
                            timeStart: "${timeStart}"
                            timeEnd: "${timeEnd}"
                            owner: "${username}"
                        }
                    ) {
                        id
                        timeStart
                        timeEnd
                        owner
                    }
            } 
    }`},
    data => planCreateResolve(data.data.plan.add),
    error => setError(error.message)
);

export const planEpics = [
    planRequestEpic,
    planUpdateEpic,
    planDeleteEpic,
    planCreateEpic
];







