import { ofType } from 'redux-observable';
import { concatMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { getRoles, setRoles } from './roleSlice';

const roleEpic = (action$: any) =>
  action$.pipe(
    ofType(getRoles.type),
    concatMap(() =>
      from(fetch('https://localhost:7102/roles')).pipe(
        concatMap((response) => {
          return from(response.json()).pipe(
            map((data) => setRoles(data)),
          );
        })
      )
    )
  );

export default roleEpic;