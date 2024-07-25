import { ofType } from 'redux-observable';
import { concatMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { getUsers, setUsers } from '../slices/userSlice';
import config from '../../../config.json'

const userEpic = (action$: any) =>
  action$.pipe(
    ofType(getUsers.type),
    concatMap(() =>
      from(fetch(`${config.apiEndpoint}/User/GetAll`, {credentials: 'include'})).pipe(
        concatMap((response) => {
          return from(response.json()).pipe(
            map((data) => setUsers(data)),
          );
        })
      )
    )
  );

export default userEpic;