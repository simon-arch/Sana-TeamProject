import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
    workTypes: string[];
    status: 'idle' | 'loading' | 'error';
    error: string | null
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