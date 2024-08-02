import { ofType } from 'redux-observable';
import { catchError, mergeMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getRoles, setError, setRoles } from '../slices/roleSlice';
import { sendRequest } from './helpers/request';

const roleEpic = (action$: any) =>
  action$.pipe(
    ofType(getRoles.type),
    mergeMap(() => from(sendRequest(`query { auth { roles } }`, localStorage.getItem('authToken')!))
    .pipe(
        mergeMap((data) => of(setRoles(data.data.auth.roles))),
        catchError((error) => of(setError(error.message))))
    )
);

export default roleEpic;