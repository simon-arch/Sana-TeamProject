import { 
    setError, 
    permissionsRequest, permissionsRequestResolve
} from "../slices/permissionSlice";
import { createEpic } from "./helpers/createEpic";

export const permissionsEpic = createEpic(
    permissionsRequest.type,
    () => `
    query { 
        auth { 
            permissions 
        } 
    }`,
    data => permissionsRequestResolve(data.data.auth.permissions),
    error => setError(error.message)
);

export const permissionEpics = [
    permissionsEpic
];