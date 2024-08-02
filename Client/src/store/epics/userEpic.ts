import { ofType } from 'redux-observable';
import { mergeMap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getUsers, setError, setUsers } from '../slices/userSlice';
import { sendRequest } from './helpers/request';

const userEpic = (action$: any) =>
  action$.pipe(
    ofType(getUsers.type),
    mergeMap(() => from(sendRequest(`query { user { get_all { username, firstName, lastName, role, permissions } } }`)) // <------
    .pipe(
        mergeMap((data) => of(setUsers(data.data.user.get_all))),
        catchError((error) => {
                                          // shitty implementation:
          switch(error.message) {
            case "UNAUTHORIZED":          // one of the ways how to do this.
              console.log(error.message); // query still needs to be called again while reusing big chunk of the code above.
              sendRequest(`mutation { auth { refresh } }`).then(json => localStorage.setItem('authToken', json.data.auth.refresh));
              break;
          }
          return of(setError(error.message))
        })
      )
    )
);

export default userEpic;