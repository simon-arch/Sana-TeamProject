import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface TimeStamp {
    id: number,
    username: string,
    timeStart: Date,
    timeEnd: Date,
    source: 'SYSTEM' | 'USER',
    editor: string | null
}

export interface TimeStampState {
    timeStamps: TimeStamp[];
    status: 'idle' | 'loading' | 'error';
    error: string | null;
}

const initialState: TimeStampState = {
    timeStamps: <TimeStamp[]>{},
    status: 'loading',
    error: null
};

const timeStampSlice = createSlice(
    {
        name: 'timeStamps',
        initialState,
        reducers: {
            //@ts-ignore
            worktimeRequest(state, action: PayloadAction<string>) { state.status = 'loading'; },
            worktimeRequestResolve(state, action: PayloadAction<TimeStamp[]>) 
            {
                state.timeStamps = action.payload;
                state.status = 'idle'; 
            },

            //@ts-ignore
            worktimeUpdate(state, action) { state.status = 'loading'; },
            worktimeUpdateResolve(state)
            {
                state.status = 'idle'; 
            },

            //@ts-ignore
            worktimeDelete(state, action) { state.status = 'loading'; },
            worktimeDeleteResolve(state)
            {
                state.status = 'idle'; 
            },

            //@ts-ignore
            worktimeCreate(state, action) { state.status = 'loading'; },
            worktimeCreateResolve(state)
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
    worktimeRequest, worktimeRequestResolve,
    worktimeUpdate, worktimeUpdateResolve,
    worktimeDelete, worktimeDeleteResolve,
    worktimeCreate, worktimeCreateResolve,
    setError,
} = timeStampSlice.actions;

export default timeStampSlice.reducer;