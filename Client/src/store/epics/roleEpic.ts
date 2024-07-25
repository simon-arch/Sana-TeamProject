import { ofType } from 'redux-observable';
import { concatMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { getRoles, setRoles } from '../slices/roleSlice';
import config from '../../../config.json'

const roleEpic = (action$: any) =>
  action$.pipe(
    ofType(getRoles.type),
    concatMap(() =>
      from(fetch(`${config.apiEndpoint}/Role/GetAll`, {credentials: 'include'})).pipe(
        concatMap((response) => {
          return from(response.json()).pipe(
            map((data) => setRoles(data)),
          );
        })
      ) 
    )
  );

export default roleEpic;