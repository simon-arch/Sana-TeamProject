import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { Status } from "../../helpers/types";

export interface Plan {
    id: number,
    title: string,
    description: string | null,
    timeStart: Date,
    timeEnd: Date,
    owner: string
}

export interface PlanState {
    plans: Plan[];
    status: Status;
    error: string | null;
}

const initialState: PlanState = {
    plans: <Plan[]>{},
    status: 'loading',
    error: null
};

const planSlice = createSlice(
    {
        name: 'plans',
        initialState,
        reducers: {
            //@ts-ignore
            planRequest(state, action: PayloadAction<string[]>) { state.status = 'loading'; },
            planRequestResolve(state, action: PayloadAction<Plan[]>) 
            {
                state.plans = action.payload;
                state.status = 'idle'; 
            },

            //@ts-ignore
            planUpdate(state, action) { state.status = 'loading'; },
            planUpdateResolve(state)
            {
                state.status = 'idle'; 
            },

            //@ts-ignore
            planDelete(state, action) { state.status = 'loading'; },
            planDeleteResolve(state)
            {
                state.status = 'idle'; 
            },

            //@ts-ignore
            planCreate(state, action) { state.status = 'loading'; },
            planCreateResolve(state)
            {
                state.status = 'idle'; 
            },

            setError(state, action) {
                state.status = 'error'
                state.error = action.payload.error
            }
        }
    }
);

export const {
    planRequest, planRequestResolve,
    planUpdate, planUpdateResolve,
    planDelete, planDeleteResolve,
    planCreate, planCreateResolve,
    setError,
} = planSlice.actions;

export default planSlice.reducer;