import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {WorkType} from "../../models/User.ts";
import SliceState from "../../models/SliceState.ts";

export interface WorkTypeState extends SliceState {
    workTypes: WorkType[];
}

const initialState: WorkTypeState = {
    workTypes: [],
    status: 'loading',
    error: null
};

const workTypeSlice = createSlice(
    {
        name: 'work_types',
        initialState,
        reducers: {
            getWorkTypes(state: WorkTypeState){
                state.status = 'loading';
            },
            setWorkTypes(state: WorkTypeState, action: PayloadAction<WorkType[]>) {
                state.status = 'idle';
                state.workTypes = action.payload;
            },
            setError(state: WorkTypeState, action) {
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