import { 
    setError, 
    getPermissions, setPermissions 
} from "../slices/permissionSlice";
import { createEpic } from "./helpers/createEpic";

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

export const permissionEpics = [
    permissionsEpic
];