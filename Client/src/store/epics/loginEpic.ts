import { ofType } from 'redux-observable';
import {from, of, switchMap} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getAccessToken, setAccountInfo, setError } from '../slices/accountSlice';
import { sendRequest } from './helpers/request';

const loginEpic = (action$: any) =>
{
    return action$.pipe(
        ofType(getAccessToken.type),
        switchMap((action: any) => {
            const { username, password } = action.payload;
            return from(sendRequest(
                `mutation {
                    auth {
                        login(username: "${username}", password: "${password}")
                    }
                }`, '')
            ).pipe(
                switchMap(response => response.json()),
                switchMap((data) => {
                    return of(setAccountInfo(data.data.auth.login));
                }),
                catchError((error) => {
                    console.error('Error fetching user info:', error);
                    return of(setError('Error fetching user info.'));
                })
            );
        })
    );
}




export default loginEpic;
