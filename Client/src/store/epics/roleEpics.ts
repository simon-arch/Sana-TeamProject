import { 
    rolesRequest, setError, rolesRequestResolve
} from "../slices/roleSlice";
import { createEpic } from "./helpers/createEpic";

export const rolesEpic = createEpic(
    rolesRequest.type,
    () => `
    query { 
        auth { 
            roles 
        } 
    }`,
    data => rolesRequestResolve(data.data.auth.roles),
    error => setError(error.message)
);

export const roleEpics = [
    rolesEpic
];