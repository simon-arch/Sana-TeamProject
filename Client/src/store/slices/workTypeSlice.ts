import { createSlice } from "@reduxjs/toolkit";
import {ErrorType, Status} from "../../helpers/types.ts";
import {WorkType} from "../../models/User.ts";

export interface UserState {
    workTypes: WorkType[];
    status: Status;
    error: ErrorType;
}

const initialState: UserState = {
    workTypes: [],
    status: 'loading',
    error: null
};

const workTypeSlice = createSlice(
    {
        name: 'work_types',
        initialState,
        reducers: {
            getWorkTypes(state){
                state.status = 'loading';
            },
            setWorkTypes(state, action) {
                state.status = 'idle';
                state.workTypes = action.payload.map((workType: string) => workType );
            },
            setError(state, action) {
                state.status = 'error';
                state.error = action.payload.error
            }
        }
    }
);

export const {
    getWorkTypes,
    setWorkTypes,
    setError
} = workTypeSlice.actions;

export default workTypeSlice.reducer;