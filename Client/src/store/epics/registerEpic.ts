import { ofType } from 'redux-observable';
import {from, of, switchMap} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { sendRequest } from './helpers/request';
import {  setError } from '../slices/accountSlice';
import {registerRequest, registerSuccess} from "../slices/userSlice.ts";

const registerEpic = (action$: any) => {
    return action$.pipe(
        ofType(registerRequest.type),
        switchMap((action: any) => {
            const { username, password, firstname, lastname, role, permissions } = action.payload;
            console.log('Registering user:', username, password, firstname, lastname, role, permissions);
            const authToken = localStorage.getItem('authToken') || '';

            const query = `
                mutation {
                    auth {
                        register(user: {
                            username: "${username}",
                            password: "${password}",
                            firstName: "${firstname}",
                            lastName: "${lastname}",
                            role: ${role},
                            permissions: ${JSON.stringify(permissions).replace(/"/g, '')} 
                        }) {
                            id
                            username
                            firstName
                            lastName
                            role
                            permissions
                        }
                    }
                }`;

            return from(sendRequest(query, authToken)).pipe(
                switchMap((response) => {
                    console.log('Response:', response);
                    return from(response.json());
                }),
                map((data) => {
                    console.log('Parsed data:', data);
                    if (data.errors) {
                        throw new Error(data.errors.map((err: any) => err.message).join(', '));
                    }
                    return registerSuccess(data.data.auth.register);
                }),
                catchError((error) => {
                    console.error('Error registering user:', error);
                    return of(setError('Error registering user'));
                })
            );
        })
    );
}

export default registerEpic;
