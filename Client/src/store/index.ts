import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice.ts';
import roleSlice from './slices/roleSlice.ts';
import {combineEpics, createEpicMiddleware} from 'redux-observable';

import accountInfoSlice from './slices/accountSlice.ts';
import permissionSlice from './slices/permissionSlice.ts';
import {userEpics} from "./epics/userEpics.ts";
import workTypeSlice from "./slices/workTypeSlice.ts";
import timeStampSlice from './slices/timeStampSlice.ts';
import {timeStampEpics} from './epics/timeStampEpics.ts';
import planSlice from './slices/planSlice.ts';
import { planEpics } from './epics/planEpics.ts';


const rootReducer = combineReducers({
    users: userSlice,
    roles: roleSlice,
    workTypes: workTypeSlice,
    permissions: permissionSlice,
    accountInfo: accountInfoSlice,
    timeStamps: timeStampSlice,
    plans: planSlice
});

const epicMiddleware = createEpicMiddleware();

export const setupStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware)
    });

    epicMiddleware.run(combineEpics(...userEpics, ...timeStampEpics, ...planEpics));

    return store;
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
