import {ofType} from 'redux-observable';
import {from, of} from 'rxjs';
import {concatMap, map, catchError} from 'rxjs/operators';
import {checkAuthStatus, setAccountInfo, setError} from './accountSlice.ts';

const userAuthEpic = (action$: any) =>
    action$.pipe(
        ofType(checkAuthStatus.type),
        concatMap(() => {
            console.log('Fetching user authentication status...');
            return from(fetch('https://localhost:7102/checkAuth', {credentials: 'include'})).pipe(
                concatMap((response) => {
                    console.log('Response status:', response.status);
                    return from(response.json()).pipe(
                        map((data) => {
                            console.log('Received user data:', data);
                            return setAccountInfo(data);
                        })
                    );
                }),
                catchError((error) => {
                    console.error('Error fetching user account info:', error);
                    return of(setError('Error fetching user account info'));
                })
            );
        })
    );

export default userAuthEpic;
