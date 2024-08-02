import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { getAccessToken, setAccountInfo, setError } from '../slices/accountSlice';
import { sendRequest } from './helpers/request';

const loginEpic = (action$: any) =>
  action$.pipe(
    ofType(getAccessToken.type),
    mergeMap((action: any) => from(sendRequest(`mutation { auth { login(username: "${action.payload.username}", password: "${action.payload.password}") } }`, ''))
    .pipe(
        mergeMap((data) => of(setAccountInfo(data.data.auth.login))),
        catchError((error) => of(setError(error.message))))
    )
);

export default loginEpic;
