import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getPermissions, setError, setPermissions } from '../slices/permissionSlice';
import { sendRequest } from './helpers/request';

const permissionEpic = (action$: any) =>
  action$.pipe(
    ofType(getPermissions.type),
    mergeMap(() =>
      from(sendRequest(`
        query {
          auth {
            permissions 
          }
        }`, localStorage.getItem('authToken')!
    )).pipe(
        mergeMap((response) => {
          return from(response.json()).pipe(
            map((data) => setPermissions(data.data.auth.permissions)),
          );
        }),
        catchError((error) => {
          return of(setError(error.message));
        })
      ) 
    )
  );

export default permissionEpic;