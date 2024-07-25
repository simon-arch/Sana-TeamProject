import "../../assets/styles/tab-account.css";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/index.ts';
import Login from "./login.tsx";
import OffCanvas from "../offcanvas.tsx";
import AccountInfo from "./account-info.tsx";
import { getAccountStatus } from "../../store/slices/accountSlice.ts";
import { Button, Spinner } from "react-bootstrap";

const AccountWindow: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { name, isLoggedIn } = useSelector((state: RootState) => state.accountInfo);

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(getAccountStatus());
        }
    }, [dispatch]);

    if (isLoggedIn === null)
        return <Spinner id="login-spinner" animation="border" role="status"></Spinner>;

    return (
        <div className="account-container">
            {!isLoggedIn ? (
                <div id="login-container">
                    <Login />
                </div>
            ) : (
                <div id="welcome-container">
                    <OffCanvas title="Account Info Tab"
                                trigger={<span id="welcome-sign">Welcome,<br/>{name}!</span>}>
                        <AccountInfo/>
                    </OffCanvas>
                    <div id="control-container">
                        <Button variant='success' className="account-controls">placeholder1</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountWindow;
