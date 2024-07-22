import { ofType } from 'redux-observable';
import { concatMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { getUsers, setUsers } from './userSlice';

const userEpic = (action$: any) =>
  action$.pipe(
    ofType(getUsers.type),
    concatMap(() =>
      from(fetch('https://localhost:7102/userroles')).pipe(
        concatMap((response) => {
          return from(response.json()).pipe(
            map((data) => setUsers(data)),
          );
        })
      )
    )
  );

export default userEpic;