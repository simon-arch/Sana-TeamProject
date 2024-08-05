import {useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import config from "../../config.json";
import {logout} from "../store/slices/accountSlice.ts";
import {useAppDispatch} from "./redux.ts";

async function refreshToken() : Promise<string | null> {
    const response = await fetch(config.apiEndpoint, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `mutation { auth { refresh } }`
        })
    });
    const json = await response.json();
    if (json.error) return null;
    else return json.data.auth.refresh;
}


const UseTokenRefresh = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        function getExpirationTime() : (number | null) {
            const token = localStorage.getItem('authToken');
            if (!token) return null;

            const decodedToken = jwtDecode(token);
            return decodedToken.exp! * 1000;
        }

        async function checkAndRefresh() {
            const currentTime = Date.now();
            const expirationTime = getExpirationTime();

            if (!expirationTime || expirationTime - currentTime <= 0) {
                dispatch(logout());
                localStorage.removeItem("authToken");
                return;
            }

            if (expirationTime - currentTime < 5 * 60 * 1000) {
                refreshToken().then(token => {
                    if (token) {
                        localStorage.setItem("authToken", token);
                    }
                });
            }
        }

        const interval = setInterval(checkAndRefresh, 60 * 1000);

        return () => clearInterval(interval);
    });
};

export default UseTokenRefresh;