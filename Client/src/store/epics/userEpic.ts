import { ofType } from 'redux-observable';
import { mergeMap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getUsers, setError, setUsers } from '../slices/userSlice';
import { sendRequest } from './helpers/request';

const userEpic = (action$: any) =>
  action$.pipe(
    ofType(getUsers.type),
    mergeMap(() => from(sendRequest(`query { user { get_all { id, firstName, lastName, role, permissions } } }`, localStorage.getItem('authToken')!))
    .pipe(
        mergeMap((data) => of(setUsers(data.data.user.get_all))),
        catchError((error) => of(setError(error.message))))
    )
);

export default userEpic;