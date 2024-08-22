import { 
    getRoles, setError, setRoles 
} from "../slices/roleSlice";
import { createEpic } from "./helpers/createEpic";

export const rolesEpic = createEpic(
    getRoles.type,
    () => `
    query { 
        auth { 
            roles 
        } 
    }`,
    data => setRoles(data.data.auth.roles),
    error => setError(error.message)
);

export const roleEpics = [
    rolesEpic
];