import {useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import config from "../../config.json";
import {useAppDispatch, useAppSelector} from "./redux.ts";
import {logout, setTokenExpire, tokenRequestResolve} from "../store/slices/accountSlice.ts";

const refreshTokenRequest = async ()=> {
    let response = null;

    try {
        response = await fetch(config.apiEndpoint, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `mutation { auth { refresh } }`
            })
        });
    }
    catch {
        return null;
    }
    const json = await response.json();

    if (json.error) return null;

    return json.data.auth.refresh as string;
}

const getExpirationTime = () => {
    const token = localStorage.getItem('authToken');

    if (!token) return 0;

    const decodedToken = jwtDecode(token);
    return decodedToken.exp! * 1000;
}

const UseTokenRefresh = (refreshGapMinutes: number) => {
    const dispatch = useAppDispatch();

    const isLoggedIn = useAppSelector(state => state.accountInfo.isLoggedIn);
    const isExpired = useAppSelector(state => state.accountInfo.isTokenExpired);

    const refreshGapMilliseconds = refreshGapMinutes * 60 * 1000;

    const refreshToken = () => {
        refreshTokenRequest().then(token => {
            if (!token) {
                if (isLoggedIn) {
                    dispatch(logout());
                }
            }
            else {
                localStorage.setItem('authToken', token);
                dispatch(tokenRequestResolve(token));
            }
        });
    }

    useEffect(() => {
        if (isExpired === null && isLoggedIn === null) {
            refreshToken();
        }
        else if (isLoggedIn) {
            if (isExpired) {
                refreshToken();
            }
            else {
                const timerId = setTimeout(() => {
                    dispatch(setTokenExpire(true));
                }, getExpirationTime() - Date.now() - refreshGapMilliseconds);
                return () => clearTimeout(timerId);
            }
        }
    }, [dispatch, isExpired]);
};

export default UseTokenRefresh;