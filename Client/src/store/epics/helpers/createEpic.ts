import {ofType} from "redux-observable";
import {catchError, mergeMap} from "rxjs/operators";
import {from, of} from "rxjs";
import {sendRequest} from "./sendRequest.ts";

export const createEpic = (
    actionType: string,
    createQuery: (action: any) => string,
    handleSuccess: (data: any) => any,
    handleError: (error: any) => any) => (action$: any) =>
    action$.pipe(
        ofType(actionType),
        mergeMap((action: any) => {
                return from(sendRequest(createQuery(action)))
                    .pipe(
                        mergeMap(data => {
                            return of(handleSuccess(data));
                        }),
                        catchError(error => of(handleError(error)))
                    );
            }
        ));