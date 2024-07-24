import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';

import Login from "./login.tsx";
import OffCanvas from "../offcanvas.tsx";
import AccountInfo from "./accout-info.tsx";
import { checkAuthStatus } from "../../hooks/accountSlice";

const AccountComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { name, isLoggedIn } = useSelector((state: RootState) => state.accountInfo);

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(checkAuthStatus());
        }
    }, [dispatch]);


    return (
        <>
            {!isLoggedIn ? (
                <Login />
            ) : (
                <>
                    <OffCanvas title="Account Info" placement="start"
                               trigger={<h4 style={{textAlign: "center"}}>Hello, {name}!</h4>} id="account-info">
                        <AccountInfo />
                    </OffCanvas>

                </>
            )}
        </>
    );
};

export default AccountComponent;
