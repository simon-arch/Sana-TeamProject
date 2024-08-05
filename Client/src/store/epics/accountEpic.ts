import {ofType} from "redux-observable";
import {sendRequest} from './helpers/request';
import {from, mergeMap, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {getAccountInfo, logout, setAccountInfo, setError} from "../slices/accountSlice.ts";

const AccountEpic = (action$) => action$.pipe(
    ofType(getAccountInfo.type),
    mergeMap((action) => from(sendRequest(
        `query { user { get(username: "${action.payload}") { username, firstName, lastName, role, permissions } } }`
    ))
        .pipe(
        mergeMap((data) => of(setAccountInfo(data.data.user.get))),
        catchError((error) => {
            if (error.message === "Failed to fetch") {
                return of(logout());
            }
            return of(setError(error.message));
        })
    )
))

export default AccountEpic;