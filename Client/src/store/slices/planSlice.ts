import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import Plan from "../../models/Plan.ts";
import {ErrorType, Status} from "../../helpers/types.ts";

export interface PlanState {
    plans: Plan[];
    status: Status;
    error: ErrorType;
}

const initialState: PlanState = {
    plans: [],
    status: 'loading',
    error: null
};

const planSlice = createSlice(
    {
        name: 'plans',
        initialState,
        reducers: {
            //@ts-ignore
            planRequest(state: PlanState, action) { state.status = 'loading'; },
            planRequestResolve(state: PlanState, action: PayloadAction<Plan[]>)
            {
                state.plans = action.payload;
                state.status = 'idle'; 
            },

            //@ts-ignore
            planUpdate(state: PlanState, action) { state.status = 'loading'; },
            planUpdateResolve(state: PlanState, action: PayloadAction<Plan>)
            {
                const plan = action.payload;

                const index = state.plans.findIndex(p => p.id === plan.id);
                if (index !== -1) {
                    state.plans[index] = plan;
                }

                state.status = 'idle'; 
            },

            //@ts-ignore
            planDelete(state: PlanState, action) { state.status = 'loading'; },
            planDeleteResolve(state: PlanState, action: PayloadAction<number>)
            {
                state.plans = state.plans.filter(p => p.id !== action.payload);
                state.status = 'idle'; 
            },

            //@ts-ignore
            planCreate(state: PlanState, action) { state.status = 'loading'; },
            planCreateResolve(state: PlanState, action: PayloadAction<Plan>)
            {
                state.plans.push(action.payload);
                state.status = 'idle'; 
            },

            setError(state: PlanState, action) {
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