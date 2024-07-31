import { ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getUsers, setError, setUsers } from '../slices/userSlice';
import { sendRequest } from './helpers/request';

const userEpic = (action$: any) =>
  action$.pipe(
    ofType(getUsers.type),
    mergeMap(() => {
      return from(sendRequest(
        `query {
          user {
            get_all {
              id, firstName, lastName, role, permissions
            }
          }
        }`, localStorage.getItem('authToken')!
      )).pipe(
        mergeMap((response) => {
          return from(response.json()).pipe(
            map((data) => setUsers(data.data.user.get_all)),
          );
        }),
        catchError((error) => {
          return of(setError(error.message));
        })
      )}
    )
  );

export default userEpic;