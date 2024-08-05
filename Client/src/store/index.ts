import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice.ts';
import roleSlice from './slices/roleSlice.ts';
import { createEpicMiddleware } from 'redux-observable';
import roleEpic from './epics/roleEpic.ts';
import usersEpic from './epics/usersEpic.ts';
import accountInfoSlice from './slices/accountSlice.ts';
import loginEpic from './epics/loginEpic.ts';
import permissionEpic from './epics/permissionEpic.ts';
import permissionSlice from './slices/permissionSlice.ts';
import accountEpic from "./epics/accountEpic.ts";

const rootReducer = combineReducers({
    users: userSlice,
    roles: roleSlice,
    permissions: permissionSlice,
    accountInfo: accountInfoSlice
});

const epicMiddleware = createEpicMiddleware();

export const setupStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware)
    });

    epicMiddleware.run(usersEpic);
    epicMiddleware.run(roleEpic);
    epicMiddleware.run(loginEpic);
    epicMiddleware.run(permissionEpic);
    epicMiddleware.run(accountEpic);

    return store;
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
