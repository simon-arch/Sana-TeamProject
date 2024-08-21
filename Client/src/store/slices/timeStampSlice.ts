import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { Status } from "../../helpers/types";

export interface TimeStamp {
    id: number,
    username: string,
    timeStart: Date,
    timeEnd: Date | null,
    source: 'SYSTEM' | 'USER' | 'TIMER',
    editor: string | null
}

export interface TimeStampState {
    currentTimeStamp: TimeStamp | null;
    timeStamps: TimeStamp[];
    totalCount: number;
    status: Status;
    error: string | null;
}

const initialState: TimeStampState = {
    currentTimeStamp: null,
    timeStamps: [],
    totalCount: 0,
    status: 'loading',
    error: null
};

const timeStampSlice = createSlice(
    {
        name: 'timeStamps',
        initialState,
        reducers: {
            worktimeListClear(state: TimeStampState) { state.timeStamps = [] },
            //@ts-ignore
            worktimeListRequest(state: TimeStampState, action) { state.status = 'loading'; },
            worktimeListRequestResolve(state: TimeStampState, action)
            {
                state.totalCount = action.payload.totalCount;
                let timeStamps = action.payload.results as TimeStamp[];

                state.timeStamps.forEach(tsp => {
                    timeStamps = timeStamps.filter(tsn => tsn.id !== tsp.id);
                })

                state.timeStamps = [...state.timeStamps, ...timeStamps];
                state.status = 'idle'; 
            },

            //@ts-ignore
            worktimeUpdate(state: TimeStampState, action) { state.status = 'loading'; },
            worktimeUpdateResolve(state: TimeStampState, action: PayloadAction<TimeStamp>)
            {
                const stamp = action.payload;

                const index = state.timeStamps.findIndex(ts => ts.id === stamp.id);
                if (index !== -1)
                {
                    state.timeStamps[index] = stamp;
                }
                state.status = 'idle'; 
            },

            //@ts-ignore
            worktimeDelete(state: TimeStampState, action) { state.status = 'loading'; },
            worktimeDeleteResolve(state: TimeStampState, action: PayloadAction<number>)
            {
                state.timeStamps = state.timeStamps.filter(ts => ts.id !== action.payload);
                state.status = 'idle';
            },

            //@ts-ignore
            worktimeCreate(state: TimeStampState, action) { state.status = 'loading'; },
            worktimeCreateResolve(state: TimeStampState, action: PayloadAction<TimeStamp>)
            {
                const stamp = action.payload;

                if (stamp.source === 'TIMER') {
                    state.currentTimeStamp = stamp;
                }

                const index = state.timeStamps.findIndex(ts => ts.id === stamp.id);
                if (index !== -1)
                {
                    state.timeStamps[index] = stamp;
                }
                else
                {
                    state.timeStamps.unshift(stamp);
                }

                state.status = 'idle';
            },

            setError(state: TimeStampState, action) {
                state.status = 'error'
                state.error = action.payload.error
            }
        }
    }
);

export const {
    worktimeListClear,
    worktimeListRequest, worktimeListRequestResolve,
    worktimeUpdate, worktimeUpdateResolve,
    worktimeDelete, worktimeDeleteResolve,
    worktimeCreate, worktimeCreateResolve,
    setError,
} = timeStampSlice.actions;

export default timeStampSlice.reducer;