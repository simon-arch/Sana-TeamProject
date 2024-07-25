import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { concatMap, map, catchError } from 'rxjs/operators';
import { getAccountStatus, setAccountInfo, setError } from '../slices/accountSlice.ts';
import config from '../../../config.json'

const authEpic = (action$: any) =>
action$.pipe(
    ofType(getAccountStatus.type),
    concatMap(() => {
        console.log('Fetching user authentication status...');
        return from(fetch(`${config.apiEndpoint}/User/GetCurrent`, {credentials: 'include'})).pipe(
            concatMap((response) => {
                console.log('Response status:', response.status);
                return from(response.json()).pipe(
                    map((data) => {
                        console.log('Received user data:', data);
                        return setAccountInfo(data);
                    })
                );
            }),
            catchError(() => {
                return of(setError(''));
            })
        );
    })
);

export default authEpic;
