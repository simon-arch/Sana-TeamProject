import { createSlice } from "@reduxjs/toolkit";

const initialState: string[] = [];

const permissionSlice = createSlice(
    {
        name: 'permissions',
        initialState,
        reducers: {
            getPermissions(){},
            setPermissions(state, action) {
                state;
                const permissions: string[] = action.payload.map((perm: string) => perm );
                return permissions;
            },
        }
    }
);

export const {
    getPermissions,
    setPermissions
} = permissionSlice.actions;

export default permissionSlice.reducer;