import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getRoles, setError, setRoles } from '../slices/roleSlice';
import { sendRequest } from './helpers/request';

const roleEpic = (action$: any) =>
  action$.pipe(
    ofType(getRoles.type),
    mergeMap(() =>
      from(sendRequest(
        `query {
                auth {
                    roles
                }
            }`, localStorage.getItem('authToken')!
      )).pipe(
        mergeMap((response) => {
          return from(response.json()).pipe(
            map((data) => setRoles(data.data.auth.roles)),
          );
        }),
        catchError((error) => {
          return of(setError(error.message));
        })
      ) 
    )
  );

export default roleEpic;