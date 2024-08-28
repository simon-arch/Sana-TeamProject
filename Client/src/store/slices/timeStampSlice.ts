import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import TimeStamp from "../../models/TimeStamp.ts";
import ResultSet from "../../models/ResultSet.ts";
import SliceState from "../../models/SliceState.ts";

export interface TimeStampState extends SliceState {
    TimeStamp: TimeStamp | null;
    timeStamps: TimeStamp[];
    monthStamps: TimeStamp[];
    totalCount: number;
}

export interface workTimeListRequestPayload {
    username: string,
    pageSize: number,
    pageNumber: number
}

const initialState: TimeStampState = {
    TimeStamp: null,
    timeStamps: [],
    monthStamps: [],
    totalCount: 0,
    status: 'loading',
    error: null
};

const timeStampSlice = createSlice(
    {
        name: 'timeStamps',
        initialState,
        reducers: {
            workTimeLatestClear(state: TimeStampState) { state.TimeStamp = null; },
            //@ts-ignore
            workTimeLatestRequest(state: TimeStampState, action: PayloadAction<string>) { state.status = 'loading'; },
            workTimeLatestRequestResolve(state: TimeStampState, action: PayloadAction<TimeStamp | null>) {
                state.TimeStamp = action.payload;
                state.status = 'idle';
            },
            workTimeListClear(state: TimeStampState) { state.timeStamps = [] },
            //@ts-ignore
            workTimeListRequest(state: TimeStampState, action: PayloadAction<workTimeListRequestPayload>) { state.status = 'loading'; },
            workTimeListRequestResolve(state: TimeStampState, action: PayloadAction<ResultSet<TimeStamp>>)
            {
                state.totalCount = action.payload.totalCount;
                let timeStamps = action.payload.results;

                state.timeStamps.forEach(tsp => {
                    timeStamps = timeStamps.filter(tsn => tsn.id !== tsp.id);
                })

                state.timeStamps = [...state.timeStamps, ...timeStamps];
                state.status = 'idle';
            },

            //@ts-ignore
            workTimeUpdate(state: TimeStampState, action) { state.status = 'loading'; },
            workTimeUpdateResolve(state: TimeStampState, action: PayloadAction<TimeStamp>)
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
            workTimeDelete(state: TimeStampState, action: PayloadAction<number>) { state.status = 'loading'; },
            workTimeDeleteResolve(state: TimeStampState, action: PayloadAction<number>)
            {
                state.timeStamps = state.timeStamps.filter(ts => ts.id !== action.payload);
                state.status = 'idle';
            },

            //@ts-ignore
            workTimeCreate(state: TimeStampState, action) { state.status = 'loading'; },
            workTimeCreateResolve(state: TimeStampState, action: PayloadAction<TimeStamp>)
            {
                const stamp = action.payload;

                if (stamp.source === 'TIMER') {
                    state.TimeStamp = stamp;
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

            //@ts-ignore
            workTimeIntervalRequest(state: TimeStampState, action) { state.status = 'loading'; },
            workTimeIntervalRequestResolve(state: TimeStampState, action)
            {
                state.monthStamps = action.payload;
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
    workTimeLatestRequest, workTimeLatestRequestResolve,
    workTimeListClear, workTimeLatestClear,
    workTimeListRequest, workTimeListRequestResolve,
    workTimeUpdate, workTimeUpdateResolve,
    workTimeDelete, workTimeDeleteResolve,
    workTimeCreate, workTimeCreateResolve,
    workTimeIntervalRequest, workTimeIntervalRequestResolve,
    setError,
} = timeStampSlice.actions;

export default timeStampSlice.reducer;