import { getWorkTypes, setWorkTypes, setError } from "../slices/workTypeSlice";
import { createEpic } from "./helpers/createEpic";

export const workTypesEpic = createEpic(
    getWorkTypes.type,
    () => `
    query { 
        auth { 
            workTypes
        } 
    }`,
    data => setWorkTypes(data.data.auth.workTypes),
    error => setError(error.message)
);

export const workTypeEpics = [
    workTypesEpic
];