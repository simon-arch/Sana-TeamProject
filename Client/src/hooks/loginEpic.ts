import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { concatMap, map, catchError } from 'rxjs/operators';
import { getAccountInfo, setAccountInfo, setError } from './accountSlice.ts';

const loginEpic = (action$: any) =>
    action$.pipe(
        ofType(getAccountInfo.type),
        concatMap((action: any) => {
            const { usrn, psw } = action.payload;
            return from(fetch(`https://localhost:7102/login?usrn=${usrn}&psw=${psw}`, { credentials: 'include' })).pipe(
                concatMap((response) => {
                    if (response.ok) {
                        return from(response.json()).pipe(
                            map((data) => setAccountInfo(data))
                        )
                    } else {
                        return of(setError('Authorization error!'));
                    }
                }),
                catchError((error) => {
                    console.error('Error fetching user account info:', error);
                    return of(setError('Error fetching user account info'));
                })
            );
        })
    );

export default loginEpic;
