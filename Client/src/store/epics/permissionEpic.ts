import { ofType } from 'redux-observable';
import { catchError, mergeMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getPermissions, setError, setPermissions } from '../slices/permissionSlice';
import { sendRequest } from './helpers/request';

const permissionEpic = (action$: any) =>
  action$.pipe(
    ofType(getPermissions.type),
    mergeMap(() => from(sendRequest(`query { auth { permissions } }`, localStorage.getItem('authToken')!))
    .pipe(
        mergeMap((data) => of(setPermissions(data.data.auth.permissions))),
        catchError((error) => of(setError(error.message))))
    )
);

export default permissionEpic;