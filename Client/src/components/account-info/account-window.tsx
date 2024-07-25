import "../../assets/styles/tab-account.css";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/index.ts';
import Login from "./login.tsx";
import OffCanvas from "../offcanvas.tsx";
import AccountInfo from "./account-info.tsx";
import { getAccountStatus } from "../../store/slices/accountSlice.ts";

const AccountComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { name, isLoggedIn } = useSelector((state: RootState) => state.accountInfo);

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(getAccountStatus());
        }
    }, [dispatch]);

    if (isLoggedIn === null)
        return null;

    return (
        <>
            {!isLoggedIn ? (
                <Login />
            ) : (
                <OffCanvas title="Account Tab"
                            trigger={<h4 id="welcome-sign">Welcome, {name}!</h4>} id="account-info">
                    <AccountInfo/>
                </OffCanvas>
            )}
        </>
    );
};

export default AccountComponent;
