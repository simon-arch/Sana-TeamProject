import { ofType } from 'redux-observable';
import { concatMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { getPermissions, setPermissions } from '../slices/permissionSlice';
import config from '../../../config.json'

const permissionEpic = (action$: any) =>
  action$.pipe(
    ofType(getPermissions.type),
    concatMap(() =>
      from(fetch(`${config.apiEndpoint}/Permission/GetAll`, {credentials: 'include'})).pipe(
        concatMap((response) => {
          return from(response.json()).pipe(
            map((data) => setPermissions(data)),
          );
        })
      ) 
    )
  );

export default permissionEpic;