import { ofType } from 'redux-observable';
import {map, switchMap} from 'rxjs/operators';
import { from } from 'rxjs';
import { getRoles, setRoles } from '../slices/roleSlice';
import { sendRequest } from './helpers/request';

const roleEpic = (action$: any) =>
  action$.pipe(
    ofType(getRoles.type),
    switchMap(() =>
      from(sendRequest(
        `query {
                auth {
                    roles
                }
            }`, localStorage.getItem('authToken')!
      )).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            map((data) => setRoles(data.data.auth.roles)),
          );
        })
      ) 
    )
  );

export default roleEpic;