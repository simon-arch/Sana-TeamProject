import {
    getAccessToken,
    setTokenPayload,
    setError,
    getAccountInfo,
    setAccountInfo,
    logout
} from '../slices/accountSlice';
import {createEpic} from "./helpers/createEpic.ts";


// const loginEpic = (action$: any) =>
//   action$.pipe(
//     ofType(getAccessToken.type),
//     mergeMap((action: any) => from(sendRequest(`mutation { auth { login(username: "${action.payload.username}", password: "${action.payload.password}") } }`))
//     .pipe(
//         mergeMap((data) => of(setTokenPayload(data.data.auth.login))),
//         catchError((error) => of(setError(error.message))))
//     )
// );

// const AccountEpic = (action$: any) => action$.pipe(
//     ofType(getAccountInfo.type),
//     mergeMap((action: any) => from(sendRequest(
//             `query { user { get(username: "${action.payload}") { username, firstName, lastName, role, permissions } } }`
//         ))
//             .pipe(
//                 mergeMap((data) => of(setAccountInfo(data.data.user.get))),
//                 catchError((error) => {
//                     if (error.message === "Failed to fetch") {
//                         return of(logout());
//                     }
//                     return of(setError(error.message));
//                 })
//             )
//     ))

export const accountEpic = createEpic(
    getAccountInfo.type,
    (action: any) => `query { user { get(username: "${action.payload}") { username, firstName, lastName, role, permissions } } }`,
    data => setAccountInfo(data.data.user.get),
    error => {
        if (error.message === "Failed to fetch") {
            return logout();
        }
        return setError(error.message);
    }
);

export const loginEpic = createEpic(
    getAccessToken.type,
    (action: any) => `mutation { auth { login(username: "${action.payload.username}", password: "${action.payload.password}") } }`,
    data => setTokenPayload(data.data.auth.login),
    error => setError(error.message)
);



