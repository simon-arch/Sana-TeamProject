import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from '../hooks/userSlice';
import roleSlice from '../hooks/roleSlice';
import { createEpicMiddleware } from 'redux-observable';
import roleEpic from '../hooks/roleEpic';
import userEpic from '../hooks/userEpic';
import accountInfoSlice from '../hooks/accountSlice.ts';
import loginEpic from '../hooks/loginEpic.ts';
import userAuthEpic from "../hooks/userAuthEpic.ts";

const rootReducer = combineReducers({
    users: userSlice,
    roles: roleSlice,
    accountInfo: accountInfoSlice
});

const epicMiddleware = createEpicMiddleware();

export const setupStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware)
    });

    epicMiddleware.run(userEpic);
    epicMiddleware.run(roleEpic);
    epicMiddleware.run(loginEpic);
    epicMiddleware.run(userAuthEpic);

    return store;
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
