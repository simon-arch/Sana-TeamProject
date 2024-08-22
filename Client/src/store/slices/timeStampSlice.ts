import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import TimeStamp from "../../models/TimeStamp.ts";
import {ErrorType, Status} from "../../helpers/types.ts";
import ResultSet from "../../models/ResultSet.ts";

export interface TimeStampState {
    TimeStamp: TimeStamp | null;
    timeStamps: TimeStamp[];
    totalCount: number;
    status: Status;
    error: ErrorType;
}

const initialState: TimeStampState = {
    TimeStamp: null,
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
            //@ts-ignore
            workTimeLatestRequest(state: TimeStampState, action) { state.status = 'loading'; },
            workTimeLatestRequestResolve(state: TimeStampState, action: PayloadAction<TimeStamp | null>)
            {
                state.TimeStamp = action.payload;
                state.status = 'idle';
            },
            workTimeListClear(state: TimeStampState) { state.timeStamps = [] },
            //@ts-ignore
            workTimeListRequest(state: TimeStampState, action) { state.status = 'loading'; },
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
            workTimeDelete(state: TimeStampState, action) { state.status = 'loading'; },
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

            setError(state: TimeStampState, action) {
                state.status = 'error'
                state.error = action.payload.error
            }
        }
    }
);

export const {
    workTimeLatestRequest, workTimeLatestRequestResolve,
    workTimeListClear,
    workTimeListRequest, workTimeListRequestResolve,
    workTimeUpdate, workTimeUpdateResolve,
    workTimeDelete, workTimeDeleteResolve,
    workTimeCreate, workTimeCreateResolve,
    setError,
} = timeStampSlice.actions;

export default timeStampSlice.reducer;