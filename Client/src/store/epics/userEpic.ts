import { ofType } from 'redux-observable';
import { mergeMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { getUsers, setUsers } from '../slices/userSlice';
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
        })
      )}
    )
  );

export default userEpic;