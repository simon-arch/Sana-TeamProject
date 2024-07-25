import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { concatMap, catchError } from 'rxjs/operators';
import { getAccountStatus, getAccountInfo, setError } from '../slices/accountSlice';
import config from '../../../config.json'

const loginEpic = (action$: any) =>
action$.pipe(
    ofType(getAccountInfo.type),
    concatMap((action: any) => {
        const { username, password } = action.payload;
        return from(fetch(`${config.apiEndpoint}/Auth/Login?username=${username}&password=${password}`, {credentials: 'include'}, 
            )).pipe(
            concatMap((response) => {
                if (response.ok) {
                    return of(getAccountStatus());
                } else {
                    return of(setError('Authorization error!'));
                }
            }),
            catchError((error) => {
                console.error('Error fetching user account info:', error);
                return of(setError('Error fetching user account info.'));
            })
        );
    })
);

export default loginEpic;
