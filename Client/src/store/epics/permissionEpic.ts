import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { getPermissions, setPermissions } from '../slices/permissionSlice';
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
        })
      ) 
    )
  );

export default permissionEpic;